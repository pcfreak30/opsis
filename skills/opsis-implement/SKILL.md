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

## ✅ Compact Recovery Check (MANDATORY - FIRST STEP)

**ALWAYS check this FIRST before any other action.**

### When to Check

Before doing ANYTHING else in this skill:
1. Check for compact recovery indicators
2. If detected, invoke opsis-compact-recovery
3. Only proceed after recovery completes

**This is non-optional and must be the first action.**

### Detection Indicators

**Check for these signals:**
- **"Conversation Summary" heading present** in recent messages
- Short prompts without clear context (< 30 chars, no task/project reference)
- User says "continue", "proceed", "next" without specifying task
- Missing context about what was being worked on
- Confusion indicators: "where were we", "what's next", "what task"
- Explicit recovery requests: "recover", "restore state"

**Critical:** Seeing a summary from planning does NOT mean compaction didn't occur. Compactions always leave a summary, but state still needs recovery. The presence of a summary is itself a compaction indicator.

### Recovery Flow

```
IF (compact indicators detected):
    1. STOP implementation
    2. Invoke opsis-compact-recovery skill
    3. Wait for recovery to complete
    4. Restore state from artifacts (tasks.md, PRD, TODO)
    5. Continue with recovered context
ELSE:
    → Proceed to Detection Priority
```

### Example

```
User: "Proceed" (after long planning session)
Agent: Check for compact indicators
       → "Conversation Summary" heading present
       → Invoke opsis-compact-recovery
       → Restore state: "Project X, Task 5/54 complete"
       → Continue with Task 6
```

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

## 🚨 Workflow Routing

**CRITICAL: Before any implementation, you MUST determine the correct workflow.**

### Routing Priority

**Decision Point Gate override takes precedence over auto-routing.**

The Decision Point Gate represents a considered decision (by user or agent) and should be honored. Auto-routing provides sensible defaults for typical scenarios.

### Routing Decision Flow

```
STEP 1: Check for Decision Point Gate override
    ├─→ IF (Decision Point Gate completed):
    │   ├─→ Read "CHOSEN WORKFLOW" from Gate
    │   ├─→ HONOR that workflow choice
    │   └─→ Skip auto-routing
    │
    └─→ IF (Decision Point Gate NOT completed):
        └─→ Apply auto-routing rules (see below)

STEP 2: Apply auto-routing (if no override)
    ├─→ Read tasks.md to analyze task context
    ├─→ Count total tasks in the implementation plan
    ├─→ Parse user command for scope preference ("all", "task N", "phase N")
    └─→ Apply routing rules below

STEP 3: Execute chosen workflow
    ├─→ IF (routing triggers skill switch):
    │   ├─→ Invoke the appropriate skill
    │   └─→ STOP - DO NOT implement directly
    │
    └─→ IF (routing confirms opsis-implement):
        └─→ Proceed with Task Execution Cycle
```

### Detecting Decision Point Gate Completion

**A Decision Point Gate is considered completed when:**
- The template sections are filled out:
  - TASK INFORMATION section
  - DECISION CRITERIA section
  - WORKFLOW DECISION section with "CHOSEN WORKFLOW" specified
- The "CHOSEN WORKFLOW" field contains a valid workflow name

**Where to check:**
- Look in `.aider-desk/opsis/outputs/{project}/` directories
- Search for files containing "DECISION POINT GATE" header
- Check if "CHOSEN WORKFLOW:" line exists with a value

### Auto-Routing Rules (Applied only when no Gate override)

| Context | Auto-Invoke | Threshold |
|---------|-------------|-----------|
| User says "all" AND tasks > 10 | opsis-two-stage-review-execution | 11+ tasks = large project |
| User says "all" AND tasks ≤ 10 | opsis-implement | 1-10 tasks = manageable size |
| User says "task N" (single) | opsis-implement | Single task = direct execution |
| User says "phase N" | opsis-implement | Phase-based = sequential |
| User wants separate session | opsis-executing-plans | Human review checkpoints needed |
| Bug investigation | opsis-systematic-debugging | Debugging workflow |
| Multiple independent failures | opsis-dispatching-parallel-agents | Parallel problems |

### Routing Logic (Pseudocode)

```
# Step 1: Check for Decision Point Gate override
IF (Decision Point Gate exists AND is completed):
    chosen_workflow = extract "CHOSEN WORKFLOW" from Gate
    
    IF (chosen_workflow == "opsis-two-stage-review-execution"):
        → Invoke opsis-two-stage-review-execution
        → STOP
        
    ELSE IF (chosen_workflow == "opsis-implement"):
        → Use opsis-implement (direct execution)
        → Proceed with Task Execution Cycle
        
    ELSE IF (chosen_workflow == "opsis-executing-plans"):
        → Invoke opsis-executing-plans
        → STOP
        
    ELSE IF (chosen_workflow == "opsis-dispatching-parallel-agents"):
        → Invoke opsis-dispatching-parallel-agents
        → STOP
        
    ELSE IF (chosen_workflow == "opsis-dispatching-parallel-agents"):
        → Invoke opsis-dispatching-parallel-agents
        → STOP
        
    ELSE:
        → Invalid workflow specified, apply auto-routing
        
# Step 2: Apply auto-routing (no Gate override)
ELSE:
    # Step 2.5: Check for dependency analysis
    IF (parallelization-analysis.md exists):
        ├─→ Read parallelization-analysis.md
        ├─→ Extract recommended_strategy and execution groups
        ├─→ Apply dependency-based routing (see below)
        └─→ SKIP task count threshold routing
    
    # Step 2.6: Apply routing based on analysis or fallback
    IF (dependency_analysis_available):
        ├─→ IF (recommended_strategy == "highly_parallel"):
        │   → Invoke opsis-dispatching-parallel-agents
        │   → STOP
        │   
        ├─→ ELSE IF (recommended_strategy == "moderately_parallel"):
        │   → Invoke opsis-two-stage-review-execution
        │   → STOP
        │   
        └─→ ELSE (mostly_sequential or unknown):
            → Use opsis-implement (direct execution)
            → Proceed with Task Execution Cycle
    
    ELSE (no dependency analysis, use fallback):
        IF (user says "all" AND task_count > 10):
            → Invoke opsis-two-stage-review-execution
            → STOP
            
        ELSE IF (user says "all" AND task_count ≤ 10):
            → Use opsis-implement (direct execution)
            → Proceed with Task Execution Cycle
            
        ELSE IF (user says "task N"):
            → Use opsis-implement (single task)
            → Execute only that specific task
            
        ELSE IF (user wants separate session):
            → Invoke opsis-executing-plans
            → STOP
            
        ELSE IF (bug detected):
            → Invoke opsis-systematic-debugging
            → STOP
```

### Example Routing Scenarios

**Scenario 1: Decision Point Gate override**
```
Context: Agent completed Decision Point Gate with "CHOSEN WORKFLOW: opsis-implement"
Agent: Detects Gate completion
       → Reads "CHOSEN WORKFLOW: opsis-implement"
       → Honors that choice (does not apply auto-routing)
       → Proceeds with direct implementation
```

**Scenario 2: Auto-routing for large project**
```
Context: No Decision Point Gate, user says "Proceed with all tasks"
Agent: Reads tasks.md → 54 tasks detected
       → No Gate override found
       → Auto-routing: 54 > 10 threshold
       → Invokes opsis-two-stage-review-execution
```

**Scenario 3: Auto-routing for small project**
```
Context: No Decision Point Gate, user says "Implement task 3"
Agent: Reads tasks.md → Single task requested
       → No Gate override found
       → Auto-routing: single task
       → Uses opsis-implement directly
```

**Scenario 4: Edge case override**
```
Context: 15 simple copy/paste tasks (auto-routing would say two-stage review)
User/Agent completes Decision Point Gate:
    "CHOSEN WORKFLOW: opsis-implement"
    Reason: "Tasks are simple copy/paste, no complex logic"
Agent: Detects Gate completion
       → Honors override despite 15 > 10 threshold
       → Uses opsis-implement directly
```

### 🚨 Critical Rules

**DO NOT implement directly when routing triggers a skill switch:**
- If routing says "invoke opsis-two-stage-review-execution" → Invoke it, STOP
- If routing says "invoke opsis-systematic-debugging" → Invoke it, STOP
- Only implement directly when routing confirms opsis-implement is correct

**ALWAYS check for Decision Point Gate first:**
- Gate override = authoritative choice
- Auto-routing = default behavior
- Never apply auto-routing if a valid Gate exists

## Opsis Skill Invocation

**After routing confirms opsis-implement for direct execution:**

Suggest relevant skills based on task context:

1. **About to write new code?** → Suggest: opsis-test-driven-development (optional)
2. **About to claim completion?** → Require: opsis-verification-before-completion

**Note:** Workflow routing (two-stage review, executing plans, parallel agents, debugging) is handled by the **Routing Decision Flow** above, not here. This section is for optional quality skills during direct implementation.

**Skill Selection Guidance:**
- **opsis-test-driven-development**: RED-GREEN-REFACTOR cycle with mandatory verification
- **opsis-verification-before-completion**: Evidence before claims (required before completion)

## Dynamic Execution Flow with Dependency Analysis

When dependency analysis is available, execute tasks by group following the execution strategy:

### Per-Group Execution

For each execution group from parallelization-analysis.md:

1. **Read group configuration**
   - Group type (parallel or sequential)
   - Execution mode (opsis-dispatching-parallel-agents or opsis-implement)
   - Task list for this group
   - Fan-in requirements

2. **Execute based on group type**
   
   **If group is parallel:**
   - Use opsis-dispatching-parallel-agents for 3+ independent tasks
   - Each agent works on one task independently
   - Wait for all tasks to complete
   - Verify all tasks succeeded before proceeding
   
   **If group is sequential:**
   - Use opsis-implement for direct execution
   - Execute tasks one at a time
   - Each task must complete before next starts
   - Standard verification gate per task

3. **Handle fan-in synchronization**
   - If group has fan-in point: Wait for ALL tasks to complete
   - Verify success of all dependent tasks
   - Only proceed if all tasks succeeded
   - If any task failed: Handle failure before continuing

4. **Progress tracking**
   ```
   ✅ Group 0 Complete (parallel, 3 tasks): 12.3s
   ⏳ Group 1 In Progress (sequential, 1 task): auth service
   ⏸️  Group 2 Waiting (fan-in synchronization)
      ├─→ T5: Complete ✓
      └─→ T6: In Progress (middleware)
   ```

### Safety Checks Before Parallel Execution

Before using opsis-dispatching-parallel-agents for a group:

1. **Check resource conflicts**
   - Same file modifications across tasks → Switch to sequential
   - Same external service dependencies → Switch to sequential
   - Same database schema changes → Switch to sequential

2. **Verify independence**
   - No dependencies between tasks in group
   - No shared state or mutable resources
   - Tasks can complete in any order

3. **Fallback to sequential**
   - If uncertainty detected → Use opsis-implement
   - If conflicts detected → Use opsis-implement
   - Conservative approach preferred over risky parallelization

### Example Dynamic Execution

```
Group 0 (Parallel - 3 tasks):
  Tasks: T1, T2, T3
  Mode: opsis-dispatching-parallel-agents
  Result: All complete ✓

Group 1 (Sequential - 1 task):
  Tasks: T4
  Mode: opsis-implement
  Result: Complete ✓

Group 2 (Sequential - 2 tasks with resource conflict):
  Tasks: T5, T6 (both modify auth package)
  Mode: opsis-implement (switched from parallel due to conflict)
  Result: Complete ✓

Group 3 (Fan-in Point):
  Waiting for T5, T6 before T7
  Action: Synchronization complete ✓

Group 4 (Parallel - 3 tasks):
  Tasks: T7, T8, T9
  Mode: opsis-dispatching-parallel-agents
  Result: Executing...
```

## Task Execution Cycle

For each task (when using sequential execution):
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
