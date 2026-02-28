#!/usr/bin/env python3
"""
Dependency analysis tool for Opsis Plan.
Parses tasks.md to extract dependencies and generates execution strategy.
Uses mistletoe for reliable parsing and rendering with pure AST building.
"""

import re
import json
import sys
from pathlib import Path
from typing import Dict, List, Set, Optional, Tuple
from collections import defaultdict
from dataclasses import dataclass

import networkx as nx
from task_parser import TaskParser, TaskFile, DependencyAnalyzer

import mistletoe
from mistletoe import Document, block_token, span_token, markdown_renderer


# ============================================================================
# Helper Functions for AST Construction
# ============================================================================

def make_code_fence(lines: List[str], language: str = "text") -> block_token.CodeFence:
    """Create a CodeFence AST node with the given lines and language.
    
    Args:
        lines: List of code lines
        language: Language identifier (e.g., 'mermaid', 'python', etc.)
    
    Returns:
        CodeFence AST node
    """
    # CodeFence match format: (lines, open_info)
    # open_info is (indentation, delimiter, info_string, lang)
    # indentation must be an integer
    open_info = (0, "```", "", language)
    return block_token.CodeFence((lines, open_info))


def make_heading(level: int, text: str) -> block_token.Heading:
    """Create a Heading AST node with the given level and text.
    
    Args:
        level: Heading level (1-6)
        text: Heading text content
    
    Returns:
        Heading AST node
    """
    # Heading match format: (level, content, closing_sequence)
    closing = "#" * level
    return block_token.Heading((level, text, closing))


def make_list(items: List[str]) -> block_token.List:
    """Create a List AST node from a list of text items.
    
    Args:
        items: List of text strings for list items
    
    Returns:
        List AST node
    """
    from mistletoe.block_tokenizer import ParseBuffer
    
    matches = []
    for item in items:
        parse_buffer = ParseBuffer()
        parse_buffer.append((block_token.Paragraph, [item], 1))
        # Match format: (parse_buffer, indentation, prepend, leader, line_number)
        matches.append((parse_buffer, 0, 0, "-", 1))
    
    return block_token.List(matches)


def calculate_parallelization(classified_groups: List['ExecutionGroup']) -> Tuple[int, float, str]:
    """Calculate parallelization metrics and determine strategy.
    
    Args:
        classified_groups: List of classified execution groups
    
    Returns:
        Tuple of (parallel_task_count, parallelization_ratio, recommended_strategy)
    """
    parallel_tasks = sum(len(g.tasks) for g in classified_groups if g.type == "parallel")
    total_tasks = sum(g.task_count for g in classified_groups)
    parallelization_ratio = (parallel_tasks / total_tasks * 100) if total_tasks > 0 else 0
    
    if parallelization_ratio >= 50:
        recommended_strategy = "highly_parallel"
    elif parallelization_ratio >= 30:
        recommended_strategy = "moderately_parallel"
    else:
        recommended_strategy = "mostly_sequential"
    
    return parallel_tasks, parallelization_ratio, recommended_strategy


@dataclass
class ExecutionGroup:
    """Represents a group of tasks that can execute together."""
    group_id: str
    type: str  # "parallel" or "sequential"
    task_count: int
    tasks: List[str]
    requires_fan_in: bool
    execution_mode: str
    reason: str


@dataclass
class FanInPoint:
    """Represents a fan-in synchronization point."""
    group_index: int
    synchronization_task: str
    waiting_for: List[str]


class AnalysisEngine:
    """Main analysis engine for dependency analysis."""
    
    def __init__(self, tasks_path: Path):
        self.tasks_path = tasks_path
        self.task_file: Optional[TaskFile] = None
        self.graph: nx.DiGraph = nx.DiGraph()
    
    def run(self) -> Tuple[List[ExecutionGroup], List[FanInPoint], int, str]:
        """Run full analysis pipeline."""
        # Step 1: Parse tasks file
        print(f"Parsing tasks from {self.tasks_path}...", file=sys.stderr)
        parser = TaskParser(self.tasks_path)
        self.task_file = parser.parse()
        
        # Step 2: Derive dependencies
        print("Deriving dependencies...", file=sys.stderr)
        analyzer = DependencyAnalyzer(self.task_file)
        analyzer.analyze()
        
        # Step 3: Build NetworkX graph
        self._build_graph()
        
        # Step 4: Get execution groups
        groups = self._get_execution_groups()
        print(f"Identified {len(groups)} execution groups", file=sys.stderr)
        
        # Step 5: Classify groups
        classified = self._classify_groups(groups)
        
        # Step 6: Detect fan-in points
        fan_in = self._detect_fan_in_points(classified)
        print(f"Detected {len(fan_in)} fan-in points", file=sys.stderr)
        
        # Step 7: Update tasks file with derived data
        print("Updating tasks.md with derived metadata...", file=sys.stderr)
        self._update_tasks_file(classified)
        
        # Step 8: Generate mermaid graph
        mermaid_graph = self._generate_mermaid_graph(classified)
        
        return classified, fan_in, len(self.task_file.get_all_tasks()), mermaid_graph
    
    def _build_graph(self) -> None:
        """Build NetworkX dependency graph."""
        all_tasks = self.task_file.get_all_tasks()
        task_ids = {task.id for task in all_tasks}
        
        for task in all_tasks:
            # Only add edges for dependencies that exist
            valid_deps = [dep for dep in task.depends if dep in task_ids]
            self.graph.add_node(task.id, title=task.title, phase=task.phase)
            for dep in valid_deps:
                self.graph.add_edge(dep, task.id)
    
    def _get_execution_groups(self) -> List[List[str]]:
        """Get execution groups using NetworkX topological generations."""
        if not nx.is_directed_acyclic_graph(self.graph):
            raise ValueError("Dependency graph contains cycles")
        
        return list(nx.topological_generations(self.graph))
    
    def _classify_groups(self, groups: List[List[str]]) -> List[ExecutionGroup]:
        """Classify each execution group as parallel or sequential."""
        classified = []
        
        for idx, group in enumerate(groups):
            if len(group) == 1:
                group_type = "sequential"
                reason = "Single task requires sequential execution"
            elif len(group) >= 3:
                group_type = "parallel"
                reason = f"{len(group)} independent tasks can execute in parallel"
            else:
                # 2 tasks - can be parallel if no conflicts
                group_type = "parallel"
                reason = f"2 independent tasks can execute in parallel"
            
            # Determine execution mode
            execution_mode = (
                "opsis-dispatching-parallel-agents" 
                if group_type == "parallel" and len(group) >= 3 
                else "opsis-implement"
            )
            
            classified.append(ExecutionGroup(
                group_id=f"Group-{idx}",
                type=group_type,
                task_count=len(group),
                tasks=group,
                requires_fan_in=len(group) > 1,
                execution_mode=execution_mode,
                reason=reason
            ))
        
        return classified
    
    def _detect_fan_in_points(self, classified_groups: List[ExecutionGroup]) -> List[FanInPoint]:
        """Detect fan-in synchronization points."""
        fan_in_points = []
        
        for i, group in enumerate(classified_groups):
            if i + 1 >= len(classified_groups):
                continue
            
            next_group = classified_groups[i + 1]
            
            for next_task in next_group.tasks:
                # Get dependencies of this task
                deps = list(self.graph.predecessors(next_task))
                deps_in_current = [dep for dep in deps if dep in group.tasks]
                
                if len(deps_in_current) >= 2:
                    fan_in_points.append(FanInPoint(
                        group_index=i,
                        synchronization_task=next_task,
                        waiting_for=deps_in_current
                    ))
        
        return fan_in_points
    
    def _update_tasks_file(self, classified_groups: List[ExecutionGroup]) -> None:
        """Update tasks.md with execution group metadata."""
        all_tasks = self.task_file.get_all_tasks()
        task_to_group = {}
        
        for group in classified_groups:
            for task_id in group.tasks:
                task_to_group[task_id] = group
        
        for task in all_tasks:
            group = task_to_group.get(task.id)
            if group:
                task.execution_group = int(group.group_id.split('-')[1])
        
        # Write updated file using mistletoe
        from task_parser import TaskFileWriter
        writer = TaskFileWriter(self.task_file)
        writer.write(self.tasks_path)
    
    def _generate_mermaid_graph(self, classified_groups: List[ExecutionGroup]) -> block_token.CodeFence:
        """Generate Mermaid dependency graph visualization as AST CodeFence."""
        lines = ["graph TD"]
        
        # Group tasks by phase
        phase_groups = defaultdict(list)
        all_tasks = self.task_file.get_all_tasks()
        for task in all_tasks:
            if task.phase:
                phase_groups[task.phase].append(task)
        
        # Add subgraphs for phases
        for idx, (phase, phase_tasks) in enumerate(sorted(phase_groups.items()), 1):
            phase_name = f"Phase {phase}"
            lines.append(f'    subgraph {phase_name}')
            
            for task in phase_tasks:
                title = task.title[:30] + '...' if len(task.title) > 30 else task.title
                lines.append(f'    {task.id}["{task.id}: {title}"]')
            
            lines.append("    end")
        
        # Add dependency arrows
        for edge in self.graph.edges:
            lines.append(f"    {edge[0]} --> {edge[1]}")
        
        # Add styling
        for group in classified_groups:
            color = "#e1f5e1" if group.type == "parallel" else "#ffe1e1"
            for task_id in group.tasks:
                lines.append(f"    style {task_id} fill:{color}")
        
        return make_code_fence(lines, "mermaid")


def generate_analysis_markdown(
    classified_groups: List[ExecutionGroup],
    fan_in_points: List[FanInPoint],
    total_tasks: int
) -> Document:
    """Generate parallelization analysis as a Document AST."""
    
    parallel_tasks, parallelization_ratio, recommended_strategy = calculate_parallelization(classified_groups)
    
    # Strategy descriptions
    strategy_descriptions = {
        "highly_parallel": "Most tasks can execute in parallel. Use opsis-dispatching-parallel-agents for parallel execution.",
        "moderately_parallel": "Significant parallelization possible. Use opsis-two-stage-review-execution for balanced approach.",
        "mostly_sequential": "Limited parallelization due to dependencies. Use opsis-implement for direct execution."
    }
    strategy_desc = strategy_descriptions.get(recommended_strategy, "")
    
    # Build document children
    children = []
    
    # Title heading
    children.append(make_heading(1, "Parallelization Analysis"))
    
    # Overview section
    children.append(make_heading(2, "Overview"))
    
    overview_items = [
        f"**Total Tasks:** {total_tasks}",
        f"**Parallelizable Tasks:** {parallel_tasks} ({parallelization_ratio:.1f}%)",
        f"**Execution Groups:** {len(classified_groups)}",
        f"**Recommended Strategy:** {recommended_strategy}",
        f"**Strategy Description:** {strategy_desc}"
    ]
    children.append(make_list(overview_items))
    
    # Execution Groups section
    children.append(make_heading(2, "Execution Groups"))
    
    for group in classified_groups:
        children.append(make_heading(3, group.group_id))
        
        group_items = [
            f"**Type:** {group.type}",
            f"**Task Count:** {group.task_count}",
            f"**Execution Mode:** {group.execution_mode}",
            f"**Reason:** {group.reason}",
            f"**Requires Fan-in:** {group.requires_fan_in}",
            f"**Tasks:** {', '.join(group.tasks)}"
        ]
        children.append(make_list(group_items))
    
    # Fan-in points section
    if fan_in_points:
        children.append(make_heading(2, "Fan-in Synchronization Points"))
        
        for i, fan_in in enumerate(fan_in_points, 1):
            children.append(make_heading(3, f"Fan-in Point {i}"))
            
            fanin_items = [
                f"**Group Index:** {fan_in.group_index}",
                f"**Synchronization Task:** {fan_in.synchronization_task}",
                f"**Waiting For:** {', '.join(fan_in.waiting_for)}"
            ]
            children.append(make_list(fanin_items))
            
            # Action paragraph
            action_text = "**Action:** Wait for all tasks in the group to complete before proceeding."
            children.append(block_token.Paragraph([action_text]))
    
    # Execution Flow section
    children.append(make_heading(2, "Execution Flow"))
    
    # Build execution flow code fence
    flow_lines = []
    for group in classified_groups:
        mode_emoji = "⚡" if group.type == "parallel" else "➡️"
        flow_lines.append(f"{mode_emoji} {group.group_id}: {group.type.upper()} ({group.task_count} tasks)")
        flow_lines.append(f"   Mode: {group.execution_mode}")
        flow_lines.append(f"   Tasks: {', '.join(group.tasks[:3])}" + 
                    ("..." if len(group.tasks) > 3 else ""))
        flow_lines.append("")
    
    children.append(make_code_fence(flow_lines, "text"))
    
    # Create and return Document
    doc = Document(lines=[])
    doc.children = children
    doc.footnotes = {}
    
    return doc





def main():
    """Main entry point."""
    if len(sys.argv) < 2:
        print("Usage: analyze_dependencies.py <tasks.md> [output_dir]", file=sys.stderr)
        sys.exit(1)
    
    tasks_path = Path(sys.argv[1])
    if not tasks_path.exists():
        print(f"Error: {tasks_path} does not exist", file=sys.stderr)
        sys.exit(1)
    
    output_dir = Path(sys.argv[2]) if len(sys.argv) > 2 else tasks_path.parent
    
    # Run analysis
    engine = AnalysisEngine(tasks_path)
    classified, fan_in, total_tasks, mermaid_graph = engine.run()
    
    print(f"Found {total_tasks} tasks in {len(classified)} execution groups", file=sys.stderr)
    
    # Calculate parallelization metrics
    parallel_tasks, parallelization_ratio, recommended_strategy = calculate_parallelization(classified)
    
    # Generate analysis markdown as AST
    analysis_doc = generate_analysis_markdown(classified, fan_in, total_tasks)
    
    # Generate mermaid graph as AST
    mermaid_codeblock = engine._generate_mermaid_graph(classified)
    
    # Render AST to markdown
    with markdown_renderer.MarkdownRenderer() as renderer:
        mermaid_md = renderer.render(mermaid_codeblock)
        analysis_md = renderer.render(analysis_doc)
    
    # Write outputs
    dependency_graph_path = output_dir / "dependency-graph.mmd"
    analysis_path = output_dir / "parallelization-analysis.md"
    json_path = output_dir / "parallelization-analysis.json"
    
    dependency_graph_path.write_text(mermaid_md)
    analysis_path.write_text(analysis_md)
    
    json_output = {
        "total_tasks": total_tasks,
        "execution_groups": [
            {
                "group_id": g.group_id,
                "type": g.type,
                "task_count": g.task_count,
                "tasks": g.tasks,
                "requires_fan_in": g.requires_fan_in,
                "execution_mode": g.execution_mode,
                "reason": g.reason
            }
            for g in classified
        ],
        "fan_in_points": [
            {
                "group_index": f.group_index,
                "synchronization_task": f.synchronization_task,
                "waiting_for": f.waiting_for
            }
            for f in fan_in
        ],
        "parallelization_ratio": parallelization_ratio,
        "recommended_strategy": recommended_strategy
    }
    
    json_path.write_text(json.dumps(json_output, indent=2))
    
    print(f"✓ Generated {dependency_graph_path}", file=sys.stderr)
    print(f"✓ Generated {analysis_path}", file=sys.stderr)
    print(f"✓ Generated {json_path}", file=sys.stderr)


if __name__ == "__main__":
    main()
