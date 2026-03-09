---
name: opsis-two-stage-review-execution
description: "Use when implementing a plan with clearly defined tasks. Enables high-quality development through sequential task execution with two-stage parallel review (spec compliance and code quality execute simultaneously). Uses tasks---create_task for subtasks with role-based prompts."
license: Apache-2.0
---

# Two-Stage Review Execution

Systematic approach to executing implementation plans through sequential task execution with two-stage review.

## When to Use

Use this skill when:

- Implementation plan exists with clearly defined tasks
- Tasks are mostly independent (minimal interdependencies)
- Development should stay in current session (no context switch)
- Systematic quality gates are required

Do not use when:

- No implementation plan exists
- Tasks are tightly coupled
- Parallel session execution is preferred

## Rules

### Rule: Continuous execution requirement

**When:** Task completes

**Then:** IMMEDIATELY proceed to next task

**DO NOT:**
- Stop at phase boundaries
- Wait for user confirmation between tasks
- Treat phase completion as checkpoint
- Provide "Phase Complete" summaries requiring input

**Continue automatically:** Task 1 → Task 2 → Task 3 → ... → Task N → Final Review

**Only stop for:**
1. Critical errors that block progress
2. Explicit user interruption (user message arrives)
3. All tasks complete (ready for final review)

### Rule: Monitor subtask, don't execute

**When:** Creating subtask with tasks---create_task

**Then:**
1. Create the subtask with clear prompt
2. Set execute: true to start execution
3. Set executeInBackground: false for sequential execution
4. Inform user the subtask was created
5. STOP - DO NOT execute the task yourself
6. DO NOT read files, write code, or use power tools
7. DO NOT attempt to implement or fix anything
8. Monitor subtask's progress using tasks---get_task
9. Retrieve output using tasks---get_task_message
10. Let AiderDesk runtime execute subtask independently

### Rule: Provide complete context to subagents

**When:** Creating subtasks for implementer or reviewers

**Then:** Include complete context in prompt

**Prompt must include:**
- Full task specification (exact text from tasks.md)
- Required libraries and frameworks (explicitly listed)
- Implementation approach or constraints
- Relevant file paths (if known)
- Dependencies with other tasks
- Code style guidelines
- Output format requirements

**Why prevents ambiguity:**
- Subagent doesn't need to search for information
- No guesswork about which libraries to use
- Clear constraints on implementation approach
- Specific output format prevents variance

**Example prompt structure:**
```
Task: [exact task text from tasks.md]

Libraries to use: 
- library-name (version if specified)
- framework-name

Implementation approach:
- Use X pattern
- Follow Y convention
- Avoid Z anti-pattern

File locations (if known):
- /path/to/file1
- /path/to/file2

Output requirements:
- Return git SHAs after completion
- Provide test coverage percentage
- List files modified

Execute this task following opsis-test-driven-development.
```

### Rule: Use executeInBackground correctly

**When:** Creating subtasks

**Then:** Use correct value

**Implementer tasks:**
- executeInBackground: false (sequential, must complete before reviews)

**Reviewer tasks:**
- executeInBackground: true (parallel, both reviewers execute simultaneously)

**Final reviewer:**
- executeInBackground: false (sequential, runs after all tasks complete)

### Rule: Parallel review execution (default behavior)

**When:** Implementer completes

**Then:** Dispatch BOTH reviewers in parallel

**Parallel execution:**
- Spec compliance reviewer and code quality reviewer dispatched simultaneously
- Both reviewers read same implementation independently
- Parent task waits for BOTH to complete
- If both approve: Task complete, proceed to next task
- If either has issues: Implementer fixes ALL feedback, then BOTH reviewers re-review

**Why parallel reviews are safe:**
- Reviewers are read-only operations (no code modifications)
- No conflict risk (both reviewers read same implementation independently)
- No coordination overhead beyond "wait for both"
- Quality gates maintained (both must approve)

### Rule: Retry reviewer tasks on failure

**When:** Reviewer tasks fail

**Then:** Retry automatically

**Retryable errors:**
- Network failures
- Timeout errors
- Rate limit errors
- Temporary unavailability

**Max retry attempts:** 3
**Backoff strategy:** Exponential (1s, 2s, 4s)

**Non-retryable errors:**
- Permanent errors (syntax, logic, validation)
- Implementer task failures (not reviewer errors)

### Rule: Soft failure handling

**When:** All retry attempts exhausted

**Then:** Mark task as failed but continue execution

**Soft failure definition:** Task marked as failed but execution continues

**Soft failure behavior:**
- Mark task as failed in tracking
- Continue with other tasks (if independent)
- Report all failures at end

### Rule: Dispatch implementer task

**When:** Starting task execution

**Then:** Create implementer with complete prompt

**Implementer task prompt components:**
- Task description with full text (exact from tasks.md)
- Required libraries and frameworks (explicit list)
- Implementation approach or constraints
- File locations (if known)
- Scene-setting context
- TDD requirements
- Self-review requirements
- Commit standards
- Question-asking protocol
- Output format requirements

**Implementer behavior:**
- Ask clarifying questions before starting
- Implement using test-driven development
- Write comprehensive tests
- Self-review before reporting completion
- Commit changes with descriptive messages
- Report git SHAs for review

### Rule: Dispatch spec compliance reviewer

**When:** Implementer completes

**Then:** Create spec reviewer task with complete context

**Spec reviewer prompt components:**
- Task specification (exact from tasks.md)
- Implementation details (git SHAs from implementer)
- Compliance checklist
- Issue reporting format
- Required libraries used (for spec compliance check)
- Output format requirements

**Spec reviewer behavior:**
- Compare implementation against specification
- Check for missing requirements
- Check for extra features
- Report specific issues with examples
- Return approval or fix requirements

### Rule: Dispatch code quality reviewer

**When:** Implementer completes

**Then:** Create code quality reviewer task with complete context

**Code quality reviewer prompt components:**
- Git SHAs for review
- Code quality criteria
- Issue classification (critical, important, minor)
- Feedback format
- Task specification (for context)
- Required libraries used (for quality standards check)
- Output format requirements

**Code quality reviewer behavior:**
- Review code at specified git SHAs
- Identify strengths and weaknesses
- Classify issues by severity
- Provide specific, actionable feedback
- Return approval or fix requirements

## Process

1. Plan initialization
   - Read implementation plan file
   - Extract all tasks with full text and context
   - Create task tracking system

2. Per-task execution loop
   - Create implementer task with full task text
   - Wait for implementer to complete
   - Retrieve implementer results (git SHAs, implementation details)
   - Dispatch BOTH reviewers in parallel (executeInBackground: true)
   - Wait for BOTH reviewers to complete
   - Retrieve results from BOTH reviewers
   - Check if BOTH approved
   - If both approved: Task complete, proceed to next task
   - If either has issues: Implementer fixes, then re-review BOTH
   - Mark task complete, immediately proceed to next task

3. Final review
   - After all tasks complete, dispatch final code reviewer task
   - Reviewer evaluates entire implementation holistically
   - Confirm all requirements met
   - Approve for merge

4. Branch completion
   - Use branch completion workflow

## Preconditions

Before using this skill, verify:

- Implementation plan exists with clearly defined tasks
- Tasks are mostly independent
- Using git worktrees (REQUIRED)

## Postconditions

After completing this skill, verify:

- All tasks complete
- Reviews passed for all tasks
- Code committed to branch

## Success Metrics

**Quality metrics:**
- Spec compliance rate: 100% after review
- Code quality approval rate: 100% after review
- Test coverage: > 80% for implemented features

**Efficiency metrics:**
- Parallel execution: Both reviewers work concurrently
- Resource utilization: Both reviewers active simultaneously
- Quality maintained: Same rigorous review process, just faster

## Common Situations

**Situation:** Implementer asks questions

**Pattern:**
- When: Implementer task asks questions
- Then: Answer clearly and completely before allowing implementation

**Situation:** Reviewer needs context

**Pattern:**
- When: Creating reviewer tasks
- Then: Include full task specification, git SHAs, and review criteria in prompt
- Provide complete context: task requirements, implementation details, specific libraries used

**Situation:** Reviewer finds issues

**Pattern:**
- When: Either reviewer finds issues
- Then: Implementer fixes ALL feedback, then BOTH reviewers re-review

**Situation:** Reviewer task fails

**Pattern:**
- When: Retryable error (network, timeout)
- Then: Retry automatically (max 3 attempts)
- When: Non-retryable error (syntax, logic)
- Then: Handle as soft failure, continue with other tasks
