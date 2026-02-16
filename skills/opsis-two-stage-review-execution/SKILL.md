---
name: opsis-two-stage-review-execution
description: Use when implementing a plan with clearly defined tasks. Enables high-quality development through sequential task execution with two-stage parallel review (spec compliance and code quality execute simultaneously). Uses tasks---create_task for subtasks with role-based prompts.
license: Apache-2.0
---

# Two-Stage Review Execution

Systematic approach to executing implementation plans through sequential task execution with two-stage review.

## Core Principle

**Fresh task context per task + two-stage review (spec then quality) = high quality, fast iteration**

### Important Clarification: Role-Based Prompts

> **This skill uses `tasks---create_task` to create tasks with role-based prompts. Role prompts define task behavior (implementer, reviewer), but AD's runtime executes all tasks. No separate agent instances are launched.**

### 🚨 CRITICAL: Execution Boundary

**When you create a subtask with `tasks---create_task`:**

1. ✅ Create the subtask with a clear prompt
2. ✅ Set `execute: true` to start execution
3. ✅ Set `executeInBackground: false` for sequential execution
4. ✅ Inform the user the subtask was created
5. ❌ **STOP - DO NOT execute the task yourself**
6. ❌ **DO NOT read files, write code, or use power tools for that task**
7. ❌ **DO NOT attempt to implement or fix anything related to that subtask**
8. ✅ **Monitor the subtask's progress using `tasks---get_task`**
9. ✅ **Retrieve output using `tasks---get_task_message`**
10. ✅ **Let the AiderDesk runtime system execute the subtask independently**

**The runtime will:**
- Execute the subtask in a fresh session
- Apply two-stage PARALLEL review (spec compliance and code quality execute simultaneously)
- Report back with results

**Your role ends at subtask creation and monitoring.** Do not continue working on that task. The subtask is a separate agent instance that will handle all implementation work.

---

## When to Use

**Use opsis-two-stage-review-execution when:**
- Implementation plan exists with clearly defined tasks
- Tasks are mostly independent (minimal interdependencies)
- Development should stay in current session (no context switch)
- Systematic quality gates are required

**Use alternative approaches when:**
- No implementation plan exists → Manual execution or brainstorm first
- Tasks are tightly coupled → Manual execution or brainstorm first
- Parallel session execution is preferred → Use executing-plans skill

## Tool Selection

For the authoritative rule on subagent vs subtask usage, see **using-opsis**:
- **Rule of Thumb:** Use subagents for research and decisions. Use subtasks for executing work.

**This skill uses `tasks---create_task`** because:
- Implementation work requires full tracking and monitoring
- Two-stage review workflow needs sequential coordination
- Parent-child relationships enable progress tracking
- Task hierarchy supports the review loop pattern
- Each task is a unit of work that needs execution, not just research

## Comparison: Subagent-Driven Development vs. Executing Plans

| Aspect | Subagent-Driven Development | Executing Plans |
|--------|----------------------------|-----------------|
| Session | Same session (no context switch) | Parallel session |
| Subagent Context | Fresh task context per task | Fresh task context per task |
| Review Process | Two-stage review after each task | Review process varies |
| Iteration Speed | Faster (no human-in-loop between tasks) | Slower (requires handoff) |
| Progress Tracking | Continuous, visible | Batch processing |

## Core Workflow

### 1. Plan Initialization

Reference **opsis-worktree-utils** for worktree detection to locate tasks.md.

**Plan Initialization Steps:**

- Read implementation plan file from detected location
- Extract all tasks with full text and context
- Create task tracking system with all extracted tasks
- Note scene-setting context for each task

### 🚨 CRITICAL: Continuous Execution Requirement

**DO NOT STOP at phase boundaries.**

The task list may contain tasks organized into phases (e.g., 40 tasks across 10 phases). When a task completes:
- ✅ Mark task complete in task tracking system
- ✅ Update TODO list if applicable
- ✅ **IMMEDIATELY proceed to the next task**
- ❌ DO NOT wait for user confirmation
- ❌ DO NOT treat phase completion as a checkpoint
- ❌ DO NOT provide a "Phase Complete" summary that requires user input to continue
- ❌ DO NOT pause between tasks unless there's an error

**Continue automatically:** Task 1 → Task 2 → Task 3 → ... → Task N → Final Review

**Only stop for:**
1. Critical errors that block progress
2. Explicit user interruption (user message arrives)
3. All tasks complete (ready for final review)

**Progress Reporting:**

After each task completes, provide a clear status update. Track task counts accurately using Python for computations.

**Task completion:**
```
✅ Task 3/10 complete: "Add user authentication"
   Reviews: Spec ✓ Code Quality ✓
   Commits: abc1234 (impl), def5678 (fixes if any)
   Progress: 3/10 tasks complete
```

**During parallel reviews:**
```
🔄 Task 3/10: "Add user authentication" - Reviews in progress
   Spec Compliance: Reviewing...
   Code Quality: Reviewing...
   Implementer: Complete (commit: abc1234)
```

**During fix loop:**
```
🔄 Task 3/10: "Add user authentication" - Fixing issues
   Spec issues: 2 found
   Code Quality issues: 1 found
   Implementer: Fixing...
   Progress: 2/10 tasks complete, 1 in progress
```

**Soft failure state:**
```
⚠️  Task 3/10 failed: "Add user authentication"
   Error: Connection timeout to database
   Retry attempt 1/3 failed
   Status: Retrying...

Progress: 2/10 tasks complete, 1 retrying
```

**IMPORTANT: For accurate task counts, use Python:**
```python
# Example: Calculate progress
completed = 2
in_progress = 1
total = 10
current_task = completed + in_progress
progress_percent = (completed / total) * 100
```

**Then immediately dispatch the next task without waiting for user input.**

### 2. Per-Task Execution Loop

For each task in sequence:

#### 2.1 Implementer Task Creation

- Create implementer task with full task text and context
- Provide scene-setting information about where task fits
- Allow implementer to ask questions before and during work
- Answer questions clearly and completely before proceeding

#### 2.2 Implementer Work Phase

- Implement task following test-driven development
- Write and run tests
- Self-review implementation
- Commit changes
- Report completion with git SHAs

#### 2.3 Parallel Review Dispatch

- Dispatch BOTH spec compliance reviewer AND code quality reviewer simultaneously
- Both reviewers execute in parallel (`executeInBackground: true`)
- Both reviewers read the same implementation independently
- Parent task waits for BOTH reviewers to complete

#### 2.4 Review Coordination

- Collect feedback from both reviewers
- If BOTH reviewers approve: Task complete, proceed to next task
- If EITHER reviewer has issues: Proceed to fix loop

#### 2.5 Fix Loop (if needed)

- If issues found: implementer task fixes ALL feedback from both reviewers
- Dispatch BOTH reviewers again (parallel re-review)
- Loop until BOTH reviewers approve
- Never proceed to next task without approval from both reviewers

#### 2.7 Task Completion

- Mark task complete in task tracking system
- Provide brief progress update: "✅ Task Complete: [Task Name] - Progress: [X]/[N] tasks ([Y]%)"
- **IMMEDIATELY proceed to next task** (do not wait for user input)
- Continue until all tasks complete or user interrupts

### 3. Final Review

- After all tasks complete, dispatch final code reviewer task
- Reviewer evaluates entire implementation holistically
- Confirm all requirements met
- Approve for merge

### 4. Branch Completion

- Use branch completion workflow
- Prepare for merge

## Subagent Dispatch Protocol

This skill uses the task system to coordinate sequential subagent execution. Each subagent is dispatched as a separate task with proper parent-child relationships, enabling controlled workflow progression and monitoring.

### Required Parameters for tasks---create_task

When dispatching subagents, use the following parameters:

- **`prompt`** (string, required): The constructed prompt template for the subagent, including full task text, scene-setting context, and specific instructions for the subagent role.
- **`parentTaskId`** (string, required): The current task ID to establish a parent-child relationship. This creates a proper task hierarchy for tracking and monitoring.
- **`execute`** (boolean, required): Set to `true` to execute the task immediately upon creation.
- **`executeInBackground`** (boolean, required):
  - **Implementer tasks:** `false` (sequential, must complete before reviews)
  - **Reviewer tasks:** `true` (parallel, both reviewers execute simultaneously)
  - **Final reviewer:** `false` (sequential, runs after all tasks complete)

**🚨 CRITICAL: executeInBackground Settings**

**Implementer tasks MUST use `false`:**
- Implementer must complete before reviews start
- Sequential task execution (one task at a time)
- Prevents conflicts between tasks

**Reviewer tasks MUST use `true`:**
- Spec compliance and code quality reviewers execute in parallel
- Both reviewers read the same code independently
- Parent task waits for BOTH to complete before proceeding
- 50% reduction in review time with no conflict risk

**Why parallel reviews are safe:**
- Reviewers are read-only operations (no code modifications)
- No coordination complexity beyond "wait for both"
- Quality gates maintained (both must approve)
- **`agentProfileId`** (string, optional): Specify when using specialized subagents (e.g., tech-writer for documentation). Default behavior uses standard agent profiles.
- **`modelId`** (string, optional): Override the default model if specific capabilities are required for a subagent task.
- **`name`** (string, optional): Provide a descriptive name for the subtask (e.g., "Implementer: Task 3 - Add user authentication"). If not provided, name is auto-generated from the prompt.

### Sequential Execution Requirement

**Critical:** Always set `executeInBackground: false` for this workflow. The two-stage review pattern requires sequential execution:
1. Implementer subtask completes
2. Spec reviewer reviews the implementation
3. Code quality reviewer reviews (only after spec compliance approved)
4. Proceed to next task

Parallel execution (`executeInBackground: true`) would break the review loops and quality gates.

### Subagent Dispatch Examples

#### Implementer Dispatch Example

```
tasks---create_task(
  prompt: "You are the implementer task for task 3: 'Add user authentication to the API gateway'.

SCENE-SETTING CONTEXT:
This task is part of a larger implementation plan to secure the API gateway. Previous tasks have established the basic gateway structure and routing. This task specifically adds authentication middleware.

TASK DESCRIPTION:
[Full task text from implementation plan]

REQUIREMENTS:
- Follow test-driven development
- Write comprehensive tests before implementation
- Self-review your implementation
- Commit changes with descriptive messages
- Report completion with git SHAs

You may ask clarifying questions before starting implementation.",
  parentTaskId: "<current_task_id>",
  execute: true,
  executeInBackground: false,
  name: "Implementer: Task 3 - Add user authentication"
)
```

#### Spec Compliance Reviewer Dispatch Example

```
tasks---create_task(
  prompt: "You are the spec compliance reviewer for task 3: 'Add user authentication to the API gateway'.

TASK SPECIFICATION:
[Full task specification from implementation plan]

IMPLEMENTATION DETAILS:
- Git commit: <implementer_commit_sha>
- Files modified: auth_middleware.go, auth_test.go, gateway.go
- Implementation summary: [Brief description from implementer]

REVIEW REQUIREMENTS:
- Validate code matches specification exactly
- Check for missing requirements
- Check for extra features (over-building)
- Report specific issues with code examples
- Return approval or fix requirements

Focus on specification compliance only, not code quality.",
  parentTaskId: "<current_task_id>",
  execute: true,
  executeInBackground: false,
  name: "Spec Reviewer: Task 3"
)
```

#### Code Quality Reviewer Dispatch Example

```
tasks---create_task(
  prompt: "You are the code quality reviewer for task 3: 'Add user authentication to the API gateway'.

IMPLEMENTATION DETAILS:
- Git commits to review:
  - <implementer_commit_sha> - Initial implementation
  - <fix_commit_sha> - Spec compliance fixes (if any)

CODE QUALITY CRITERIA:
- Code structure and organization
- Readability and maintainability
- Error handling
- Performance considerations
- Security best practices
- Test coverage and quality

ISSUE CLASSIFICATION:
- Critical: Must fix before approval
- Important: Should fix before approval
- Minor: Nice to fix but can defer

Provide specific, actionable feedback with code examples.",
  parentTaskId: "<current_task_id>",
  execute: true,
  executeInBackground: false,
  name: "Code Quality Reviewer: Task 3"
)
```

#### Retry Logic for Reviewer Tasks

**When reviewer tasks fail, retry automatically:**

- Reviewer tasks are read-only operations (safe to retry)
- Transient errors (network, timeout, rate limit) trigger retry
- Max retry attempts: 3
- Backoff strategy: Exponential (1s, 2s, 4s)

**Retryable errors:**
- Network failures
- Timeout errors
- Rate limit errors
- Temporary unavailability

**Non-retryable errors:**
- Permanent errors (syntax, logic, validation)
- Implementer task failures (not reviewer errors)

**Retry implementation (ALGORITHM - NOT EXECUTABLE CODE):**

```
ALGORITHM: Retry logic for reviewer tasks

Initialize:
  retryCount = 0
  maxRetries = 3

WHILE retryCount < maxRetries:
  
  STEP 1: Dispatch reviewer task (tool call)
  → Use: tasks---create_task with reviewer prompt
  
  STEP 2: Wait for task to complete (polling loop)
  → Use: tasks---get_task to check state
  → Poll until state == "DONE"
  
  STEP 3: Get reviewer output (tool call)
  → Use: tasks---get_task_message with messageIndex: -1
  
  STEP 4: Check if reviewer succeeded
  → Parse output for success/failure
  → IF success: BREAK (exit retry loop)
  
  STEP 5: Check if error is retryable
  → Parse error type from output
  → IF NOT retryable: BREAK (handle as soft failure)
  
  STEP 6: Increment retry count
  → retryCount = retryCount + 1
  
  STEP 7: Check if max retries reached
  → IF retryCount >= maxRetries: BREAK (handle as soft failure)
  
  STEP 8: Calculate backoff delay (Python computation)
  → Execute: python - "import time; time.sleep(2 ** retryCount)"
  → Result: 2s, 4s, 8s exponential backoff
  
  STEP 9: Continue retry loop
  → Go back to STEP 1

END WHILE

FINAL STEP: Handle soft failure
  → Mark task as failed
  → Continue with other tasks
  → Report failure to user

---

IMPORTANT NOTES:

- Tool calls (tasks---create_task, tasks---get_task, tasks---get_task_message) are ACTUAL tool invocations
- Python computation (time.sleep) is for timing/backoff only
- The ALGORITHM above describes the logic flow, not executable code
- You must manually execute each step using the appropriate tools
- Python is used ONLY for time-based calculations (backoff delays)
```

### Soft Failure Handling

**Definition:** Task marked as failed but execution continues

**When to use soft failure:**
- All retry attempts exhausted
- Retryable error but retries failed
- User wants to see all failures before fixing

**Soft failure behavior:**
- Mark task as failed in tracking
- Continue with other tasks (if independent)
- Report all failures at end
- User can retry failed tasks manually

**Progress reporting during soft failure:**
```
⚠️  Spec Reviewer failed after 3 retries: Task 3 "Create user model"
   Error: Connection timeout to database
   Status: Soft failure - continuing with other tasks

🔄 Code Quality Reviewer still running...

Progress: 2/10 tasks complete
Failures: 1 (soft failure)
```

**Final report with soft failures:**
```
✅ Execution Complete

Summary:
- Total tasks: 10
- Completed: 9
- Failed: 1 (soft failure)
- Retried: 2 (both succeeded)

Failed Tasks:
- Task 3: "Create user model" (3 retries exhausted)
  Error: Connection timeout to database
  Status: Soft failure - manual retry required

Would you like to retry failed tasks now? [yes/no]
```

**IMPORTANT: For accurate counts in final report, use Python:**
```python
# Example: Calculate summary statistics
total_tasks = 10
completed = 9
failed = 1
retried = 2
retried_succeeded = 2
```

### Final Reviewer Dispatch Example

```
tasks---create_task(
  prompt: "You are the final code reviewer for the entire implementation.

IMPLMENTATION CONTEXT:
- Implementation plan: [Plan name/description]
- Total tasks completed: <number>
- Branch: <branch_name>

ALL TASKS IMPLEMENTED:
[Summary of all tasks with their commit SHAs]

REVIEW REQUIREMENTS:
- Evaluate entire implementation holistically
- Confirm all requirements met
- Check integration between tasks
- Assess overall code quality
- Verify test coverage across all features

Provide final approval or identify issues requiring attention.",
  parentTaskId: "<current_task_id>",
  execute: true,
  executeInBackground: false,
  name: "Final Reviewer: Full Implementation"
)
```

### Monitoring Workflow

**After dispatching a subagent task, your ONLY job is to monitor its progress. Do not attempt to implement or fix anything yourself.**

**Monitoring Steps:**

1. **Check Task Status**: Use `tasks---get_task(taskId)` to retrieve current task state
   - Look for state: TODO, IN_PROGRESS, DONE
   - Review context files to understand what the subagent is working on
   - Check total message count for activity level

2. **Retrieve Final Output**: Use `tasks---get_task_message(taskId, messageIndex: -1)` to get the last message
   - This contains the subagent's final report or completion status
   - For implementer: Look for git SHAs and completion confirmation
   - For reviewers: Look for approval status or specific issues

3. **Wait for Completion**: Do not proceed to next step until task state is DONE
   - Sequential execution (`executeInBackground: false`) helps with this
   - Poll status periodically if needed

4. **Handle Failures**: If task fails or encounters errors
   - Review error messages
   - Dispatch fix subagent with specific error context using `tasks---create_task`
   - **Do not attempt manual fixes** - this maintains context isolation
   - **Do not read files or write code yourself** - let the fix subtask handle it

**Remember:** You are a controller/coordinator, not an implementer when using this skill. Your job is to create tasks, monitor them, and dispatch follow-up tasks based on results. All implementation work happens inside the subtasks.

### Complete Workflow Example

Here's a complete end-to-end example of the parallel review workflow:

**STEP 1: Dispatch implementer task**
```
Tool call: tasks---create_task(
  prompt: "<implementer prompt with task text and scene-setting>",
  parentTaskId: "<current_task_id>",
  execute: true,
  executeInBackground: false  # Sequential - wait for completion
)
```

**STEP 2: Wait for implementer to complete**
```
Tool call: tasks---get_task(implementerTaskId)
→ Poll until state == "DONE"
```

**STEP 3: Retrieve implementer results**
```
Tool call: tasks---get_task_message(implementerTaskId, messageIndex: -1)
→ Extract git SHAs and implementation details
```

**STEP 4: Dispatch BOTH reviewers in parallel**
```
Tool call: tasks---create_task(
  prompt: "<spec reviewer prompt>",
  parentTaskId: "<current_task_id>",
  execute: true,
  executeInBackground: true  # PARALLEL - don't wait
)

Tool call: tasks---create_task(
  prompt: "<code quality reviewer prompt>",
  parentTaskId: "<current_task_id>",
  execute: true,
  executeInBackground: true  # PARALLEL - don't wait
)
```

**STEP 5: Wait for BOTH reviewers to complete**
```
Tool call: tasks---get_task(specReviewerTaskId)
Tool call: tasks---get_task(codeQualityTaskId)
→ Poll until BOTH have state == "DONE"
```

**STEP 6: Retrieve results from BOTH reviewers**
```
Tool call: tasks---get_task_message(specReviewerTaskId, messageIndex: -1)
Tool call: tasks---get_task_message(codeQualityTaskId, messageIndex: -1)
→ Parse approval status and feedback
```

**STEP 7: Check if BOTH approved**
```
IF specReviewOutput.approved == true AND codeQualityOutput.approved == true:
  → Task complete, proceed to next task
ELSE:
  → Fix loop: dispatch implementer to fix ALL issues
  → Then re-review with BOTH reviewers (parallel again)
```

### Task Hierarchy and Tracking

The parent-child relationship established via `parentTaskId` provides:

- **Visibility**: All subtasks appear in the parent task's context
- **Organization**: Clear hierarchy showing which tasks are subtasks of which
- **Monitoring**: Easy to check status of all dispatched subagents
- **Traceability**: Complete audit trail of all subagent work

### Specialized Subagent Dispatch

When using specialized subagents (e.g., tech-writer for documentation tasks):

```
tasks---create_task(
  prompt: "<documentation prompt>",
  parentTaskId: "<current_task_id>",
  agentProfileId: "tech-writer",
  execute: true,
  executeInBackground: false
)
```

This leverages the subagent's specific expertise while maintaining the sequential workflow.

## Two-Stage Review Pattern

**PARALLEL REVIEW EXECUTION (DEFAULT BEHAVIOR)**

Both reviewers execute in parallel for maximum efficiency. Reviewers only read code, so there's no conflict risk.

### Parallel Execution

- Spec compliance reviewer and code quality reviewer are dispatched simultaneously
- Both reviewers read the same implementation independently
- Parent task waits for BOTH reviewers to complete
- If both approve: Task complete, proceed to next task
- If either has issues: Implementer fixes ALL feedback, then BOTH reviewers re-review

### Stage 1: Spec Compliance Review

- Validates code matches specification exactly
- Checks for missing requirements
- Checks for extra features (over-building)
- Runs in parallel with code quality review

### Stage 2: Code Quality Review

- Evaluates implementation quality
- Assesses code structure, readability, maintainability
- Identifies technical issues (magic numbers, etc.)
- Runs in parallel with spec compliance review

### Coordination Logic

```
1. Implementer completes task → reports git SHAs
2. Parent dispatches BOTH reviewers (executeInBackground: true)
3. Parent waits for BOTH to complete
4. Parent collects feedback from both reviewers
5. If both approve → task complete
6. If either has issues → implementer fixes → re-review both
```

### Why Parallel Reviews Are Safe

- **Read-only operations:** Reviewers only read code, no modifications
- **No conflict risk:** Both reviewers read the same implementation independently
- **No coordination overhead:** Simple "wait for both" logic
- **Quality gates maintained:** Both reviewers must still approve

### Performance Gain

- **50% reduction in review time** (assuming reviews take similar time)
- No quality trade-off (same rigorous review process)
- Zero conflict risk (read-only operations)

## Prompt Templates

### Implementer Task Prompt

**Purpose:** Instructions for implementer task executing a single task

**Key Components:**
- Task description with full text
- Scene-setting context
- TDD requirements
- Self-review requirements
- Commit standards
- Question-asking protocol

**Behavior:**
- Ask clarifying questions before starting
- Implement using test-driven development
- Write comprehensive tests
- Self-review before reporting completion
- Commit changes with descriptive messages
- Report git SHAs for review

### Spec Compliance Reviewer Prompt

**Purpose:** Instructions for spec reviewer task validating specification compliance

**Key Components:**
- Task specification
- Implementation details
- Compliance checklist
- Issue reporting format

**Behavior:**
- Compare implementation against specification
- Check for missing requirements
- Check for extra features
- Report specific issues with examples
- Return approval or fix requirements

### Code Quality Reviewer Prompt

**Purpose:** Instructions for code quality reviewer task evaluating implementation quality

**Key Components:**
- Git SHAs for review
- Code quality criteria
- Issue classification (critical, important, minor)
- Feedback format

**Behavior:**
- Review code at specified git SHAs
- Identify strengths and weaknesses
- Classify issues by severity
- Provide specific, actionable feedback
- Return approval or fix requirements

## Subagent Dispatch Integration

### Subagent Dispatch Protocol

- Use subagent dispatching system
- Each dispatch includes: task text, context, and specific prompt template
- Subagent executes independently with isolated context
- Controller maintains overall workflow state

### Question-Answer Flow

- Implementer task can ask questions at any time
- Controller answers questions before allowing implementation to proceed
- Provide additional context when needed
- Never rush implementer into implementation with unanswered questions

### Review Loop Coordination

- Controller coordinates between implementer and reviewers
- Same implementer task fixes issues found by reviewers
- Reviewer reviews again after fixes
- Controller tracks review iterations
- Proceed only when both reviews approve

### Task Tracking

- Controller maintains task completion state
- Mark tasks complete only after both reviews approve
- Track which tasks remain
- Report progress continuously

### Git Integration

- Implementer commits changes with descriptive messages
- Reviewer receives git SHAs for targeted review
- Final reviewer evaluates entire branch

## Red Flags and Prohibitions

### Never Do

- Start implementation on main/master branch without explicit user consent
- Skip reviews (spec compliance OR code quality)
- Proceed with unfixed issues
- Dispatch multiple implementation subagents in parallel (conflicts)
- Make subagent read plan file (provide full text instead)
- Skip scene-setting context (subagent needs to understand where task fits)
- Ignore subagent questions (answer before letting them proceed)
- Accept "close enough" on spec compliance (spec reviewer found issues = not done)
- Skip review loops (reviewer found issues = implementer fixes = review again)
- Let implementer self-review replace actual review (both are needed)
- **Start code quality review before spec compliance is ✅** (wrong order)
- Move to next task while either review has open issues
- **STOP at phase boundaries** - phase completion is NOT a checkpoint
- **Wait for user confirmation between tasks** - continue automatically
- **Provide "Phase Complete" summaries requiring input** - just report progress and continue

### Question Handling

**When subagent asks questions:**
- Answer clearly and completely
- Provide additional context if needed
- Don't rush them into implementation

### Issue Handling

**When reviewer finds issues:**
- Implementer task fixes them
- Reviewer reviews again
- Repeat until approved
- Don't skip the re-review

### Failure Handling

**When subagent fails task:**
- Dispatch fix subagent with specific instructions
- Don't try to fix manually (context pollution)

## Integration Requirements

### Required Workflow Skills

- **using-git-worktrees** (REQUIRED)
  - Set up isolated workspace before starting
  - Ensures safe parallel development

- **opsis-plan**
  - Creates the plan this skill executes
  - Provides structured task definitions

- **requesting-code-review**
  - Code review template for reviewer tasks
  - Standardizes review feedback

- **finishing-a-development-branch**
  - Complete development after all tasks
  - Prepare for merge

### Subagent Skills

- **test-driven-development**
  - Subagents follow TDD for each task
  - Ensures test coverage

## Advantages

### vs. Manual Execution

- **TDD adoption:** Subagents follow test-driven development naturally
- **Fresh context:** No confusion from accumulated context across tasks
- **Parallel safety:** Subagents operate independently without interference
- **Interactive:** Subagents can ask questions before and during work

### vs. Executing Plans

- **Same session:** No context switch or handoff required
- **Continuous progress:** No waiting between tasks
- **Automatic checkpoints:** Review gates built into workflow

### Efficiency Gains

- **Parallel reviews:** Spec compliance and code quality review execute simultaneously (both reviewers work concurrently)
- **No file reading overhead:** Controller provides full text to subagents
- **Curated context:** Controller provides exactly what subagents need
- **Complete information:** Subagents get all context upfront
- **Early question surface:** Questions asked before work begins, not after

### Quality Gates

- **Self-review:** Catches issues before handoff
- **Two-stage review:** Spec compliance then code quality
- **Review loops:** Ensure fixes actually work
- **Spec compliance:** Prevents over/under-building
- **Code quality:** Ensures implementation is well-built

## Success Metrics

### Quality Metrics
- Spec compliance rate: 100% after review
- Code quality approval rate: 100% after review
- Test coverage: > 80% for implemented features

### Efficiency Metrics
- **Parallel execution:** Both reviewers work concurrently instead of sequentially
- **Resource utilization:** Both reviewers active simultaneously (no idle time)
- **Quality maintained:** Same rigorous review process, just faster

### Adoption Metrics
- Skill activation success rate: 100%
- Subagent dispatch success rate: > 95%
- User satisfaction: Qualitative feedback positive

## Related Skills

- **opsis-test-driven-development** - Subagents follow TDD for each task
- **opsis-verification-before-completion** - Verify completion with evidence
- **opsis-systematic-debugging** - If issues arise during implementation
