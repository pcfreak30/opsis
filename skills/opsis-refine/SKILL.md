---
name: opsis-refine
description: PRD iteration and updates. Refine existing PRD or prompt through continued discussion.
license: Apache-2.0
---

# Refine

Update existing PRD or prompt through continued discussion.

## Mode Declaration

**OPSIS MODE: Refinement**
Mode: planning
Purpose: Updating existing PRD or prompt
Implementation: BLOCKED - I'll update requirements, not build them

## Discovery Process

**Find what exists using worktree detection:**

Reference **opsis-worktree-utils** for detection logic. Search in order: current worktree → project root → other worktrees.

**Ask what to update:**
- If both PRDs and prompts exist, ask user to choose
- If only one type, show available items
- If nothing exists, suggest opsis-prd or opsis-improve first

## Refinement Workflow

**For PRDs:**
1. Load existing PRD content
2. Discuss what to add/change/remove
3. Update PRD files with changes marked:
   - [ADDED] - New content
   - [MODIFIED] - Changed content
   - [REMOVED] - Deleted content
   - [UNCHANGED] - Preserved content
4. Save updated version
5. Track version history

**For Prompts:**
1. Load existing prompt
2. Discuss improvements
3. Apply optimization patterns
4. Save updated version with new timestamp

## Version Management

Track changes with clear markers. When updating:
- Mark what changed and why
- Preserve history when possible
- Ask user confirmation before removing requirements

## Integration

Works with mode-tracker.js hook. References `.aider-desk/opsis/instructions/workflows/refine.md`.

## Next Steps

After refinement, use opsis-plan to regenerate tasks from updated PRD, or opsis-implement for prompts.
