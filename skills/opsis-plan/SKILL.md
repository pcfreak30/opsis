---
name: opsis-plan
description: "Task breakdown from PRD. Analyze codebase, map requirements to specific files, generate tasks.md with technical implementation details."
license: Apache-2.0
---

# Opsis Plan

Generate detailed technical implementation tasks from PRD and codebase context.

## When to Use

Use this skill when:

- A complete PRD exists and needs to be broken down into implementation tasks
- Technical implementation details need to be mapped to specific files
- Task dependencies and execution order need to be defined
- A comprehensive task breakdown is required for implementation

Do not use when:

- No complete PRD exists
- User asks about requirements or planning

## Rules

### Rule: Assess delegation needs before context analysis

**When:** Starting context analysis

**Then:** Assess delegation requirements per opsis-coordinator

**Delegate to subagent if:**
- Scanning multiple directories (>3)
- Reading 10+ files to understand patterns
- Analyzing code architecture across packages
- Identifying dependencies and imports
- Complex file pattern matching
- Multi-file context gathering

**Execute directly if:**
- Reading 1-2 specific files with known paths
- Simple directory listing
- Single-file inspection
- Known file path operations

### Rule: Use specific file paths

**When:** Generating tasks

**Then:** Specify exact file paths

**Bad:** "Create user profile component"

**Good:** "Create `src/components/user/UserProfile.tsx`. Export as default"

### Rule: Apply technical constraints

**When:** Generating tasks

**Then:** Specify technical requirements

**Bad:** "Add validation"

**Good:** "Use `zod` schema in `src/schemas/user.ts`. Integrate with `react-hook-form`"

### Rule: Respect existing architecture

**When:** Generating tasks

**Then:** Follow existing patterns

**Examples:**
- If project uses `services/` for API calls, don't put fetch in components
- If project uses `shadcn/ui`, instruct to use those primitives
- Follow existing error handling patterns
- Match the project's testing approach

### Rule: Maintain task granularity

**When:** Generating tasks

**Then:** Keep tasks focused

**Granularity rules:**
- Each task = single logical unit (~20-40 mins)
- Separate backend API from frontend UI
- Separate type definition from implementation if complex
- One task should touch at most 2-3 files

### Rule: Use task format correctly

**When:** Creating tasks

**Then:** Use standard task format

**Task format:**
```markdown
- [ ] **{Task Title}**
  ID: {task-id}
  Phase: {phase-number}
  What: {description-of-what-to-do}
  Where: {file-path-or-location}
  Depends: {comma-separated-task-ids}  (optional)
  Execution Group: {group-number}  (optional, auto-generated)
```

**Task ID pattern:** `phase-{phase-number}-{sanitized-phase-name}-{task-counter}`

### Rule: Generate dependency analysis

**When:** Tasks generated

**Then:** Create dependency analysis artifacts

**Analysis artifacts:**
1. `dependency-graph.md` - Mermaid visualization
2. `parallelization-analysis.md` - Markdown analysis (LLM-readable)
3. `parallelization-analysis.json` - JSON data (programmatic access)

**Generation command:**
```bash
$HOME/.aider-desk/skills/opsis-plan/venv/bin/python $HOME/.aider-desk/skills/opsis-plan/scripts/analyze_dependencies.py <path/to/tasks.md> <output_dir>
```

### Rule: Save files to correct location

**When:** Saving tasks and analysis

**Then:** Use opsis-worktree-utils for save location

**Save preference:**
- If in worktree and it has `.aider-desk`: use worktree's `.aider-desk/opsis/outputs`
- Otherwise: use project root's `.aider-desk/opsis/outputs`

**Save files:**
1. tasks.md to: `{SAVE_BASE}/{prd-name}/tasks.md`
2. dependency-graph.md to: `{SAVE_BASE}/{prd-name}/dependency-graph.md`
3. parallelization-analysis.md to: `{SAVE_BASE}/{prd-name}/parallelization-analysis.md`
4. Verify all files with Read tool
5. Display actual file paths

## Process

1. Assess delegation needs for codebase analysis
2. If delegating: invoke subagent for analysis
3. If executing directly: perform context analysis
4. Scan directory structure
5. Read configuration files
6. Identify patterns (state management, styling, API patterns, etc.)
7. Locate PRD using opsis-worktree-utils
8. Read PRD and extract architecture
9. Identify phases
10. Generate tasks with specific file paths
11. Apply technical constraints
12. Respect existing architecture
13. Maintain task granularity
14. Use standard task format
15. Generate dependency analysis
16. Save files to correct location

## Preconditions

Before using this skill, verify:

- A complete PRD exists (full-prd.md or quick-prd.md)
- The PRD has been reviewed and approved
- Codebase context is available or can be gathered
- Worktree context is established

## Postconditions

After completing this skill, verify:

- tasks.md file created with detailed implementation tasks
- Each task has unique task ID following standard pattern
- Tasks organized by phase with clear dependencies
- File paths are specific and actionable
- Technical constraints and patterns documented
- Dependency graph generated
- Parallelization analysis created
- All files saved to correct location

## Success Metrics

This skill is successful when:

- All PRD requirements have corresponding implementation tasks
- Task IDs follow standard pattern
- Each task specifies exact file paths and technical implementation details
- Tasks are granular (~20-40 minutes each)
- Existing architecture and patterns respected
- Dependency graph generated with mermaid visualization
- Parallelization analysis identifies execution groups and fan-in points
- All files saved to correct location

## Common Situations

**Situation:** Complex codebase analysis needed

**Pattern:**
- When: Scanning multiple directories, reading 10+ files
- Then: Delegate to subagent for analysis

**Situation:** Simple file inspection

**Pattern:**
- When: Reading 1-2 specific files with known paths
- Then: Execute directly

**Situation:** Saving files

**Pattern:**
- When: Saving tasks and analysis
- Then: Use opsis-worktree-utils for save location
- Verify: All files exist at displayed paths
