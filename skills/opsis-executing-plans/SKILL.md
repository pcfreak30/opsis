---
name: opsis-executing-plans
description: "Use when you have a written implementation plan to execute in a separate session with review checkpoints"
---

# Executing Plans

Load plan, review critically, execute tasks in batches, report for review between batches.

## When to Use

Use this skill when:

- You have a written implementation plan (tasks.md)
- Want to execute in separate session with review checkpoints
- Need architect review between batches
- Batch execution with wait-for-feedback

Do not use when:

- No tasks.md exists
- Want continuous execution without checkpoints
- Single task execution

## Rules

### Rule: Review plan critically first

**When:** Starting plan execution

**Then:** Review plan for questions or concerns

**If concerns exist:**
**Then:** Raise them with human partner before starting

**If no concerns:**
**Then:** Create TODO list and proceed

### Rule: Execute in batches

**When:** Executing tasks

**Then:** Use default batch size of 3 tasks

**For each task:**
- Mark as in progress
- Follow each step exactly
- Run verifications as specified
- Mark as completed

### Rule: Report between batches

**When:** Batch completes

**Then:** Report progress and wait for feedback

**Report includes:**
- What was implemented
- Verification output
- "Ready for feedback"

### Rule: Continue based on feedback

**When:** Feedback received

**Then:**
- Apply changes if needed
- Execute next batch
- Repeat until complete

### Rule: Stop when blocked

**When:** Hit blocker mid-batch

**Then:** Stop immediately

**Blocker types:**
- Missing dependency
- Test fails
- Instruction unclear
- Verification fails repeatedly

**Never:** Guess or force through blockers

### Rule: Revisit earlier steps when needed

**When:** Partner updates plan

**Then:** Return to review step

**When:** Fundamental approach needs rethinking

**Then:** Return to review step

**Never:** Force through blockers

### Rule: Use finishing skill after completion

**When:** All tasks complete and verified

**Then:** Use opsis-finishing-a-development-branch

**Never:** Start implementation on main/master branch without explicit user consent

## Process

1. Load and review plan
2. Execute first batch (default 3 tasks)
3. Report completion and verification output
4. Wait for feedback
5. Apply changes if needed
6. Execute next batch
7. Repeat until all tasks complete
8. Use opsis-finishing-a-development-branch

## Preconditions

Before using this skill, verify:

- tasks.md exists
- Plan has been reviewed
- User wants separate session execution

## Postconditions

After completing this skill, verify:

- All tasks from plan executed
- Verification evidence provided
- opsis-finishing-a-development-branch invoked

## Success Metrics

This skill is successful when:

- All tasks executed in batches
- Review checkpoints completed between batches
- Feedback applied before proceeding
- Verification evidence provided for each batch

## Common Situations

**Situation:** Blocker encountered mid-batch

**Pattern:**
- When: Dependency missing, test fails, or instruction unclear
- Then: Stop immediately, ask for clarification

**Situation:** Partner updates plan

**Pattern:**
- When: Plan changes during execution
- Then: Return to review step, re-evaluate approach

**Situation:** All tasks complete

**Pattern:**
- When: Final batch completes
- Then: Use opsis-finishing-a-development-branch
