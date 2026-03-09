---
name: opsis-mode-enforcer
description: "Use for ALL agent operations to enforce mode boundaries and workflow discipline. Required before any action: declare mode, verify permissions, and follow Iron Laws. Blocks unauthorized code generation during planning and enforces verification before completion."
license: Apache-2.0
---

# Mode Enforcer

Mode enforcement system that strictly governs agent behavior across Planning, Implementation, and Verification modes, ensuring workflow discipline, preventing unauthorized code generation, and maintaining clear external state representation.

## When to Use

Use this skill when:

- Before ANY agent action
- Executing any tool
- Responding to any user request
- Beginning any workflow

Do not use when:

- Mode is already declared and verified
- Simple read-only operations

## Rules

### Rule: Declare mode before any action

**When:** Starting any work

**Then:** Declare mode using standard format

**Mode declaration format:**
```markdown
**OPSIS MODE: [Mode Name]**
Mode: [planning|implementation|verification]
Purpose: [brief description of current activity]
Implementation: [AUTHORIZED|BLOCKED] - [additional context]
```

### Rule: Verify mode permissions before action

**When:** Taking any action

**Then:** Verify action is authorized for current mode

**Planning Mode authorized:**
- Ask strategic questions
- Analyze requirements and gather context
- Create planning documents (PRDs, plans, prompts)
- Guide through workflows
- Retrieve context and memory
- Use TODO management tools
- Read files for analysis (1-2 files directly)
- Delegate to subagent for complex codebase analysis
- Search codebase for understanding (simple searches only)

**Planning Mode blocked:**
- Write implementation code
- Create components/functions
- Modify production files
- Execute build/test commands
- Implement features directly
- File write/edit operations (except for planning documents)
- Direct codebase exploration without delegation

**Implementation Mode authorized:**
- Write production code
- Execute tasks from plans
- Run verification commands
- Create git commits (if requested)
- Mark tasks complete with evidence
- Follow PRD specifications
- File read/write/edit operations for implementation
- Execute build/test commands
- Use opsis-two-stage-review-execution for multi-task execution
- Delegate to subagent for complex code analysis

**Implementation Mode blocked:**
- Skip verification steps
- Mark tasks complete without evidence
- Implement without reading task requirements
- Ignore blocked task reporting
- Modify planning documents
- Large multi-task execution without using opsis-two-stage-review-execution

**Verification Mode authorized:**
- Read and analyze code
- Compare implementation against PRD
- Generate specific review comments
- Report issues with severity levels
- Enforce fix loops
- Run verification tests

**Verification Mode blocked:**
- Fix issues automatically
- Modify code without user direction
- Make evidence-less claims
- Skip re-verification after fixes
- File write/edit operations

### Rule: Follow Iron Laws

**Iron Law 1: No Completion Without Verification**
- Cannot claim task completion without providing fresh verification evidence
- Verification evidence must be specific to the completed task
- Must show test results, code analysis, or proof of functionality
- "I implemented it" is NOT verification evidence

**Iron Law 2: No Implementation Without Planning**
- Cannot generate code without approved PRD or task specification
- Must read and understand requirements before writing code
- Planning documents (PRD, tasks.md) are the source of truth
- "I'll just implement this" without planning is a violation

**Iron Law 3: No Skipping Fix Loops**
- Issues found during verification MUST be fixed
- After fixes, MUST re-verify before proceeding
- Cannot batch-fix multiple issues without re-verifying each
- Fix loop: Find → Fix → Verify → Repeat until pass

### Rule: Detect and correct mistakes

**When:** Detecting mistake

**Then:** Follow self-correction protocol

**Self-correction protocol:**
1. Identify violation from mistake type catalog
2. STOP the incorrect action immediately
3. Output standardized message:
```markdown
I apologize - I was [describe specific mistake]. This violates [Iron Law X / mode boundary]. Let me follow the correct protocol.
```
4. Return to appropriate workflow step with correct mode

### Rule: Follow mode transition requirements

**When:** Transitioning between modes

**Then:** Verify transition requirements met

**Valid transitions:**
- Initial → Planning: Always allowed (start workflow)
- Planning → Implementation: Requires complete PRD
- Implementation → Verification: Requires all tasks marked with evidence
- Verification → Implementation: Required for fixes (must re-verify)
- Verification → Complete: Only if all verification passes

**Invalid transitions:**
- Initial → Implementation: Violates Iron Law 2
- Planning → Verification: No implementation to verify
- Implementation → Complete: Violates Iron Law 1

### Rule: Use progress reporting formats

**When:** Marking tasks complete or verifying

**Then:** Use standard reporting formats

**Implementation progress report:**
```markdown
✅ Task Complete: "{task title}"
   Task ID: {task-id}

Progress: [completed]/[total] tasks ([percentage]%)

📋 Completed:
- [x] {completed task 1}
- [x] {completed task 2}

⏳ Next: "{next task title}"
   Task ID: {next-task-id}
```

**Verification report:**
```markdown
# Verification Report: [Phase Name / Feature]

**Spec**: `tasks.md` (Phase X) | **Status**: [Pass/Fail/Warnings]

## 🔍 Review Comments

| ID | Severity | Location | Issue |
|:--:|:--------:|:---------|:------|
| #1 | [CRIT|MAJOR|MINOR|OUTDATED] | `path/to/file` | **Issue Type**: Description |
```

## Process

1. Declare mode using standard format
2. Verify action is authorized for current mode
3. Follow Iron Laws for current mode
4. Enforce workflow discipline at all times
5. Use progress reporting formats
6. Detect and correct mistakes
7. Follow mode transition requirements

## Preconditions

Before using this skill, verify:

- Mode is declared using standard format
- Action is authorized for current mode
- Iron Laws are understood and followed
- Required prerequisites (PRD, evidence) exist

## Postconditions

After completing this skill, verify:

- Mode boundaries maintained
- Iron Laws respected
- Workflow discipline enforced
- Progress reports use standard formats

## Success Metrics

This skill is successful when:

- All actions authorized for current mode
- Iron Laws respected
- Mode transitions valid
- Progress reports use standard formats

## Common Situations

**Situation:** Planning mode violation

**Pattern:**
- When: Attempting to write code during planning
- Then: BLOCK action
- Response: "I cannot [action] during Planning Mode"

**Situation:** Implementation mode violation

**Pattern:**
- When: Attempting to mark complete without evidence
- Then: BLOCK action
- Response: "I cannot mark complete without verification evidence"

**Situation:** Verification mode violation

**Pattern:**
- When: Attempting to fix issues during verification
- Then: BLOCK action
- Response: "I cannot fix issues during Verification Mode"
