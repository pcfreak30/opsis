---
name: opsis-implement
description: Execute tasks from tasks.md with optional Opsis skill invocation. Detect context, suggest relevant skills, require verification before completion.
license: Apache-2.0
---

# Implement

Execute implementation tasks with optional Opsis skill invocation and verification.

## Mode Declaration

**OPSIS MODE: Implementation**
Mode: implementation
Purpose: Executing tasks or prompts with code generation
Source: tasks.md
Implementation: AUTHORIZED

## Detection Priority

Reference **opsis-worktree-utils** for worktree detection to find tasks.md and prompts.

**Detection priority:**
```
Check worktrees + project root for tasks.md → Task Implementation Mode
Check worktrees + project root for prompts/*.md → Prompt Execution Mode
If neither → Ask what to build
```

## Task Selection

**Use sensible defaults - do NOT prompt for scope unless genuinely ambiguous.**

### Default Behavior

| Context | Default Action | When to Ask |
|---------|---------------|-------------|
| User indicates continuation with incomplete TODO | Continue next incomplete task | Never ask |
| User indicates continuation after PRD/tasks.md creation | Execute all tasks | Never ask |
| User mentions specific task | Execute that task | Never ask |
| User indicates continuation with unclear intent | Ask for clarification | Only when genuinely ambiguous |

**Continuation intent includes:** "proceed", "yes", "yeah", "y", "go", "continue", "ok", "okay", "start", "begin", or any affirmative expression |

### Scope Detection Logic

```
IF (user mentions specific task ID or name):
    → Execute that specific task only

ELSE IF (user indicates continuation intent AND TODO list has incomplete items):
    → Continue with next incomplete task
    → Continuation intent: "proceed", "yes", "yeah", "y", "go", "continue", "ok", "okay", "start", "begin", or any affirmative expression

ELSE IF (user indicates continuation intent AND tasks.md exists with unchecked items):
    → Execute all tasks in the plan

ELSE:
    → Ask: "What should I implement? [all tasks | specific task | list available]"
```

### Examples

**Example 1: Continue work**
```
User: "Proceed" (or "go", "continue", "yes", etc.)
Agent: Checks todo---get_items → finds "Phase 3 Task 2" incomplete
       → Continues with "Phase 3 Task 2" (no prompt)
```

**Example 2: Start new implementation**
```
User: "Proceed" (or "go", "start", "yes", etc.) after PRD and tasks.md created
Agent: Reads tasks.md → 54 tasks, all unchecked
       → Executes all tasks (no prompt)
```

**Example 3: Specific task**
```
User: "Proceed with task 3" (or "do task 3", "task 3", etc.)
Agent: Executes task 3 only (no prompt)
```

**Example 4: Ambiguous**
```
User: "Proceed" (no tasks.md, no TODO, no context)
Agent: "What should I implement? [all tasks | specific task | list available]"
```

## 🚨 Automatic Workflow Routing

**CRITICAL: Before any implementation, you MUST auto-detect and route to the correct workflow.**

### Detection Steps

1. **Read tasks.md** to analyze task context
2. **Count total tasks** in the implementation plan
3. **Parse user command** for scope preference ("all", "task N", "phase N")
4. **Apply routing rules below**

### Auto-Routing Rules (MANDATORY)

| Context | Auto-Invoke | Threshold |
|---------|-------------|-----------|
| User says "all" AND tasks > 10 | opsis-two-stage-review-execution | 11+ tasks = large project |
| User says "all" AND tasks ≤ 10 | opsis-implement | 1-10 tasks = manageable size |
| User says "task N" (single) | opsis-implement | Single task = direct execution |
| User says "phase N" | opsis-implement | Phase-based = sequential |
| Bug investigation | opsis-systematic-debugging | Debugging workflow |
| Multiple independent failures | opsis-dispatching-parallel-agents | Parallel problems |

### Auto-Routing Logic

```
IF (user says "all" AND task_count > 10):
    → AUTO-SWITCH to opsis-two-stage-review-execution
    → DO NOT implement directly
    → Invoke opsis-two-stage-review-execution skill immediately

IF (user says "all" AND task_count ≤ 10):
    → Use opsis-implement (direct execution)
    → Proceed with Task Execution Cycle

IF (user says "task N"):
    → Use opsis-implement (single task)
    → Execute only that specific task

IF (bug detected):
    → AUTO-SWITCH to opsis-systematic-debugging
    → Invoke opsis-systematic-debugging skill immediately
```

### Example Auto-Routing

**Scenario 1: Large project**
```
User: "Proceed with all tasks"
Agent: Reads tasks.md → 54 tasks detected
       → Auto-switch to opsis-two-stage-review-execution
       → "Detected 54 tasks. Auto-routing to opsis-two-stage-review-execution for systematic quality gates."
```

**Scenario 2: Small project**
```
User: "Implement task 3"
Agent: Reads tasks.md → Single task requested
       → Use opsis-implement directly
       → Proceed with task execution
```

**Scenario 3: Bug investigation**
```
User: "Fix this crash"
Agent: Bug detected → Auto-switch to opsis-systematic-debugging
       → "Bug detected. Auto-routing to opsis-systematic-debugging for root cause investigation."
```

### 🚨 Critical Rule

**DO NOT implement directly when auto-routing triggers a skill switch.**

- If auto-routing says "invoke opsis-two-stage-review-execution" → Invoke it, STOP
- If auto-routing says "invoke opsis-systematic-debugging" → Invoke it, STOP
- Only implement directly when auto-routing confirms opsis-implement is correct

## Opsis Skill Invocation

**Decision tree based on task context:**

**After auto-routing, if still using opsis-implement:**

1. **Need separate session with human review checkpoints?** → Suggest: opsis-executing-plans
2. **Multiple independent failures?** → Suggest: opsis-dispatching-parallel-agents
3. **Implementation plan with clear tasks in current session?** → Suggest: opsis-two-stage-review-execution
4. **Bug or unexpected behavior?** → Suggest: opsis-systematic-debugging
5. **Writing new code?** → Suggest: opsis-test-driven-development (optional)
6. **About to claim completion?** → Require: opsis-verification-before-completion

**Invocation pattern:** Auto-route → If still opsis-implement → Suggest skills → Get user confirmation → Activate sequentially

**Skill Selection Guidance:**
- **opsis-executing-plans**: Execute in separate session with batch execution (3 tasks) and human review checkpoints between batches
- **opsis-two-stage-review-execution**: Execute in current session with fresh task context per task and automatic two-stage PARALLEL review (spec compliance and code quality execute simultaneously)
- **opsis-implement**: General execution without complex coordination needs, single task or simple sequential execution

## Task Execution Cycle

For each task:
1. Read task (title, description, implementation details)
2. Check PRD for requirements context
3. Implement (write production-quality code)
4. Verification gate (tests, build, lint)
5. Fix loop if verification fails
6. Mark complete (edit tasks.md: `- [ ]` → `- [x]`)
7. Next task

## Memory Store Integration

**When to Retrieve Memory:**
- Before starting implementation: Retrieve workflow contracts (pre-conditions, success criteria, invariants)
- Before complex tasks: Retrieve relevant architectural decisions and patterns
- After debugging: Retrieve critical debugging findings from previous sessions

**When to Store Memory:**
- After successful chunk validation (Tier 2): Store successful chunk patterns
- After workflow completion (Tier 3): Store milestones (state transitions), architectural decisions, anti-patterns
- Before starting: Store workflow contracts (pre-conditions, success criteria, invariants)

**Storage Types & Criteria:**

Store ONLY if ALL are true:
1. **Reusable** across future tasks
2. **Stable** (unlikely to change soon)
3. **Actionable** (changes future behavior)
4. **Type matches**: user-preference, architectural decision, or repeated codebase pattern

**Types to Store:**

| Type | When to Store | Examples |
|------|---------------|----------|
| `task` | Workflow contracts, milestones | "API tasks must include error handling", "Authentication required for all endpoints" |
| `code-pattern` | Architecture decisions, successful patterns | "Use repository pattern for data access", "DTOs for API responses" |
| `user-preference` | Strategy preferences, thresholds | "Always use PostgreSQL for new projects", "Prefer functional over imperative" |

**NEVER Store:**
- Task progress/status
- One-off bug details
- Implementation details (how something was coded)
- Transient implementation notes
- File lists from a single task
- Logs/stack traces
- Secrets/tokens/credentials/PII
- Information directly derivable from repository content

**Storage Commands:**
- Store: `memory---store_memory` with type, content
- Retrieve: `memory---retrieve_memory` with query (3-7 descriptive words)

## Tool Selection

For the authoritative rule on subagent vs subtask usage, see **using-opsis**:
- **Rule of Thumb:** Use subagents for research and decisions. Use subtasks for executing work.

**This skill uses:**
- `tasks---create_task` for creating subtasks that execute implementation work
- `tasks---get_task`, `tasks---get_task_message` for monitoring subtask progress
- `subagents---run_task` for verification and research tasks

**Three-tier feedback loops:**
- Tier 1: Guardrail-driven, continuous monitoring, no memory storage
- Tier 2: Phase-level, chunk validation, store successful patterns
- Tier 3: Workflow-level, state transitions, store architectural decisions and anti-patterns

## Blocked Task Handling

Report blocker type (dependency, unclear, technical, external):
> "⚠️ Task {task-id} is blocked. Reason: {description}. Options: provide needed info | skip | clarify"

## Progress Reporting

After each task:
```
✅ Task Complete: "{title}"
Progress: [completed]/[total] tasks ([percentage]%)

⏳ Next: "{next task title}"
```

## Integration

Works with mode-tracker.js and verification-gate.js hooks.

References: `.aider-desk/opsis/instructions/workflows/implement.md`

## Next Steps

After all tasks complete, use opsis-verify to audit implementation against PRD.
