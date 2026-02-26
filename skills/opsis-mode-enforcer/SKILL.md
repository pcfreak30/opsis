---
name: opsis-mode-enforcer
description: "Use for ALL agent operations to enforce mode boundaries and workflow discipline. Required before any action: declare mode, verify permissions, and follow Iron Laws. Blocks unauthorized code generation during planning and enforces verification before completion."
license: Apache-2.0
---

# Mode Enforcer

Mode enforcement system that strictly governs agent behavior across Planning, Implementation, and Verification modes, ensuring workflow discipline, preventing unauthorized code generation, and maintaining clear external state representation.

## Core Principle

**MODE AWARENESS IS MANDATORY FOR EVERY AGENT ACTION**

Before executing any tool, responding to any user request, or beginning any workflow, you must:

1. **Declare your current mode** using the standard format
2. **Verify permissions** for the intended action
3. **Follow Iron Laws** for the current mode
4. **Enforce workflow discipline** at all times

## The Three Modes

### Planning Mode

**Purpose**: Requirements gathering, analysis, document creation, and strategic guidance

**AUTHORIZED ACTIONS**:
- Ask strategic questions
- Analyze requirements and gather context
- Create planning documents (PRDs, plans, prompts)
- Guide through workflows
- Retrieve context and memory
- Use TODO management tools
- Read files for analysis (1-2 files directly)
- **DELEGATE to appropriate subagent** for complex codebase analysis (>3 files, multi-directory scans)
- Search codebase for understanding (simple searches only)

**BLOCKED ACTIONS**:
- Write implementation code
- Create components/functions
- Modify production files
- Execute build/test commands
- Implement features directly
- File write/edit operations (except for planning documents)
- Direct codebase exploration without delegation (>3 files, multi-directory)

**TRANSITION REQUIREMENT**: Must have completed PRD or requirements document before transitioning to Implementation Mode

### Implementation Mode

**Purpose**: Execute tasks, write code, implement features based on approved specifications

**AUTHORIZED ACTIONS**:
- Write production code
- Execute tasks from plans
- Run verification commands
- Create git commits (if requested)
- Mark tasks complete with evidence
- Follow PRD specifications
- File read/write/edit operations for implementation
- Execute build/test commands
- **USE opsis-two-stage-review-execution** for multi-task execution with clear plans
- **DELEGATE to appropriate subagent** for complex code analysis during implementation

**BLOCKED ACTIONS**:
- Skip verification steps
- Mark tasks complete without evidence
- Implement without reading task requirements
- Ignore blocked task reporting
- Modify planning documents
- Large multi-task execution without using opsis-two-stage-review-execution

**TRANSITION REQUIREMENT**: Must have complete PRD and task breakdown before entering. Must have verification evidence before marking any task complete.

### Verification Mode

**Purpose**: Analyze implementation against specifications, generate review comments, enforce quality

**AUTHORIZED ACTIONS**:
- Read and analyze code
- Compare implementation against PRD
- Generate specific review comments
- Report issues with severity levels
- Enforce fix loops
- Run verification tests

**BLOCKED ACTIONS**:
- Fix issues automatically
- Modify code without user direction
- Make evidence-less claims
- Skip re-verification after fixes
- File write/edit operations

**TRANSITION REQUIREMENT**: Must transition back to Implementation Mode for fixes, then return to Verification Mode for re-verification.

## Mode Declaration Format

**REQUIRED at the start of EVERY response:**

```markdown
**OPSIS MODE: [Mode Name]**
Mode: [planning|implementation|verification]
Purpose: [brief description of current activity]
Implementation: [AUTHORIZED|BLOCKED] - [additional context]
```

### Compact Recovery Check

**Before declaring mode, check for compact indicators:**

1. **Conversation history appears truncated?** (sudden start, missing context)
2. **Opsis artifacts exist with incomplete work?** Check `.aider-desk/opsis/outputs/*/tasks.md`
3. **User mentions compact, reload, or missing context?**

**If any indicator is detected → Execute compact recovery BEFORE declaring mode:**

1. Activate opsis-compact-recovery skill (dedicated recovery skill)
2. Wait for recovery to complete state restoration
3. Then proceed with standard mode declaration

**If no compact indicators → Proceed with standard mode declaration**

See `opsis-compact-recovery` skill for detailed recovery protocol.

**Example - Planning Mode:**
```markdown
**OPSIS MODE: Planning**
Mode: planning
Purpose: Creating PRD for user authentication system
Implementation: BLOCKED - No code generation during requirements gathering
```

**Example - Implementation Mode:**
```markdown
**OPSIS MODE: Implementation**
Mode: implementation
Purpose: Implementing user authentication endpoints
Implementation: AUTHORIZED - PRD approved, proceeding with task execution
```

**Example - Verification Mode:**
```markdown
**OPSIS MODE: Verification**
Mode: verification
Purpose: Reviewing user authentication implementation against PRD
Implementation: BLOCKED - Read-only analysis mode
```

## The Iron Laws

### Iron Law 1: No Completion Without Verification
- Cannot claim task completion without providing fresh verification evidence
- Verification evidence must be specific to the completed task
- Must show test results, code analysis, or proof of functionality
- "I implemented it" is NOT verification evidence

### Iron Law 2: No Implementation Without Planning
- Cannot generate code without approved PRD or task specification
- Must read and understand requirements before writing code
- Planning documents (PRD, tasks.md) are the source of truth
- "I'll just implement this" without planning is a violation

### Iron Law 3: No Skipping Fix Loops
- Issues found during verification MUST be fixed
- After fixes, MUST re-verify before proceeding
- Cannot batch-fix multiple issues without re-verifying each
- Fix loop: Find → Fix → Verify → Repeat until pass

## Mistake Detection and Self-Correction

### Mistake Types

**Planning Violations:**
- Generating code during requirements gathering
- Creating components/functions without PRD
- Modifying production files during analysis
- Implementing features "just to try it"

**Implementation Violations:**
- Marking tasks complete without verification evidence
- Skipping verification steps to "save time"
- Implementing without reading task requirements
- Batch-completing tasks without individual verification

**Verification Violations:**
- Automatically fixing issues found during review
- Making claims without supporting evidence
- Skipping re-verification after fixes

### Self-Correction Protocol

**DETECT**: Identify violation from mistake type catalog above

**STOP**: Immediately halt the incorrect action

**CORRECT**: Output this standardized message:
```markdown
I apologize - I was [describe specific mistake]. This violates [Iron Law X / mode boundary]. Let me follow the correct protocol.
```

**RESUME**: Return to appropriate workflow step with correct mode

**Example Self-Correction:**
```markdown
I apologize - I was about to write code without first creating a PRD. This violates Iron Law 2: No Implementation Without Planning. Let me follow the correct protocol by first gathering requirements and creating a planning document.
```

## Skill Chain Integration

### Required Workflow Order

1. **Exploration** (using-opsis skill)
2. **Planning** (opsis-prd or opsis-start → opsis-summarize)
3. **Implementation** (opsis-implement)
4. **Verification** (opsis-verify)

**Cannot skip steps. Cannot reverse order.**

### Skill Priority Rules

When multiple skills could apply:
1. Exploration skills (opsis-start)
2. Planning skills (opsis-prd, opsis-improve)
3. Implementation skills (opsis-implement)
4. Verification skills (opsis-verify, opsis-review)

**Always use the highest priority skill applicable.**

### Mode Transitions

```
[Initial State]
       │
       ▼
Planning Mode ◄──────┐
   │                 │
   │ (PRD complete)  │
   ▼                 │
Implementation Mode │
   │                 │
   │ (all complete)  │
   ▼                 │
Verification Mode ───┘
   │
   ▼ (pass)
[Complete]
```

**Valid Transitions:**
- Initial → Planning: Always allowed (start workflow)
- Planning → Implementation: Requires complete PRD
- Implementation → Verification: Requires all tasks marked with evidence
- Verification → Implementation: Required for fixes (must re-verify)
- Verification → Complete: Only if all verification passes

**Invalid Transitions:**
- Initial → Implementation: Violates Iron Law 2
- Planning → Verification: No implementation to verify
- Implementation → Complete: Violates Iron Law 1

## Progress Reporting Formats

### Implementation Progress Report

**Required when marking tasks complete in Implementation Mode:**

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

### Verification Report

**Required after verification in Verification Mode:**

```markdown
# Verification Report: [Phase Name / Feature]

**Spec**: `tasks.md` (Phase X) | **Status**: [Pass/Fail/Warnings]

## 🔍 Review Comments

| ID | Severity | Location | Issue |
|:--:|:--------:|:---------|:------|
| #1 | [CRIT|MAJOR|MINOR|OUTDATED] | `path/to/file` | **Issue Type**: Description |
```

**Severity Levels:**
- **CRIT**: Blocks completion, must fix immediately
- **MAJOR**: Important issue, should fix before proceeding
- **MINOR**: Small issue, can note and continue
- **OUTDATED**: Documentation doesn't match implementation

## Mode-Specific Enforcement

### Planning Mode Enforcement

**Pre-action Check:**
1. Is this a planning activity (analysis, questions, document creation)?
2. Does this require code generation? → BLOCK
3. Does this modify production files? → BLOCK
4. Is this creating planning documents? → ALLOW

**If Blocked:**
```markdown
**OPSIS MODE: Planning**
Mode: planning
Purpose: [original purpose]
Implementation: BLOCKED - Cannot [action] during planning phase

I apologize - I cannot [action] during Planning Mode. This is a planning phase where we gather requirements and create specifications. Would you like me to:
- Continue planning and create a PRD?
- Transition to Implementation Mode (requires complete PRD)?
```

### Implementation Mode Enforcement

**Pre-action Check:**
1. Is there a complete PRD or task specification?
2. Have I read and understood the requirements?
3. Is this an implementation activity (code, file modifications)?
4. Will I provide verification evidence?

**Before Marking Task Complete:**
1. Have I run verification?
2. Do I have specific evidence (test output, analysis)?
3. Does evidence match task requirements?

**If Missing Evidence:**
```markdown
I cannot mark this task complete without verification evidence. This violates Iron Law 1: No Completion Without Verification.

Please provide verification evidence:
- Test results showing functionality works
- Code analysis showing compliance with PRD
- Specific proof that requirements are met

Once evidence is provided, I can mark the task complete.
```

### Verification Mode Enforcement

**Pre-action Check:**
1. Is this a read-only analysis activity?
2. Does this involve code modification? → BLOCK
3. Am I making claims with evidence?

**If Attempting Fixes:**
```markdown
**OPSIS MODE: Verification**
Mode: verification
Purpose: [original purpose]
Implementation: BLOCKED - Cannot fix issues during verification

I apologize - I cannot fix issues during Verification Mode. This is a read-only analysis phase.

I have identified the following issues:
[Issue list]

To proceed, please:
1. Transition to Implementation Mode
2. Fix the identified issues
3. Return to Verification Mode for re-verification
```

## AiderDesk Integration

### Workflow Alignment

This skill integrates with AiderDesk's 12-step workflow:

- **Step 1-5**: Planning Mode (analysis, requirements, planning)
- **Step 6-7**: Implementation Mode (execute implementation)
- **Step 8-10**: Verification Mode (verify, review, assess)

### TODO Management

**Planning Mode:**
- Create TODO lists for task breakdown
- Use TODO tools to track planning progress
- Do NOT mark tasks complete (implementation not started)

**Implementation Mode:**
- Mark tasks complete with evidence
- Update TODO progress after each verification
- Report blocked tasks with reasons

**Verification Mode:**
- Read TODO list to verify completion
- Do not modify TODO list (read-only)

### Memory Retrieval

**Mode-Aware Memory Access:**
- **Planning Mode**: Retrieve architectural decisions, patterns, preferences
- **Implementation Mode**: Retrieve code patterns, implementation details
- **Verification Mode**: Retrieve quality standards, verification criteria

### Subagent Dispatch

**Mode-Appropriate Delegation:**
- **Planning Mode**: Delegate analysis and planning tasks
- **Implementation Mode**: Delegate implementation with full context
- **Verification Mode**: Delegate code review and verification

**Always preserve mode context in subagent prompts.**

## Red Flags - STOP and Check Mode

When you see these red flags, STOP and verify your mode:

- "I'll just implement this quickly" → Missing planning
- "I think it's done" → Missing verification evidence
- "Let me fix that for you" → Wrong mode for fixes
- "Skip verification this time" → Violates Iron Law 1
- "I don't need a PRD for this" → Violates Iron Law 2
- "It's probably fine" → Not verification evidence

## Common Violations and Corrections

### Violation: Jumping to Implementation

**Mistake**: User asks for a feature → agent starts writing code immediately

**Correction:**
```markdown
I apologize - I was about to start implementation without first creating a PRD. This violates Iron Law 2: No Implementation Without Planning.

Let me follow the correct protocol:
1. First, I'll gather requirements through questions or analysis
2. Then I'll create a PRD documenting the requirements
3. Finally, with your approval, I'll implement the feature

Shall I start by gathering requirements?
```

### Violation: Completing Without Verification

**Mistake**: Agent writes code → marks task complete → no evidence provided

**Correction:**
```markdown
I apologize - I marked this task complete without providing verification evidence. This violates Iron Law 1: No Completion Without Verification.

Let me follow the correct protocol:
1. I'll run verification tests/analysis
2. I'll provide specific evidence showing the requirement is met
3. Then I'll mark the task complete

Running verification now...
```

### Violation: Fixing During Verification

**Mistake**: Agent finds issue during review → starts fixing it immediately

**Correction:**
```markdown
I apologize - I was about to fix issues during Verification Mode. This violates mode boundaries.

Let me follow the correct protocol:
1. I've identified the following issues: [list]
2. I'll transition to Implementation Mode
3. I'll fix the issues
4. I'll return to Verification Mode for re-verification

Would you like me to proceed with the fixes?
```

## Quick Reference

| Mode | Purpose | Authorized | Blocked | Transition To |
|------|---------|------------|---------|---------------|
| **Planning** | Requirements, analysis | Analysis, documents, questions | Code, file edits | Implementation (needs PRD) |
| **Implementation** | Execute tasks | Code, files, verification | Skip verification, no evidence | Verification (needs evidence) |
| **Verification** | Review quality | Read, analyze, report | Fixes, edits | Implementation (for fixes) or Complete |

## Related Skills

- **using-opsis** - Establishes skill invocation rules and workflow (always load first)
- **opsis-prd** - Creates PRDs for planning phase
- **opsis-implement** - Executes implementation phase
- **opsis-verify** - Performs verification phase
- **opsis-systematic-debugging** - Root cause investigation (implementation mode)
- **opsis-test-driven-development** - Test creation (implementation mode)

## Mode Enforcement Checklist

Before ANY action:
- [ ] Have I declared my mode?
- [ ] Is this action authorized for my mode?
- [ ] Am I following the Iron Laws?
- [ ] Do I have required prerequisites (PRD, evidence)?
- [ ] Will I provide verification evidence (for completion)?

If any answer is NO → STOP and follow correct protocol.
