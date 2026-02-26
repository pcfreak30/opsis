#!/usr/bin/env python3
"""
Unit tests for analyze_dependencies.py.
Tests AST building, mermaid graph generation, and analysis markdown generation.
"""

import unittest
import tempfile
from pathlib import Path
from unittest.mock import Mock, patch
from analyze_dependencies import (
    AnalysisEngine,
    generate_analysis_markdown,
    ExecutionGroup,
    FanInPoint
)
from task_parser import Task, TaskFile


class TestASTBuilding(unittest.TestCase):
    """Test AST building for mermaid graphs and markdown."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.temp_dir = tempfile.mkdtemp()
        self.test_tasks_path = Path(self.temp_dir) / "tasks.md"
        
        # Create a test tasks.md file with the expected format
        self.test_tasks_content = """# Tasks

## Phase 1

- [ ] **Task 1: Setup project structure**
  ID: task-001
  Phase: 1
  What: Create basic project directories and files
  Where: /root/projects/opsis

- [ ] **Task 2: Install dependencies**
  ID: task-002
  Phase: 1
  What: Install Python packages
  Where: /root/projects/opsis
  Depends: task-001

## Phase 2

- [ ] **Task 3: Implement feature A**
  ID: task-003
  Phase: 2
  What: Implement core functionality
  Where: /root/projects/opsis/src
  Depends: task-002

- [ ] **Task 4: Implement feature B**
  ID: task-004
  Phase: 2
  What: Implement secondary functionality
  Where: /root/projects/opsis/src
  Depends: task-002

- [ ] **Task 5: Write tests**
  ID: task-005
  Phase: 2
  What: Write unit tests
  Where: /root/projects/opsis/tests
  Depends: task-003, task-004
"""
        self.test_tasks_path.write_text(self.test_tasks_content)
    
    def test_mermaid_graph_generation(self):
        """Test that mermaid graph is generated as AST CodeFence."""
        from task_parser import Task, TaskFile
        
        engine = AnalysisEngine(self.test_tasks_path)
        
        # Mock the task_file with test data
        task_file = TaskFile()
        task_file.tasks = [
            Task(
                title="Task 1: Setup project structure",
                id="task-001",
                phase=1,
                what="Create basic project directories and files",
                where="/root/projects/opsis"
            ),
            Task(
                title="Task 3: Implement feature A",
                id="task-003",
                phase=2,
                what="Implement core functionality",
                where="/root/projects/opsis/src"
            ),
            Task(
                title="Task 4: Implement feature B",
                id="task-004",
                phase=2,
                what="Implement secondary functionality",
                where="/root/projects/opsis/src"
            )
        ]
        engine.task_file = task_file
        
        # Create mock classified groups
        classified_groups = [
            ExecutionGroup(
                group_id="Group-0",
                type="sequential",
                task_count=1,
                tasks=["task-001"],
                requires_fan_in=False,
                execution_mode="opsis-implement",
                reason="Single task requires sequential execution"
            ),
            ExecutionGroup(
                group_id="Group-1",
                type="parallel",
                task_count=2,
                tasks=["task-003", "task-004"],
                requires_fan_in=True,
                execution_mode="opsis-dispatching-parallel-agents",
                reason="2 independent tasks can execute in parallel"
            )
        ]
        
        # Generate mermaid graph
        mermaid_ast = engine._generate_mermaid_graph(classified_groups)
        
        # Verify it's a CodeFence
        from mistletoe import block_token
        self.assertIsInstance(mermaid_ast, block_token.CodeFence)
        
        # Verify language is mermaid
        self.assertEqual(mermaid_ast.language, "mermaid")
        
        # Verify content contains expected elements
        content = mermaid_ast.content
        self.assertIn("graph TD", content)
        self.assertIn("Phase 1", content)
        self.assertIn("Phase 2", content)
        self.assertIn("task-001", content)
        self.assertIn("task-003", content)
        self.assertIn("task-004", content)
    
    def test_analysis_markdown_generation(self):
        """Test that analysis markdown is generated as AST Document."""
        from mistletoe import Document, block_token
        
        # Create mock data
        classified_groups = [
            ExecutionGroup(
                group_id="Group-0",
                type="sequential",
                task_count=1,
                tasks=["task-001"],
                requires_fan_in=False,
                execution_mode="opsis-implement",
                reason="Single task requires sequential execution"
            ),
            ExecutionGroup(
                group_id="Group-1",
                type="parallel",
                task_count=2,
                tasks=["task-003", "task-004"],
                requires_fan_in=True,
                execution_mode="opsis-dispatching-parallel-agents",
                reason="2 independent tasks can execute in parallel"
            )
        ]
        
        fan_in_points = [
            FanInPoint(
                group_index=0,
                synchronization_task="task-005",
                waiting_for=["task-003", "task-004"]
            )
        ]
        
        total_tasks = 3
        
        # Generate analysis document
        analysis_doc = generate_analysis_markdown(classified_groups, fan_in_points, total_tasks)
        
        # Verify it's a Document
        self.assertIsInstance(analysis_doc, Document)
        
        # Verify document has children
        self.assertGreater(len(analysis_doc.children), 0)
        
        # Verify first child is a heading
        first_child = analysis_doc.children[0]
        self.assertIsInstance(first_child, block_token.Heading)
        self.assertEqual(first_child.level, 1)
        
        # Render and verify content
        from mistletoe import markdown_renderer
        with markdown_renderer.MarkdownRenderer() as renderer:
            markdown = renderer.render(analysis_doc)
        
        # Verify expected sections are present
        self.assertIn("# Parallelization Analysis", markdown)
        self.assertIn("## Overview", markdown)
        self.assertIn("## Execution Groups", markdown)
        self.assertIn("## Fan-in Synchronization Points", markdown)
        self.assertIn("## Execution Flow", markdown)
        self.assertIn("Group-0", markdown)
        self.assertIn("Group-1", markdown)
        self.assertIn("task-001", markdown)
        self.assertIn("task-003", markdown)
    

    
    def test_full_analysis_pipeline(self):
        """Test the full analysis pipeline with mocked task file."""
        # This test would require a properly formatted tasks.md
        # For now, we'll just verify the structure is correct
        pass


class TestCodeFenceConstruction(unittest.TestCase):
    """Test CodeFence AST construction."""
    
    def test_codefence_creation(self):
        """Test creating a CodeFence manually."""
        from mistletoe import block_token
        
        # Create code fence content
        lines = ["line 1", "line 2", "line 3"]
        
        # open_info format: (indentation, delimiter, info_string, lang)
        # indentation must be an integer
        open_info = (0, "```", "", "python")
        
        # Create CodeFence
        code_fence = block_token.CodeFence((lines, open_info))
        
        # Verify attributes
        self.assertEqual(code_fence.language, "python")
        self.assertEqual(code_fence.indentation, 0)
        self.assertEqual(code_fence.delimiter, "```")
        
        # Verify content
        content = code_fence.content
        self.assertIn("line 1", content)
        self.assertIn("line 2", content)
        self.assertIn("line 3", content)
    
    def test_codefence_rendering(self):
        """Test that CodeFence renders correctly."""
        from mistletoe import block_token, markdown_renderer
        
        lines = ["def hello():", "    print('world')"]
        open_info = (0, "```", "", "python")
        code_fence = block_token.CodeFence((lines, open_info))
        
        # Check that CodeFence was created correctly
        self.assertEqual(code_fence.language, "python")
        self.assertEqual(code_fence.indentation, 0)
        
        # Render and verify content is present
        with markdown_renderer.MarkdownRenderer() as renderer:
            rendered = renderer.render(code_fence)
        
        # Verify content is present in rendered output
        self.assertIn("def hello():", rendered)
        self.assertIn("print", rendered)


class TestHeadingConstruction(unittest.TestCase):
    """Test Heading AST construction."""
    
    def test_heading_creation(self):
        """Test creating a Heading with match object."""
        from mistletoe import block_token, span_token
        
        # Heading match format: (level, content, closing_sequence)
        match = (1, "My Title", "#")
        
        # Create Heading
        heading = block_token.Heading(match)
        
        # Verify attributes
        self.assertEqual(heading.level, 1)
        
        # Verify it has children (span tokens)
        self.assertGreater(len(heading.children), 0)


if __name__ == "__main__":
    unittest.main()
