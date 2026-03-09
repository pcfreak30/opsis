---
name: opsis-compact-recovery
description: "Compact recovery for Opsis workflows. Use when conversation was compacted, context was lost, or user reports missing workflow state. Detects opsis artifacts, restores mode, reactivates skills."
license: Apache-2.0
---

# Compact Recovery

Restore Opsis workflow state after conversation compacts or context loss.

## When to Use

Use this skill when:

- Conversation history appears truncated or starts abruptly
- User reports "compact", "context lost", or "missing state"
- User says "continue", "resume", "reload", "recover", or similar continuation commands
- User says "reload opsis protocol" or "reload the opsis protocol"
- Opsis artifacts exist but agent doesn't know current position
- You have partial skill memory but are unsure about full state
- Short prompts without clear context (suspicious of compact)

Do not use when:

- Conversation history is complete
- No opsis artifacts exist
- User has clear context and knows current position

## Rules

### Rule: Conservative recovery first

**When:** In doubt about state

**Then:** Activate opsis-compact-recovery

**Rationale:** Better to recover unnecessarily than operate with wrong state

### Rule: Never proceed without state

**When:** Unsure about mode, TODO list exists but no project context, partial skill memory

**Then:** Run recovery first

**Never:** Proceed with using-opsis workflow without established state

### Rule: Explicit recovery request

**When:** User mentions "recover" or "reload opsis protocol"

**Then:** Call opsis-compact-recovery (not using-opsis)

**Reason:** User is signaling recovery need

### Rule: Short prompt indicates compact

**When:** Prompt < 30 characters without context

**Then:** Treat as potential compact

**Default:** Defensive - assume compact

### Rule: Delegate research to subagent

**When:** Needing to scan artifacts, determine state, or reinject project context

**Then:** Delegate to power-agent subagent for research

**Why:** Prevents bloating orchestrator context with project analysis

**Delegation pattern:**
- Use subagents---run_task with power-agent
- Provide clear research objective
- Subagent returns structured state report
- Orchestrator uses report for recovery decisions

**Research scope:**
- Scan for opsis artifacts
- Determine current mode from artifacts
- Identify active project
- Extract task progress
- Return structured recovery data

## Mode: Recovery

**In this mode:**

- Can: analyze_artifacts, restore_state, load_context, recover_todo_list
- Cannot: implement_features, modify_code, execute_tasks
- Must: verify_recovery_complete, establish_mode
- Must not: proceed_without_confirmation

**Transition to:** using-opsis
**When:** Recovery complete

## Process

1. **Detect compact indicators:**

   - Conversation history appears truncated (sudden start, no context)
   - User mentions: compact, reload, missing context, lost state
   - Opsis artifacts exist with incomplete work

2. **Delegate research to subagent:**

   **CRITICAL: Do not scan artifacts directly in orchestrator**
   - Use subagents---run_task with power-agent
   - Research objective: "Scan opsis artifacts and determine current workflow state"
   - Subagent returns structured report with:
     - Active project name
     - Current mode (Implementation/Planning/Verification/Complete)
     - Task progress (completed/total, percentage)
     - Next task or action
     - Artifact locations

3. **Process research results:**

   Use subagent's structured report to:
   - Determine current mode
   - Identify next action
   - Prepare recovery message

4. **Recover TODO list:**

   Use `todo---set_items` to create TODO from subagent's task progress data

5. **Inform user:**

   Display standard recovery message with data from subagent:
   - Project name
   - Mode (Implementation/Planning/Verification)
   - Progress (completed/total tasks, percentage)
   - Next task or action
   - Brief description of current position

6. **Continue workflow:**

   After recovery complete, continue with using-opsis workflow

## Preconditions

Before using this skill, verify:

- Conversation history appears truncated or user reported compact
- Opsis artifacts may exist
- User reports missing context or state

If any condition fails:

- Do not run recovery
- Proceed with normal workflow

## Postconditions

After completing this skill, verify:

- using-opsis is re-activated
- Mode is declared correctly
- TODO list is restored (if applicable)
- Current position is clear
- Next action is specified
- User confirms recovery is correct

## Success Metrics

- Recovery detects correct mode
- TODO list restored from tasks.md
- User confirms recovery is accurate
- Workflow continues seamlessly

## Common Situations

**Situation:** User reports compact, single active project

**Pattern:**
- Delegate artifact research to power-agent
- Receive structured state report
- Determine mode from report
- Restore TODO list from report data
- Display recovery message
- Continue workflow

**Situation:** User requests protocol reload

**Pattern:**
- Acknowledge request
- Delegate context research to power-agent
- If projects found → Run compact recovery with research data
- If no projects → Confirm reload only

**Situation:** Multiple active projects

**Pattern:**
- List all projects with modification timestamps
- Ask user which to recover
- Recover selected project only

**Situation:** Corrupted artifacts

**Pattern:**
- Detect malformed PRD or tasks.md
- Inform user: "Recovery incomplete - artifacts corrupted"
- Suggest manual intervention or starting fresh

**Situation:** No artifacts found

**Pattern:**
- If user reported compact but no artifacts exist
- Inform user: "No opsis artifacts found - cannot restore state"
- Ask if they want to start fresh or provide context

**Situation:** Mode ambiguity

**Pattern:**
- If artifacts suggest multiple possible modes
- Ask user to confirm correct mode
- Default to Implementation Mode if tasks exist with unchecked items

## Integration

Works with:

- **using-opsis** - Meta-skill that defines recovery protocol
- **opsis-mode-enforcer** - Automatic compact detection before mode declaration
- **TODO tools** - Restore task tracking after recovery

**Activation order:**

1. opsis-compact-recovery (if compact detected)
2. using-opsis (always after recovery)
3. opsis-mode-enforcer (mode declaration)
4. Other opsis skills (based on restored state)

## Best Practices

1. Be explicit - Always declare recovery mode before taking action
2. Confirm with user - Don't assume recovery is correct, ask for confirmation
3. Keep messages clear - User should understand exactly what was restored
4. Preserve continuity - Recovery should feel seamless, not like starting over
5. Handle errors gracefully - If recovery fails, explain why and offer alternatives

## Related Skills

- **using-opsis** - Meta-skill establishing workflow rules and recovery protocol
- **opsis-mode-enforcer** - Automatic compact detection and mode enforcement
- **opsis-implement** - Continue implementation after recovery
- **opsis-verify** - Verify implementation after recovery
