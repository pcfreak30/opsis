---
name: opsis-compact-recovery
description: Compact recovery for Opsis workflows. Use when conversation was compacted, context was lost, or user reports missing workflow state. Detects opsis artifacts, restores mode, reactivates skills.
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

## 🚨 Conservative Behavior Rules

**When in doubt about state, ALWAYS recover first:**

| Situation | Action | Rationale |
|-----------|--------|-----------|
| Unsure about mode | Activate opsis-compact-recovery | Better to recover unnecessarily than operate with wrong state |
| Partial skill memory | Ask user "Was there a compact? Should I recover?" | Conservative - don't assume state |
| "continue" with no context | Assume compact → recover first | Safer than guessing |
| Artifacts exist but no history | Run recovery to establish baseline | Artifacts prove previous work exists |
| User mentions "recover" | Call opsis-compact-recovery (not using-opsis) | User is signaling recovery need |
| Short prompt < 30 chars | Treat as potential compact | Defensive default |

**Critical Principle:**
> "When uncertain, recovery first. Using-opsis cannot safely operate without established state."

**Do NOT proceed with using-opsis workflow if:**
- You don't know the current mode
- TODO list exists but you don't know project context
- You remember some Opsis details but not the full skill set
- You're unsure about the next action

## Mode Declaration

**OPSIS MODE: Recovery**
Mode: recovery
Purpose: Restoring Opsis workflow state after compact
Implementation: BLOCKED - Read-only analysis and state restoration

## Recovery Process

### Phase 1: Detection

**Check for compact indicators:**

1. **Conversation history** appears truncated (sudden start, no context)
2. **User mentions**: compact, reload, missing context, lost state
3. **Opsis artifacts exist** with incomplete work

**Detection priority:**
- User explicit report → **Immediate recovery**
- Artifact scan detected → **Prompt for confirmation**
- No indicators → **No recovery needed**

### Phase 2: Artifact Scan

**Scan for opsis artifacts using worktree detection:**

Reference **opsis-worktree-utils** for detection logic. Search in order: current worktree → project root → other worktrees.

**For each project, determine state:**

| Artifact | Exists | Interpretation |
|----------|--------|----------------|
| `full-prd.md` | ✓ | Planning complete |
| `quick-prd.md` | ✓ | Requirements captured |
| `tasks.md` | ✓ | Task breakdown exists |
| `tasks.md` (unchecked items) | ✓ | Implementation in progress |
| `tasks.md` (all checked) | ✓ | Ready for verification |

**Identify active project** (most recently modified, or ask user if multiple)

### Phase 3: State Reconstruction

**Determine mode based on artifact state:**

**Implementation Mode:**
- `tasks.md` exists with unchecked items
- `full-prd.md` exists
- `quick-prd.md` exists

**Planning Mode:**
- `full-prd.md` incomplete or missing
- `tasks.md` missing or incomplete

**Verification Mode:**
- `tasks.md` exists with all items checked
- No archive record found

**Complete Mode:**
- All tasks checked
- Archive record exists
- No recovery needed

### Phase 4: Recovery Actions

**Execute in order:**

1. **Run worktree detection**: Reference opsis-worktree-utils to find artifact locations
2. **Load context**: Read PRD and tasks.md for active project
3. **Determine mode**:
   - Tasks incomplete + PRD exists → **Implementation Mode**
   - PRD incomplete → **Planning Mode**
   - Tasks complete but not archived → **Verification Mode**
4. **Recover TODO list**: Use `todo---set_items` to create TODO from tasks.md unchecked items
5. **Inform user** (display this message):
   ```
   **Compact Recovery Complete**

   Restored Opsis state:
   - Project: {project-name}
   - Mode: {Implementation|Planning|Verification}
   - Progress: {completed}/{total} tasks ({percentage}%)
   - Next: {next task or action}

   **Current Position:**
   {brief description of where we left off}

   **Ready to continue?**
   ```
6. **Then proceed**: After recovery complete, continue with using-opsis workflow

### Phase 5: User Notification

**Standard recovery message:**

```markdown
**Compact Recovery Complete**

Restored Opsis state:
- Project: {project-name}
- Mode: {Implementation|Planning|Verification}
- Progress: {completed}/{total} tasks ({percentage}%)
- Next: {next task or action}

**Current Position:**
{brief description of where we left off}

**Ready to continue?**
```

## Protocol Reload Handler

When user explicitly requests "reload opsis protocol" or "reload the opsis protocol":

1. **Acknowledge**: "Acknowledged. Reloading opsis protocol..."
2. **Run worktree detection**: Reference opsis-worktree-utils to find artifact locations
3. **Scan for context**:
   - If projects found → Run compact recovery (Phase 2-4)
   - If no projects → Confirm reload only: "Reloaded opsis protocol - using updated workflow rules"
4. **Declare mode**: Standard mode declaration for current activity

## Decision Tree

```
User message received
        │
        ├─→ Explicit "reload opsis protocol"?
        │   └─→ YES → Protocol Reload Handler
        │
        ├─→ Compact indicators detected?
        │   ├─→ YES → Artifact Scan
        │   │        ├─→ Active project found?
        │   │        │   ├─→ YES → State Reconstruction → Recovery Actions
        │   │        │   └─→ NO → No recovery needed
        │   │        └─→ Multiple projects?
        │   │            └─→ Ask user which to recover
        │   └─→ NO → No recovery needed
        │
        └─→ No compact indicators → Normal workflow
```

## Integration

**Works with:**
- **using-opsis** - Meta-skill that defines recovery protocol
- **opsis-mode-enforcer** - Automatic compact detection before mode declaration
- **TODO tools** - Restore task tracking after recovery

**Activation order:**
1. opsis-compact-recovery (if compact detected)
2. using-opsis (always after recovery)
3. opsis-mode-enforcer (mode declaration)
4. Other opsis skills (based on restored state)

## Recovery Verification

After recovery, verify:
- [ ] using-opsis is re-activated
- [ ] Mode is declared correctly
- [ ] TODO list is restored (if applicable)
- [ ] Current position is clear
- [ ] Next action is specified
- [ ] User confirms recovery is correct

## Edge Cases

**Multiple active projects:**
- List all projects with modification timestamps
- Ask user which to recover
- Recover selected project only

**Corrupted artifacts:**
- If PRD or tasks.md is malformed
- Inform user: "Recovery incomplete - artifacts corrupted"
- Suggest manual intervention or starting fresh

**No artifacts found:**
- If user reported compact but no artifacts exist
- Inform user: "No opsis artifacts found - cannot restore state"
- Ask if they want to start fresh or provide context

**Mode ambiguity:**
- If artifacts suggest multiple possible modes
- Ask user to confirm correct mode
- Default to Implementation Mode if tasks exist with unchecked items

## Example Scenarios

**Scenario 1: User reports compact, single active project**

```
User: "The conversation was compacted, I lost context"

Agent:
**OPSIS MODE: Recovery**
Mode: recovery
Purpose: Restoring Opsis workflow state after compact
Implementation: BLOCKED - Read-only analysis and state restoration

Scanning for opsis artifacts...
Found active project: user-authentication
- PRD: complete
- Tasks: 8/12 complete (67%)

Re-activating using-opsis...
Restoring TODO list from tasks.md...

**Compact Recovery Complete**

Restored Opsis state:
- Project: user-authentication
- Mode: Implementation
- Progress: 8/12 tasks (67%)
- Next: Implement password reset endpoint (Task #9)

**Current Position:**
We were implementing user authentication features. Completed 8 of 12 tasks including login, registration, and basic user management. Next task is password reset functionality.

**Ready to continue?**
```

**Scenario 2: User requests protocol reload**

```
User: "reload the opsis protocol"

Agent:
Acknowledged. Reloading opsis protocol...

Re-reading opsis skill files...
Re-activating using-opsis...

Scanning for active projects...
Found active project: api-migration
- PRD: complete
- Tasks: 15/20 complete (75%)

**Compact Recovery Complete**

Restored Opsis state:
- Project: api-migration
- Mode: Implementation
- Progress: 15/20 tasks (75%)
- Next: Migrate user endpoints (Task #16)

**Ready to continue?**
```

## Best Practices

1. **Be explicit** - Always declare recovery mode before taking action
2. **Confirm with user** - Don't assume recovery is correct, ask for confirmation
3. **Keep messages clear** - User should understand exactly what was restored
4. **Preserve continuity** - Recovery should feel seamless, not like starting over
5. **Handle errors gracefully** - If recovery fails, explain why and offer alternatives

## Related Skills

- **using-opsis** - Meta-skill establishing workflow rules and recovery protocol
- **opsis-mode-enforcer** - Automatic compact detection and mode enforcement
- **opsis-implement** - Continue implementation after recovery
- **opsis-verify** - Verify implementation after recovery

## Next Steps

After successful recovery:
- Implementation Mode → Resume task execution with opsis-implement
- Planning Mode → Resume requirements gathering with opsis-prd or opsis-start
- Verification Mode → Run opsis-verify to assess implementation
