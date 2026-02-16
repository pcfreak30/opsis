---
name: opsis-dispatching-parallel-agents
description: Use when facing multiple independent failures across different test files, subsystems, or problem domains. Enables parallel concurrent resolution for near-linear time savings.
license: Apache-2.0
---

# Dispatching Parallel Agents

Structured methodology for parallelizing independent problem investigations using multiple AI agents.

## Core Value Proposition

Transform sequential multi-hour investigations into parallel concurrent resolutions, achieving near-linear time savings for independent problem domains.

## When to Use

**Use opsis-dispatching-parallel-agents when:**
- Multiple failures across different test files
- Multiple failures across different subsystems
- Failures are truly independent (no shared state, no dependencies)
- Problems can be understood and fixed without context from others

**Do NOT use when:**
- Single failure (use sequential investigation)
- Related failures with shared code paths (investigate relationship first)
- Failures have dependencies (use sequential investigation)
- Unclear independence (assess first)

## Tool Selection

For the authoritative rule on subagent vs subtask usage, see **using-opsis**:
- **Rule of Thumb:** Use subagents for research and decisions. Use subtasks for executing work.

**This skill uses `tasks---create_task`** because:
- Multiple agents need to work independently on different domains
- Parallel execution requires task tracking for each agent
- Parent-child relationships enable monitoring of all parallel tasks
- Need to collect results from multiple independent investigations
- Each agent is executing work on a specific problem domain

## Decision Framework

### 1. Independence Assessment

**Assess whether multiple failures are independent or related.**

**Decision criteria:**
- Different test files with unrelated test domains
- Different subsystems with separate code paths
- No shared state between problem domains
- Fixing one problem does not affect others

**Output:** Binary decision (parallel or sequential) with rationale

### 2. Parallel Readiness Check

**Verify parallel execution is safe.**

**Checks:**
- No concurrent resource conflicts (same files, same external services)
- No dependency chains between problems
- Available agent capacity (system limits)

**Output:** Go/no-go decision for parallel dispatch

### 3. Domain Grouping

**Group related failures into coherent problem domains.**

**Process:**
1. Cluster failures by file/subsystem
2. Verify independence between clusters
3. Assign each cluster to one agent

**Output:** Mapped domains to agents

## Agent Prompt Construction

### Focused Scope Definition

Each agent prompt must specify a single problem domain.

**Components:**
- Specific file(s) to investigate
- Clear goal statement (e.g., "Make these tests pass")
- Scope boundaries (what to include/exclude)

**Constraint:** Maximum one test file or one subsystem per agent

### Self-Contained Context

Each agent prompt must include all necessary context.

**Required elements:**
- Error messages and stack traces (sanitized)
- Test names and descriptions
- Relevant code snippets (if applicable)
- Expected vs actual behavior
- Any known constraints or requirements

**No external references or "see other file" instructions.**

### Specific Output Requirements

Each agent prompt must specify expected output format.

**Required elements:**
- Summary of findings (root cause analysis)
- Changes made (files modified, functions affected)
- Rationale for approach
- Verification steps taken
- Any remaining issues or concerns

**Output format:** Structured markdown or JSON

### Constraint Specification

Each agent prompt must include explicit constraints.

**Constraint categories:**
- Code modification bounds (files allowed to edit)
- Approach restrictions (e.g., "do not increase timeouts")
- Dependency constraints (must use existing patterns)
- Testing requirements (must run specific tests)

## Parallel Execution Management

### Task Creation

Spawn parallel agent tasks using the task system.

**For each domain:**
1. Create task via `tasks---create_task` with the following parameters:
   - `prompt` (string, required): The constructed agent prompt with focused scope and self-contained context
   - `parentTaskId` (string, required): Current task ID to create subtask relationship for grouping
   - `execute` (boolean, required): `true` to execute immediately
   - `executeInBackground` (boolean, required): **ALWAYS `true` for this skill** - enables concurrent execution
   - `agentProfileId` (string, optional): For specialized subagents
2. Set task name reflecting domain scope
3. Provide constructed agent prompt as initial message

**🚨 CRITICAL: executeInBackground MUST be true**

This skill requires parallel execution because:
1. **Problems are independent:** Each agent works on a completely separate problem domain
2. **No coordination needed:** Agents don't need to communicate or wait for each other
3. **Time savings critical:** Parallel execution achieves near-linear time savings
4. **Parent monitors all:** The parent task dispatches all tasks, then monitors all of them simultaneously

**Never use `executeInBackground: false` with this skill.** It would defeat the purpose of parallel execution and provide no time savings.

**Constraint:** All tasks created before any execute

**Parallel Execution Pattern:**
- Create ALL parallel tasks first using `tasks---create_task` with `executeInBackground: true`
- Do not wait between task creations
- All tasks will execute concurrently once created
- Critical: `executeInBackground: true` enables concurrent execution

**Example: Creating Parallel Tasks**
```javascript
// Create all parallel tasks first
tasks---create_task(
  prompt: "<Agent 1 prompt with focused scope and self-contained context>",
  parentTaskId: "<current_task_id>",
  execute: true,
  executeInBackground: true
)

tasks---create_task(
  prompt: "<Agent 2 prompt with focused scope and self-contained context>",
  parentTaskId: "<current_task_id>",
  execute: true,
  executeInBackground: true
)

tasks---create_task(
  prompt: "<Agent 3 prompt with focused scope and self-contained context>",
  parentTaskId: "<current_task_id>",
  execute: true,
  executeInBackground: true
)

// All tasks now executing in parallel
```

### Task Monitoring

Track status of parallel agent tasks.

**Monitoring workflow:**
- Store task IDs returned from `tasks---create_task`
- Use `tasks---get_task(taskId)` to check each task's status
- Poll periodically until all tasks complete
- Track which tasks are IN_PROGRESS, DONE, or FAILED
- Monitor message count to gauge progress

**Monitoring capabilities:**
- Real-time status check via `tasks---get_task`
- Progress tracking (task state, message count)
- Error detection and reporting
- No blocking on individual task completion

### Result Collection

Collect results from all completed agent tasks.

**Collection workflow:**
- Use `tasks---get_task_message(taskId, messageIndex: -1)` to get final output from each task
- Collect all results into consolidated report
- Organize results by domain/task
- Present to user with conflict detection if applicable
- Summarize changes made by each agent

**Collection process:**
1. Poll task status until all complete
2. Retrieve final messages from each task using `tasks---get_task_message`
3. Extract summaries and changes
4. Organize results by domain

**Output:** Consolidated results document

## Integration and Verification

### Conflict Detection

Detect potential conflicts between agent changes.

**Conflict types:**
- Same file modified by multiple agents
- Overlapping function changes
- Conflicting dependency updates

**Detection method:** File-level and function-level change analysis

### Verification Execution

Run verification after agent tasks complete.

**Verification steps:**
1. Review all agent summaries
2. Check for conflicts
3. Run full test suite
4. Perform spot checks on critical paths
5. Validate no regressions introduced

### Integration Guidance

Provide guidance for integrating agent changes.

**When conflicts detected:**
1. Highlight conflicting changes
2. Suggest resolution approaches
3. Recommend manual review

**When no conflicts:**
1. Confirm safe integration
2. Provide integration order (if dependencies exist)
3. Recommend final verification steps

## Common Mistakes and Anti-Patterns

### Prompt Construction Mistakes

**Anti-Pattern 1: Too Broad Scope**
- ❌ "Fix all the failing tests"
- ✅ "Fix agent-tool-abort.test.ts failures"
- Impact: Agent gets lost, unclear focus, wasted time

**Anti-Pattern 2: Missing Context**
- ❌ "Fix the race condition in the tests"
- ✅ "Fix timing issues in agent-tool-abort.test.ts: expects 'interrupted at' but gets timeout"
- Impact: Agent doesn't know where to start, requires clarification

**Anti-Pattern 3: No Constraints**
- ❌ "Make the tests pass"
- ✅ "Fix tests only, do not modify production code. Replace timeouts with event-based waiting."
- Impact: Agent might refactor everything, unnecessary changes

**Anti-Pattern 4: Vague Output Expectations**
- ❌ "Fix it and tell me what you did"
- ✅ "Return: Summary of root cause, list of files modified, verification steps taken"
- Impact: Unclear what changed, difficult to review

### Execution Mistakes

**Anti-Pattern 5: Related Failures Treated as Independent**
- ❌ Dispatch parallel agents for failures in same code path
- ✅ Investigate relationship first, combine related failures
- Impact: Redundant work, potential conflicts, wasted time

**Anti-Pattern 6: Sequential Task Creation**
- ❌ Create and execute tasks one at a time
- ✅ Create all tasks first, then execute in parallel
- Impact: No actual parallelization, sequential execution time

**Anti-Pattern 7: No Conflict Detection**
- ❌ Integrate changes without checking for conflicts
- ✅ Analyze changes for conflicts before integration
- Impact: Overwrites, broken code, difficult to debug

**Anti-Pattern 8: Skipping Verification**
- ❌ Trust agent results without verification
- ✅ Run full test suite and spot checks
- Impact: Regressions, systematic errors, false confidence

### Decision Framework Mistakes

**Anti-Pattern 9: Parallel When Not Safe**
- ❌ Dispatch parallel agents for shared state problems
- ✅ Use sequential investigation when dependencies exist
- Impact: Race conditions, corrupted state, unreliable fixes

**Anti-Pattern 10: Sequential When Parallel Possible**
- ❌ Investigate independent failures sequentially
- ✅ Use parallel dispatch for truly independent problems
- Impact: Wasted time, extended debugging timeline

## Usage Example

### Scenario: 6 test failures across 3 files after major refactoring

**Failures:**
- `agent-tool-abort.test.ts`: 3 failures (timing issues)
- `batch-completion-behavior.test.ts`: 2 failures (tools not executing)
- `tool-approval-race-conditions.test.ts`: 1 failure (execution count = 0)

**Decision:** Independent domains - abort logic separate from batch completion separate from race conditions

**Agent 1 Prompt:**
```markdown
Fix the 3 failing tests in src/agents/agent-tool-abort.test.ts:

1. "should abort tool with partial output capture" - expects 'interrupted at' in message
2. "should handle mixed completed and aborted tools" - fast tool aborted instead of completed
3. "should properly track pendingToolCount" - expects 3 results but gets 0

These are timing/race condition issues. Your task:

1. Read the test file and understand what each test verifies
2. Identify root cause - timing issues or actual bugs?
3. Fix by:
   - Replacing arbitrary timeouts with event-based waiting
   - Fixing bugs in abort implementation if found
   - Adjusting test expectations if testing changed behavior

Do NOT just increase timeouts - find the real issue.

Return: Summary of what you found and what you fixed.
```

**Agent 2 Prompt:** [Similar structure for batch-completion-behavior.test.ts]

**Agent 3 Prompt:** [Similar structure for tool-approval-race-conditions.test.ts]

**Results:**
- Agent 1: Replaced timeouts with event-based waiting
- Agent 2: Fixed event structure bug (threadId in wrong place)
- Agent 3: Added wait for async tool execution to complete

**Integration:** All fixes independent, no conflicts, full suite green

**Time Saved:** 3 problems solved in parallel vs sequentially

## Key Benefits

1. **Parallelization Efficiency** - Multiple investigations happen simultaneously, achieving near-linear time savings
2. **Focused Attention** - Each agent has narrow scope, reducing cognitive load and context switching
3. **Independence Guarantee** - Agents work on isolated domains, eliminating interference and coordination overhead
4. **Scalable Approach** - Pattern extends from 2 to N agents, accommodating increasing failure counts
5. **Quality Preservation** - Focused prompts and constraints maintain fix quality while increasing speed
6. **Resource Optimization** - Maximizes utilization of available AI agent capabilities

## Success Metrics

### Quantitative Metrics
- **Time Savings:** ≥50% reduction in debugging time for 3+ independent failures
- **Parallel Efficiency:** Actual parallel time ≤ (sequential time / N) + 20% overhead
- **Success Rate:** ≥90% of parallel dispatches achieve complete resolution
- **Conflict Rate:** ≤10% of parallel dispatches detect conflicts requiring manual resolution

### Qualitative Metrics
- **User Satisfaction:** Positive feedback on clarity and effectiveness
- **Adoption Rate:** Increasing usage across teams over time
- **Error Reduction:** Fewer regressions introduced during parallel fixes
- **Knowledge Transfer:** Improved understanding of parallel agent capabilities

## Risks and Mitigations

### Risk 1: False Independence Assessment

**Description:** Incorrectly treating related failures as independent

**Impact:** Redundant work, conflicting fixes, wasted time

**Mitigation:**
- Require clear evidence of independence before parallel dispatch
- Provide detailed rationale for decision
- Allow user override with explicit confirmation

### Risk 2: Agent Prompt Ambiguity

**Description:** Insufficient context or unclear constraints in prompts

**Impact:** Agent requests clarification, delays execution

**Mitigation:**
- Checklist of required prompt elements
- Automated validation before task creation
- Template-based prompt construction

### Risk 3: Integration Conflicts

**Description:** Agents make conflicting changes to shared code

**Impact:** Integration failure, requires manual resolution

**Mitigation:**
- File-level and function-level change analysis
- Pre-integration conflict report
- Manual review required for conflicts

### Risk 4: Systematic Agent Errors

**Description:** Multiple agents make similar mistakes (e.g., same bad pattern)

**Impact:** Widespread issues, difficult to identify

**Mitigation:**
- After integration, perform focused spot checks
- Look for systematic patterns across agent changes
- Run full test suite to catch regressions

## Verification Checklist

Before accepting parallel agent results:

- [ ] Reviewed all agent summaries
- [ ] Checked for file-level conflicts
- [ ] Checked for function-level conflicts
- [ ] Ran full test suite
- [ ] Performed spot checks on critical paths
- [ ] Validated no regressions introduced
- [ ] Confirmed all original failures resolved
- [ ] Documented any remaining issues

## Related Skills

- **opsis-systematic-debugging** - Each agent should use systematic debugging for their domain
- **opsis-verification-before-completion** - Verify integration before claiming completion
- **opsis-two-stage-review-execution** - Alternative for single-session execution with reviews

## Core Principles

1. **Independence First:** Only dispatch parallel agents when problems are truly independent
2. **Focused Scope:** Each agent receives a single, well-defined problem domain
3. **Self-Contained Context:** All necessary information included in each agent's prompt
4. **Specific Output:** Clear expectations for what each agent must return
5. **Controlled Constraints:** Explicit boundaries on what agents can and cannot modify
