---
name: opsis-plan
description: Task breakdown from PRD. Analyze codebase, map requirements to specific files, generate tasks.md with technical implementation details.
license: Apache-2.0
---

# Opsis Plan

Generate detailed technical implementation tasks from PRD and codebase context.

## Mode Declaration

**OPSIS MODE: Technical Planning**
Mode: planning
Purpose: Generating low-level engineering tasks from PRD & Codebase
Implementation: BLOCKED - I will create the plan, not the code

For complete mode enforcement rules, Iron Laws, and mode boundary enforcement, reference **opsis-mode-enforcer**.

## When to Use

**Invoke opsis-plan when:**
- A complete PRD exists and needs to be broken down into implementation tasks
- Technical implementation details need to be mapped to specific files
- Task dependencies and execution order need to be defined
- A comprehensive task breakdown is required for implementation

**Note:** This skill is typically invoked after opsis-prd (or opsis-summarize) has generated a PRD. The PRD location is determined using opsis-worktree-utils.

## Activation Logging

When this skill is activated, log:

```
ACTIVATED: opsis-plan
Purpose: Creating implementation tasks from PRD '{prd-name}'
PRD location: {path/to/prd}
Output location: {path/to/tasks.md}
```

## Preconditions

Before invoking this skill:
1. A complete PRD exists (full-prd.md or quick-prd.md)
2. The PRD has been reviewed and approved
3. Codebase context is available or can be gathered
4. Worktree context is established (via opsis-worktree-utils)

## Postconditions

After completing this skill:
1. A tasks.md file is created with detailed implementation tasks
2. Each task has a unique task ID following the standard pattern
3. Tasks are organized by phase with clear dependencies
4. File paths are specific and actionable
5. Technical constraints and patterns are documented
6. The task breakdown is ready for opsis-implement

## Success Metrics

This skill is successful when:
- All PRD requirements have corresponding implementation tasks
- Task IDs follow the pattern: `phase-{phase-number}-{sanitized-phase-name}-{task-counter}`
- Each task specifies exact file paths and technical implementation details
- Tasks are granular (~20-40 minutes each)
- Existing architecture and patterns are respected
- The tasks.md file is saved to the correct location

## Delegation Checkpoint

Before proceeding with context analysis, reference **opsis-delegation-checkpoint** for delegation assessment.

**Core principle from opsis-delegation-checkpoint:** ASSESS BEFORE ACT - Every task requires a complexity assessment before execution.

**Assess delegation needs for codebase analysis:**

**DELEGATE to subagent if:**
- Scanning multiple directories (>3)
- Reading 10+ files to understand patterns
- Analyzing code architecture across packages
- Identifying dependencies and imports
- Complex file pattern matching
- Multi-file context gathering

**EXECUTE DIRECTLY if:**
- Reading 1-2 specific files with known paths
- Simple directory listing
- Single-file inspection
- Known file path operations

For complete delegation decision tree, complexity assessment criteria, and prompt templates, reference **opsis-delegation-checkpoint**.

## Context Analysis (Before PRD)

If not delegated to power-agent per opsis-delegation-checkpoint, execute these steps:

1. **Scan directory structure** - `ls -R src` or relevant folders
2. **Read configuration** - `package.json`, `tsconfig.json`, `go.mod`, etc. for dependencies
3. **Identify patterns** - Open representative files to detect:
   - State management (Context, Redux, Zustand, etc.)
   - Styling approach (CSS Modules, Tailwind, SCSS, etc.)
   - API patterns (fetch, axios, custom hooks, etc.)
   - Type definitions location
4. **Output summary** - Briefly state detected stack

## PRD Ingestion

Reference **opsis-worktree-utils** for worktree detection to locate PRD.

**Search order for PRD:**
1. Current worktree outputs (if in worktree)
2. Project root outputs
3. Other worktree outputs (for compact recovery scenarios)

**After locating PRD:**
1. Read PRD - Ingest requirements
2. Extract architecture - Note patterns (Clean Architecture, FSD, etc.)
3. Identify phases - Understand the structure of requirements

## Task Generation Rules

### Specific File Paths

- **Bad:** "Create user profile component"
- **Good:** "Create `src/components/user/UserProfile.tsx`. Export as default"

### Technical Constraints

- **Bad:** "Add validation"
- **Good:** "Use `zod` schema in `src/schemas/user.ts`. Integrate with `react-hook-form`"

### Respect Existing Architecture

- If project uses `services/` for API calls, don't put fetch in components
- If project uses `shadcn/ui`, instruct to use those primitives
- Follow existing error handling patterns
- Match the project's testing approach

### Granularity

- Each task = single logical unit (~20-40 mins)
- Separate backend API from frontend UI
- Separate type definition from implementation if complex
- One task should touch at most 2-3 files

## Task Format

```markdown
- [ ] **{Task Title}** (ref: {PRD Section})
  Task ID: {task-id}
  > **Implementation**: Create/Edit `{file/path}`.
  > **Details**: {Technical instruction with specific patterns}
```

**Task ID pattern:** `phase-{phase-number}-{sanitized-phase-name}-{task-counter}`

**Examples:**
- `phase-1-auth-setup-1`
- `phase-2-user-profile-3`
- `phase-3-api-integration-2`

## File-Saving Protocol

Reference **opsis-worktree-utils** for worktree detection and save location logic.

**Save files:**
1. Save to: `{SAVE_BASE}/{prd-name}/tasks.md`
2. Verify with Read tool
3. Display actual file path

**Save preference:**
- If in worktree and it has `.aider-desk`: use worktree's `.aider-desk/opsis/outputs`
- Otherwise: use project root's `.aider-desk/opsis/outputs`

## Skill Creation Tasks

When creating skills, reference **opsis-writing-skills** methodology:
- Tasks should enable TDD approach (baseline test → skill → verification)
- Include testing scenarios as subtasks
- Follow progressive disclosure requirements
- Use **opsis-test-driven-development** for RED-GREEN-REFACTOR cycle

## Integration

This skill integrates with the Opsis workflow:

**Preceding Skills:**
- **opsis-prd** - Creates the PRD that opsis-plan uses as input
- **opsis-summarize** - May create mini-PRD for conversational workflows
- **opsis-refine** - May update PRD before task breakdown

**Following Skills:**
- **opsis-implement** - Executes the tasks generated by opsis-plan
- **opsis-two-stage-review-execution** - Executes tasks with two-stage review

**Utility Skills Referenced:**
- **opsis-delegation-checkpoint** - For delegation decisions during codebase analysis
- **opsis-worktree-utils** - For PRD location and tasks.md save location
- **opsis-mode-enforcer** - For mode declaration and boundary enforcement

**Related Skills:**
- **opsis-test-driven-development** - For TDD methodology in task creation
- **opsis-writing-skills** - For skill creation methodology

## Workflow

```
[PRD Complete]
       │
       ▼
[Activate opsis-plan]
       │
       ├─→ Delegation Checkpoint (opsis-delegation-checkpoint)
       │   ├─→ Delegate codebase analysis (if complex)
       │   └─→ Execute directly (if simple)
       │
       ├─→ Context Analysis
       │   └─→ Detect stack, patterns, architecture
       │
       ├─→ PRD Ingestion
       │   └─→ Read PRD (opsy-worktree-utils for location)
       │
       ├─→ Task Generation
       │   ├─→ Map requirements to specific files
       │   ├─→ Apply existing patterns
       │   └─→ Generate task IDs
       │
       └─→ Save tasks.md
           └─→ Use opsis-worktree-utils for save location
```

## Quick Reference

| Step | Action | Tool/Skill |
|------|--------|------------|
| 1 | Declare mode | opsis-mode-enforcer |
| 2 | Assess delegation | opsis-delegation-checkpoint |
| 3 | Analyze codebase | Delegate or execute directly |
| 4 | Locate PRD | opsis-worktree-utils |
| 5 | Generate tasks | This skill |
| 6 | Save tasks.md | opsis-worktree-utils |

## Next Steps

After plan generation:
- Use **opsis-implement** to execute tasks from tasks.md
- Use **opsis-two-stage-review-execution** for multi-task execution with two-stage review
- Use **opsis-verify** to verify implementation against tasks.md

## See Also

- **using-opsis** - Meta-skill establishing workflow rules and skill invocation order
- **opsis-mode-enforcer** - Mode boundaries and Iron Laws
- **opsis-delegation-checkpoint** - Delegation decision framework
- **opsis-worktree-utils** - Worktree detection and path resolution
- **opsis-implement** - Task execution
