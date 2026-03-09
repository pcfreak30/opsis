---
name: opsis-dispatching-parallel-agents
description: "Parallel execution engine for independent tasks across different domains. Use when implementing features with 3+ independent tasks that can execute simultaneously, or debugging multiple independent failures. Enables parallel concurrent execution for near-linear time savings."
license: Apache-2.0
---

# Dispatching Parallel Agents

Parallel execution engine for coordinating multiple AI agents working on independent tasks simultaneously.

## When to Use

Use this skill when:

- 3+ independent implementation tasks from a plan
- Tasks span different files, modules, or subsystems
- Tasks have no dependencies or shared state
- Feature work requiring parallel execution
- Multiple failures across different test files or subsystems
- Failures are truly independent (no shared state, no dependencies)

Do not use when:

- Single task (use direct execution)
- Related tasks with shared code paths (execute together)
- Tasks have dependencies (use sequential execution)
- Unclear independence (assess first)

## Rules

### Rule: Verify independence before parallel dispatch

**When:** Considering parallel execution

**Then:** Verify all independence criteria

**Independence criteria:**
- Different files, modules, or subsystems
- Separate code paths with no overlap
- No shared state between task domains
- Completing one task does not affect others
- No dependencies between tasks

**If any criterion fails:**
**Then:** Use sequential execution

### Rule: Check parallel execution safety

**When:** Planning parallel dispatch

**Then:** Verify no resource conflicts

**Safety checks:**
- No concurrent resource conflicts (same files, same external services)
- No dependency chains between tasks
- Available agent capacity (system limits)

**If safety check fails:**
**Then:** Use sequential execution

### Rule: Create focused agent prompts

**When:** Creating agent prompts

**Then:** Specify single task domain

**Prompt components:**
- Specific file(s) to work on
- Clear goal statement
- Scope boundaries (what to include/exclude)

**Constraint:** Maximum one cohesive task group per agent

### Rule: Include self-contained context

**When:** Creating agent prompts

**Then:** Include all necessary context

**Required elements:**
- Task requirements or error messages (sanitized)
- Relevant specifications or test descriptions
- Relevant code snippets (if applicable)
- Expected vs actual behavior (for debugging)
- Any known constraints or requirements

**Never:** Use external references or "see other file" instructions

### Rule: Specify output requirements

**When:** Creating agent prompts

**Then:** Specify expected output format

**Required elements:**
- Summary of work completed
- Changes made (files modified, functions affected)
- Rationale for approach
- Verification steps taken
- Any remaining issues or concerns

### Rule: Use executeInBackground for parallel execution

**When:** Creating parallel agent tasks

**Then:** Always set executeInBackground to true

**Critical requirement:**
- executeInBackground MUST be true for this skill
- Enables concurrent execution
- Achieves near-linear time savings

**Never:** Use executeInBackground: false

### Rule: Monitor all parallel tasks

**When:** Parallel tasks are executing

**Then:** Track status of all tasks

**Monitoring workflow:**
- Store task IDs returned from task creation
- Use tasks---get_task to check each task's status
- Poll periodically until all tasks complete
- Track which tasks are IN_PROGRESS, DONE, or FAILED
- Monitor message count to gauge progress

### Rule: Collect results from all agents

**When:** All parallel tasks complete

**Then:** Collect and consolidate results

**Collection workflow:**
- Use tasks---get_task_message to get final output from each task
- Collect all results into consolidated report
- Organize results by domain/task
- Present to user with conflict detection if applicable
- Summarize changes made by each agent

### Rule: Detect conflicts before integration

**When:** All agents complete

**Then:** Check for conflicts

**Conflict types:**
- Same file modified by multiple agents
- Overlapping function changes
- Conflicting dependency updates

**Detection method:** File-level and function-level change analysis

### Rule: Run verification after integration

**When:** Agent tasks complete

**Then:** Run full verification

**Verification steps:**
- Review all agent summaries
- Check for conflicts
- Run full test suite
- Perform spot checks on critical paths
- Validate no regressions introduced

## Process

1. Assess task independence
2. Verify parallel execution safety
3. Group related tasks into coherent work domains
4. Create focused agent prompts for each domain
5. Create all parallel tasks with executeInBackground: true
6. Monitor all parallel tasks to completion
7. Collect results from all completed tasks
8. Detect conflicts between agent changes
9. Run verification after integration
10. Provide integration guidance if conflicts detected

## Preconditions

Before using this skill, verify:

- 3+ independent tasks exist
- Tasks have no dependencies or shared state
- No concurrent resource conflicts
- Available agent capacity

## Postconditions

After completing this skill, verify:

- All parallel tasks completed
- Results collected from all agents
- Conflicts detected and reported
- Verification executed
- Integration guidance provided

## Success Metrics

This skill is successful when:

- Time savings: ≥50% reduction in execution time for 3+ independent tasks
- Parallel efficiency: Actual parallel time ≤ (sequential time / N) + 20% overhead
- Success rate: ≥90% of parallel dispatches achieve complete resolution
- Conflict rate: ≤10% of parallel dispatches detect conflicts requiring manual resolution

## Common Situations

**Situation:** Parallel feature implementation

**Pattern:**
- When: 3+ independent features from implementation plan
- Then: Create agent for each feature domain
- Verify: All agents complete without conflicts

**Situation:** Parallel debugging

**Pattern:**
- When: Multiple independent test failures
- Then: Create agent for each failure domain
- Verify: All fixes resolve issues without conflicts

**Situation:** Resource conflict detected

**Pattern:**
- When: Same file modifications across tasks
- Then: Switch to sequential execution
- Verify: No conflicts during execution

**Situation:** Dependencies detected

**Pattern:**
- When: Tasks require completion in specific order
- Then: Use sequential execution
- Verify: Tasks complete in correct order
