#!/usr/bin/env python3
"""
Task file parser using mistletoe for reliable parsing and rendering.
Handles parsing, analysis, and rewriting of tasks.md files.
"""

from dataclasses import dataclass, field
from typing import List, Optional, Dict
from enum import Enum
from pathlib import Path
import re
import io

import mistletoe
from mistletoe import Document, block_token, span_token, markdown_renderer


class TaskLevel(Enum):
    """Task nesting level based on indentation."""
    ROOT = 0
    NESTED = 1
    DEEP_NESTED = 2


@dataclass
class Task:
    """Represents a single task with all metadata."""
    title: str
    id: str
    phase: Optional[int] = None
    what: str = ""
    where: str = ""
    depends: List[str] = field(default_factory=list)
    execution_group: Optional[int] = None
    level: TaskLevel = TaskLevel.ROOT
    parent_id: Optional[str] = None
    children: List['Task'] = field(default_factory=list)
    
    def to_dict(self) -> Dict:
        """Convert to dictionary for serialization."""
        return {
            'title': self.title,
            'id': self.id,
            'phase': self.phase,
            'what': self.what,
            'where': self.where,
            'depends': self.depends,
            'execution_group': self.execution_group,
            'level': self.level.value,
            'parent_id': self.parent_id
        }


@dataclass
class TaskFile:
    """Represents the entire tasks.md file."""
    header: str = ""
    footer: str = ""
    tasks: List[Task] = field(default_factory=list)
    phases: Dict[int, List[Task]] = field(default_factory=dict)
    
    def get_task_by_id(self, task_id: str) -> Optional[Task]:
        """Find task by ID, recursively searching children."""
        for task in self.tasks:
            if task.id == task_id:
                return task
            if task.children:
                for child in task.children:
                    if child.id == task_id:
                        return child
        return None
    
    def get_all_tasks(self) -> List[Task]:
        """Get all tasks recursively including children."""
        all_tasks = []
        for task in self.tasks:
            all_tasks.append(task)
            all_tasks.extend(self._get_children_recursive(task))
        return all_tasks
    
    def _get_children_recursive(self, task: Task) -> List[Task]:
        """Recursively get all children of a task."""
        children = []
        for child in task.children:
            children.append(child)
            children.extend(self._get_children_recursive(child))
        return children


class TaskParser:
    """Parse tasks.md using mistletoe for reliable parsing."""
    
    # Field parsing patterns
    FIELD_PARSERS = {
        'ID': lambda task, value: setattr(task, 'id', value),
        'Phase': lambda task, value: setattr(task, 'phase', int(value) if value.isdigit() else None),
        'What': lambda task, value: setattr(task, 'what', value),
        'Where': lambda task, value: setattr(task, 'where', value),
        'Depends': lambda task, value: setattr(task, 'depends', [d.strip() for d in value.split(',') if d.strip()]),
        'Execution Group': lambda task, value: setattr(task, 'execution_group', int(value) if value.isdigit() else None),
    }
    
    def __init__(self, filepath: Path):
        self.filepath = filepath
        self.content: str = ""
        self._task_counter = 0
    
    def _parse_field(self, task: Task, line: str) -> None:
        """Parse a field line and update task accordingly.
        
        Args:
            task: Task object to update
            line: Field line in format "Key: value"
        """
        if ':' not in line:
            return
        
        key, value = line.split(':', 1)
        key = key.strip()
        value = value.strip()
        
        parser = self.FIELD_PARSERS.get(key)
        if parser:
            parser(task, value)
    
    def parse(self) -> TaskFile:
        """Parse the entire tasks.md file using mistletoe."""
        task_file = TaskFile()
        task_stack: List[Task] = []
        current_phase: Optional[int] = None
        
        # Parse with mistletoe - use Document constructor with file object
        with io.StringIO(self.filepath.read_text()) as f:
            doc = Document(f)
        
        # Process children of document
        for node in doc.children:
            # Handle phase headers (AtxHeading)
            if isinstance(node, block_token.Heading):
                text = self._get_text_content(node)
                if text.startswith('Phase'):
                    match = re.search(r'Phase (\d+)', text)
                    current_phase = int(match.group(1)) if match else None
                continue
            
            # Handle task lists
            elif isinstance(node, block_token.List):
                for list_item in node.children:
                    if isinstance(list_item, block_token.ListItem):
                        task = self._parse_list_item(list_item, current_phase)
                        if task:
                            task.level = self._detect_level(list_item)
                            
                            if task.level == TaskLevel.ROOT:
                                task_stack = [task]
                                task_file.tasks.append(task)
                            else:
                                if task_stack:
                                    parent = task_stack[-1]
                                    parent.children.append(task)
                                    task.parent_id = parent.id
                                    task_stack.append(task)
                            
                            # Build phase map
                            if task.phase:
                                if task.phase not in task_file.phases:
                                    task_file.phases[task.phase] = []
                                task_file.phases[task.phase].append(task)
        
        return task_file
    
    def _get_text_content(self, node) -> str:
        """Extract text content from a node, preserving line breaks."""
        if node is None:
            return ''
        if hasattr(node, 'children') and node.children:
            return ''.join(self._get_text_content(child) for child in node.children)
        elif isinstance(node, span_token.LineBreak):
            return '\n'
        elif hasattr(node, 'content'):
            return node.content
        return ''
    
    def _detect_level(self, list_item) -> TaskLevel:
        """Detect nesting level from list item indentation."""
        if hasattr(list_item, 'prepend'):
            spaces = list_item.prepend
            # prepend=0 or prepend=2 at root level (due to continuation lines)
            # prepend > 2 for nested items
            if spaces <= 2:
                return TaskLevel.ROOT
            elif spaces <= 4:
                return TaskLevel.NESTED
            else:
                return TaskLevel.DEEP_NESTED
        return TaskLevel.ROOT
    
    def _extract_title_from_paragraph(self, paragraph) -> Optional[str]:
        """Extract task title from paragraph by finding Strong span token."""
        if not paragraph.children:
            return None
        
        # Look for Strong token which contains the title
        for span in paragraph.children:
            if isinstance(span, span_token.Strong) and span.children:
                # Get the text content from Strong's children
                return ''.join(self._get_text_content(child) for child in span.children)
        
        return None
    
    def _parse_list_item(self, list_item, current_phase: Optional[int]) -> Optional[Task]:
        """Parse a single list item into a Task."""
        if not list_item.children:
            return None
        
        # Get first paragraph which should contain the task title
        first_para = list_item.children[0]
        if not isinstance(first_para, block_token.Paragraph):
            return None
        
        # Extract title from first paragraph using AST
        title = self._extract_title_from_paragraph(first_para)
        if not title:
            return None
        
        # Create task with temp ID, will be updated if ID field found
        self._task_counter += 1
        task = Task(title=title, id=f"temp-{self._task_counter:03d}")
        task.phase = current_phase
        
        # Parse fields from the same paragraph (all continuation lines are in first_para)
        full_text = self._get_text_content(first_para)
        lines = [line.strip() for line in full_text.split('\n') if line.strip()]
        
        # Skip first line (title), process rest for fields
        for line in lines[1:]:
            self._parse_field(task, line)
        
        return task


class TaskFileWriter:
    """Write tasks.md using mistletoe for reliable rendering."""
    
    def __init__(self, task_file: TaskFile):
        self.task_file = task_file
    
    def write(self, filepath: Path) -> None:
        """Write tasks.md using mistletoe's MarkdownRenderer."""
        # Build markdown as lines
        lines = []
        
        # Add header if present
        if self.task_file.header:
            lines.append(self.task_file.header)
        
        # Group tasks by phase
        phases = {}
        all_tasks = self.task_file.get_all_tasks()
        
        for task in all_tasks:
            if task.phase:
                if task.phase not in phases:
                    phases[task.phase] = []
                phases[task.phase].append(task)
        
        # Write each phase
        for phase_num in sorted(phases.keys()):
            lines.append(f"## Phase {phase_num}")
            lines.append("")
            
            for task in phases[phase_num]:
                self._write_task(lines, task, level=0)
                lines.append("")
        
        # Add footer if present
        if self.task_file.footer:
            lines.append("")
            lines.append(self.task_file.footer)
        
        # Create document and render with mistletoe
        doc = Document(lines=lines)
        
        with markdown_renderer.MarkdownRenderer() as renderer:
            markdown = renderer.render(doc)
            filepath.write_text(markdown)
    
    def _write_task(self, lines: List[str], task: Task, level: int) -> None:
        """Recursively write task with proper indentation."""
        indent = '  ' * level
        lines.append(f"{indent}- [ ] **{task.title}**")
        lines.append(f"{indent}  ID: {task.id}")
        lines.append(f"{indent}  Phase: {task.phase}")
        lines.append(f"{indent}  What: {task.what}")
        lines.append(f"{indent}  Where: {task.where}")
        
        if task.depends:
            lines.append(f"{indent}  Depends: {', '.join(task.depends)}")
        
        if task.execution_group:
            lines.append(f"{indent}  Execution Group: {task.execution_group}")
        
        # Write children
        for child_task in task.children:
            self._write_task(lines, child_task, level + 1)


class DependencyAnalyzer:
    """Analyze dependencies and derive relationships."""
    
    def __init__(self, task_file: TaskFile):
        self.task_file = task_file
    
    def analyze(self) -> None:
        """Derive dependencies and execution groups."""
        # Build task map
        task_map = {}
        all_tasks = self.task_file.get_all_tasks()
        for task in all_tasks:
            task_map[task.id] = task
        
        # Don't derive from file structure - use the Depends field in tasks.md
        # self._derive_file_dependencies(task_map)
        
        # Build execution groups
        self._build_execution_groups(task_map)
    
    def _derive_file_dependencies(self, task_map: Dict[str, Task]) -> None:
        """Derive dependencies from file paths."""
        # Group tasks by directory
        dir_tasks: Dict[str, List[Task]] = {}
        for task in task_map.values():
            if task.where:
                # Extract directory
                parts = task.where.split('/')
                if len(parts) > 1:
                    directory = '/'.join(parts[:-1])
                    if directory not in dir_tasks:
                        dir_tasks[directory] = []
                    dir_tasks[directory].append(task)
        
        # Tasks in same directory: earlier tasks → later tasks
        for directory, tasks in dir_tasks.items():
            for i in range(len(tasks) - 1):
                current = tasks[i]
                next_task = tasks[i + 1]
                if next_task.id not in current.depends:
                    current.depends.append(next_task.id)
    
    def _build_execution_groups(self, task_map: Dict[str, Task]) -> None:
        """Build execution groups using topological sort."""
        groups = []
        processed = set()
        
        all_tasks = self.task_file.get_all_tasks()
        
        for task in all_tasks:
            if task.id not in processed:
                group = [task]
                processed.add(task.id)
                
                # Find tasks that can run with this one
                for other in all_tasks:
                    if other.id not in processed:
                        # Can run in parallel if no dependencies
                        if not self._has_dependency_between(task.id, other.id, task_map):
                            group.append(other)
                            processed.add(other.id)
                
                groups.append(group)
        
        # Assign execution groups
        for i, group in enumerate(groups):
            for task in group:
                task.execution_group = i + 1
    
    def _has_dependency_between(self, task_a: str, task_b: str, task_map: Dict[str, Task]) -> bool:
        """Check if there's a dependency between two tasks."""
        task = task_map.get(task_a)
        if task and task_b in task.depends:
            return True
        return False


# Main entry point
def process_tasks_file(filepath: Path) -> None:
    """Process a tasks.md file: parse, analyze, and rewrite."""
    # Parse
    parser = TaskParser(filepath)
    task_file = parser.parse()
    
    # Analyze
    analyzer = DependencyAnalyzer(task_file)
    analyzer.analyze()
    
    # Write
    writer = TaskFileWriter(task_file)
    writer.write(filepath)




if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        filepath = Path(sys.argv[1])
    else:
        filepath = Path("tasks.md")
    
    process_tasks_file(filepath)
    print(f"Processed {filepath}")
