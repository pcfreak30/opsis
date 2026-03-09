---
name: opsis-implement
description: "Execute tasks from tasks.md with optional Opsis skill invocation. Detect context, suggest relevant skills, require verification before completion."
license: Apache-2.0
---

# Implement

Execute implementation tasks with optional Opsis skill invocation and verification.

## When to Use

Use this skill when:

- User says "proceed", "continue", "start", "begin"
- User indicates task continuation
- tasks.md exists with unchecked items

Do not use when:

- No tasks.md exists
- No TODO list exists
- User asks about requirements or planning

## Rules

### Rule: Check for compact recovery first

**When:** Starting implementation

**Then:** Check for compact recovery indicators

**Detection indicators:**
- "Conversation Summary" heading present
- Short prompts without clear context (< 30 chars)
- User says "continue", "proceed", "next" without specifying task
- Missing context about what was being worked on
- Confusion indicators: "where were we", "what's next"

**If indicators detected:**
**Then:** Invoke opsis-compact-recovery
**Then:** Proceed after recovery completes

### Rule: Use sensible defaults for task selection

**When:** User indicates continuation

**Then:** Use default behavior without prompting

**Default behavior:**
- User indicates continuation with incomplete TODO: Continue next incomplete task
- User indicates continuation after PRD/tasks.md creation: Execute all tasks
- User mentions specific task: Execute that task only
- User indicates continuation with unclear intent: Ask for clarification

**Continuation intent:** "proceed", "yes", "yeah", "y", "go", "continue", "ok", "okay", "start", "begin"

### Rule: Apply workflow routing

**When:** Starting implementation

**Then:** Apply auto-routing rules

**Routing rules:**
- User says "all" AND tasks > 10: Invoke opsis-two-stage-review-execution
- User says "all" AND tasks ≤ 10: Use opsis-implement
- User says "task N" (single): Use opsis-implement
- User says "phase N": Use opsis-implement
- User wants separate session: Invoke opsis-executing-plans
- Bug investigation: Invoke opsis-systematic-debugging

### Rule: Suggest relevant skills

**When:** During implementation

**Then:** Suggest skills based on task context

**Skill suggestions:**
- About to write new code: Suggest opsis-test-driven-development (optional)
- About to claim completion: Require opsis-verification-before-completion

### Rule: Execute task cycle for each task

**When:** Executing tasks

**Then:** Follow task execution cycle

**Task execution cycle:**
1. Read task (title, description, implementation details)
2. Check PRD for requirements context
3. Implement (write production-quality code)
4. Verification gate (tests, build, lint)
5. Fix loop if verification fails
6. Mark complete (edit tasks.md: `- [ ]` → `- [x]`)
7. Next task

### Rule: Apply memory store integration

**When:** Retrieve or store memory

**Then:** Follow eligibility criteria

**When to retrieve:**
- Before starting implementation: Retrieve workflow contracts
- Before complex tasks: Retrieve architectural decisions
- After debugging: Retrieve critical findings

**When to store:**
- After successful chunk validation: Store successful patterns
- After workflow completion: Store milestones and decisions
- Before starting: Store workflow contracts

**Store ONLY if ALL true:**
- Reusable across future tasks
- Stable (unlikely to change soon)
- Actionable (changes future behavior)
- Type matches: user-preference, code-pattern, or task

**Never store:**
- Task progress/status
- One-off bug details
- Implementation details
- Transient notes
- File lists
- Logs/stack traces
- Secrets/tokens/credentials/PII

### Rule: Report blocked tasks

**When:** Task is blocked

**Then:** Report blocker type and options

**Blocker types:**
- Dependency
- Unclear
- Technical
- External

**Report format:**
> "⚠️ Task {task-id} is blocked. Reason: {description}. Options: provide needed info | skip | clarify"

### Rule: Report progress after each task

**When:** Task completes

**Then:** Report progress

**Progress format:**
```
✅ Task Complete: "{title}"
Progress: [completed]/[total] tasks ([percentage]%)

⏳ Next: "{next task title}"
```

## Process

1. Check for compact recovery indicators
2. If detected, invoke opsis-compact-recovery
3. Detect task scope (all tasks, specific task, unclear)
4. Apply workflow routing
5. Execute task cycle for each task
6. Report progress after each task
7. After all tasks complete, use opsis-verify

## Preconditions

Before using this skill, verify:

- tasks.md exists (use opsis-worktree-utils to locate)
- User intent is implementation (not planning)

**CRITICAL: Before accessing tasks.md**
- Stop if worktree state unknown
- Invoke opsis-worktree-utils
- Get resolved path for tasks.md
- Only then proceed with file operations

## Postconditions

After completing this skill, verify:

- All tasks in tasks.md marked complete
- Verification evidence provided for each task
- Tests pass (0 failures)
- Linter clean (0 errors)

## Success Metrics

This skill is successful when:

- All tasks complete with evidence
- Zero verification failures
- Code committed to branch

## Common Situations

**Situation:** User says "proceed" after planning

**Pattern:**
- Check: tasks.md exists
- If true: Execute all tasks
- If false: Ask what to implement

**Situation:** Verification fails

**Pattern:**
- When: verification_fails
- Then: fix_and_reverify
- Until: verification_passes
