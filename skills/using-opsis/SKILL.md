---
name: using-opsis
description: "Meta-skill establishing workflow rules, Iron Laws, and skill invocation order for the Opsis system. Load first before any Opsis action."
license: Apache-2.0
---

# Using Opsis

Meta-skill establishing workflow rules, Iron Laws, and skill invocation order. Does not prompt for input or initiate conversations.

## When to Use

Use this skill when:

- Starting any Opsis workflow
- Determining which skill to invoke
- Checking for applicable skills before action

Do not use when:

- State is uncertain (compact recovery needed)

## Rules

### Rule: Establish workflow, don't prompt

**When:** using-opsis is activated

**Then:** Establish workflow rules only

**Never:** Ask for clarification or prompt for input

**Behavior:**
- Announce workflow rules are established
- Be ready for user requests
- Do not initiate conversations
- Wait for user to specify what they want

### Rule: Check state uncertainty

**When:** Unsure about state

**Then:** Activate opsis-compact-recovery

**State uncertainty indicators:**
- Truncated conversation
- Partial memory
- Unclear context

**Using-opsis cannot safely operate without established state.**

### Rule: Locate state files before access

**When:** Need to access tasks.md, full-prd.md, or other Opsis state files

**Then:** MUST invoke opsis-worktree-utils first

**Never:** Read state files without worktree detection

**Process:**
1. Stop if worktree state unknown
2. Invoke opsis-worktree-utils
3. Get resolved paths for state files
4. Only then proceed with file operations

### Rule: Detect verification requests

**When:** User asks for verification

**Then:** Invoke opsis-verify

**Verification request indicators:**
- User says "verify", "check", "review", "audit"
- User asks to verify implementation
- User asks to check compliance
- User wants to review code

**When verification detected:**
- Invoke opsis-verify
- Do NOT invoke opsis-start

### Rule: Follow activation sequence

**When:** Activating using-opsis

**Then:** Complete activation sequence

**Activation sequence:**
1. Check for compact recovery indicators
   - If indicators detected: Activate opsis-compact-recovery
   - If no indicators: Continue to step 2
2. Check for verification request
   - If verification detected: Invoke opsis-verify
   - If no verification request: Continue to step 3
3. Check for in-progress work: todo---get_items
4. If continuing work:
   - Locate state files: Invoke opsis-worktree-utils to find tasks.md and PRD paths
   - Read tasks.md to understand current position
   - Invoke opsis-implement (handles routing)
5. If no in-progress work:
   - Invoke opsis-start
   - Follow opsis-start exactly (start conversational discovery)
   - opsis-start will actively engage the user

**CRITICAL: After activation, DO NOT:**
- Start implementing directly without invoking implementation skill
- Read files or use power tools for implementation without invoking opsis-implement

**You MUST:**
- Invoke appropriate skill (opsis-implement, opsis-start, opsis-prd, etc.)
- Follow invoked skill's instructions exactly

### Rule: Apply fail-safe auto-correction

**When:** Protocol violation detected

**Then:** Apply auto-correction protocol

**Detection triggers:**
- Direct execution without Decision Point Gate
- Wrong workflow for task context
- Skipping todo check

**Auto-correction protocol:**
1. STOP immediately
2. Complete the missing step
3. Invoke the correct skill
4. Inform the user

### Rule: Follow Iron Laws

**When:** Any action

**Then:** Follow Iron Laws

**Iron Law 1: No Completion Without Verification**
```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

**Iron Law 2: No Implementation Without Planning**
```
NO CODE CHANGES WITHOUT A PLAN OR TASK SPECIFICATION
```

**Iron Law 3: No Skipping Fix Loops**
```
ISSUES FOUND = ISSUES FIXED + RE-VERIFIED
```

### Rule: Follow mode transitions

**When:** Transitioning between skills

**Then:** Verify transition is valid

**Valid transitions:**
- Initial → Planning: Always allowed
- Planning → Implementation: Requires complete PRD
- Implementation → Verification: Requires all tasks marked with evidence
- Verification → Implementation: Required for fixes (must re-verify)
- Verification → Complete: Only if all verification passes

**Invalid transitions:**
- Initial → Implementation: Violates Iron Law 2
- Planning → Verification: No implementation to verify
- Implementation → Complete: Violates Iron Law 1

### Rule: Use skill priority order

**When:** Multiple skills could apply

**Then:** Use priority order

**Priority order:**
1. Exploration skills first (opsis-start) - for vague ideas
2. Planning skills second (opsis-prd, opsis-plan) - for structuring requirements
3. Implementation skills third (opsis-implement, opsis-two-stage-review-execution, opsis-dispatching-parallel-agents) - for executing tasks
4. Verification skills always (opsis-verify) - NEVER skip after implementation

### Rule: Follow required skill chains

**When:** Executing workflows

**Then:** Complete required chains

**Planning → Implementation Chain:**
```
opsis-prd
    ↓ REQUIRED
opsis-plan
    ↓ REQUIRED
opsis-implement
    ↓ REQUIRED
opsis-verify
```

**Implementation → Verification Chain:**
```
opsis-implement (each task)
    ↓ REQUIRED (after ALL tasks complete)
opsis-verify
    ├── Issues found → Fix → Re-run opsis-verify
    └── All pass → Done / opsis-archive
```

### Rule: Apply verification gate pattern

**When:** Claiming any status

**Then:** Follow verification gate

**Verification gate:**
1. IDENTIFY: What command proves this claim?
2. RUN: Execute the FULL command (fresh, complete)
3. READ: Full output, check exit code, count failures
4. VERIFY: Does output confirm the claim?
5. ONLY THEN: Make the completion claim

### Rule: Follow agent coordination

**When:** Delegating tasks

**Then:** Use correct tool

**Tool selection:**
- `subagents---run_task`: Research, analysis, decisions
- `tasks---create_task`: Execute work, coordination

**Rule of thumb:** Use subagents for research and decisions. Use subtasks for executing work.

## Process

1. Check for compact recovery indicators (highest priority)
2. If indicators detected: Activate opsis-compact-recovery
3. If no indicators: Check for verification request
4. If verification detected: Invoke opsis-verify
5. If no verification request: Check for in-progress work: todo---get_items
6. If continuing work:
   - Locate state files: Invoke opsis-worktree-utils
   - Read tasks.md to understand current position
   - Invoke opsis-implement
7. If no in-progress work:
   - Invoke opsis-start
   - Follow opsis-start exactly (start conversational discovery)
   - opsis-start will actively engage the user

## Preconditions

Before using this skill, verify:

- State is not uncertain (compact recovery not needed)
- Workflow routing is handled by opsis-implement

## Postconditions

After completing this skill, verify:

- Appropriate skill invoked
- Fail-safe auto-correction applied if needed
- Iron Laws followed
- Mode transitions valid

## Success Metrics

This skill is successful when:

- Appropriate skill invoked before any action
- Fail-safe auto-correction detects and fixes violations
- Iron Laws respected
- Valid mode transitions only

## Common Situations

**Situation:** Direct execution without invoking implementation skill

**Pattern:**
- When: Attempting to implement directly
- Then: STOP, complete missing step, invoke correct skill

**Situation:** Wrong workflow

**Pattern:**
- When: Using wrong workflow for task context
- Then: opsis-implement handles routing automatically

**Situation:** Skipping todo check

**Pattern:**
- When: Not checking todo list after activation
- Then: Detect missing check, complete, invoke skill

**Situation:** State uncertainty

**Pattern:**
- When: Truncated conversation, partial memory
- Then: Activate opsis-compact-recovery before proceeding
