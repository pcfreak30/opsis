---
name: opsis-executing-plans
description: Use when you have a written implementation plan to execute in a separate session with review checkpoints
---

# Executing Plans
Load plan, review critically, execute tasks in batches, report for review between batches.

**Core principle:** Batch execution with checkpoints for architect review.

**Announce at start:** "I'm using the opsis-executing-plans skill to implement this plan."

## The Process

### Step 1: Load and Review Plan

Reference **opsis-worktree-utils** for worktree detection to locate tasks.md.

1. Read plan file from detected location
2. Review critically - identify any questions or concerns about the plan
3. If concerns: Raise them with your human partner before starting
4. If no concerns: Create TODO list and proceed

### Step 2: Execute Batch

**Default: First 3 tasks**

For each task:
1. Mark as in progress
2. Follow each step exactly (plan has bite-sized steps)
3. Run verifications as specified
4. Mark as completed

### Step 3: Report

When batch complete:
- Show what was implemented
- Show verification output
- Say: "Ready for feedback."

### Step 4: Continue

Based on feedback:
- Apply changes if needed
- Execute next batch
- Repeat until complete

### Step 5: Complete Development

After all tasks complete and verified:
- Announce: "I'm using the opsis-finishing-a-development-branch skill to complete this work."
- **REQUIRED SUB-SKILL:** Use opsis-finishing-a-development-branch
- Follow that skill to verify tests, present options, execute choice

## When to Stop and Ask for Help

**STOP executing immediately when:**
- Hit a blocker mid-batch (missing dependency, test fails, instruction unclear)
- Plan has critical gaps preventing starting
- You don't understand an instruction
- Verification fails repeatedly

**Ask for clarification rather than guessing.**

## When to Revisit Earlier Steps

**Return to Review (Step 1) when:**
- Partner updates the plan based on your feedback
- Fundamental approach needs rethinking

**Don't force through blockers** - stop and ask.

## Remember

- Review plan critically first
- Follow plan steps exactly
- Don't skip verifications
- Reference skills when plan says to
- Between batches: just report and wait
- Stop when blocked, don't guess
- Never start implementation on main/master branch without explicit user consent

## Integration

**Optional workflow skills:**
- **opsis-using-git-worktrees** - Optional: Set up isolated workspace before starting (when manual control needed)
- **opsis-plan** - Creates the plan this skill executes
- **opsis-finishing-a-development-branch** - Complete development after all tasks

## Tool Selection

For the authoritative rule on subagent vs subtask usage, see **using-opsis**:
- **Rule of Thumb:** Use subagents for research and decisions. Use subtasks for executing work.

**This skill uses:**
- `tasks---create_task` for creating subtasks that execute implementation work
- Direct execution in current session for simple sequential tasks
