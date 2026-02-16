---
name: opsis-worktree-utils
description: Worktree detection and path resolution for Opsis protocol. Detects if in worktree, finds opsis state across worktrees and AD data directory.
license: Apache-2.0
---

# Opsis Worktree Utils

Utility functions for detecting worktrees and resolving opsis state locations.

## Worktree Structure

```
Project Root:              X/.aider-desk
Worktree (optional):       X/.aider-desk/task/{task-id}/worktree/.aider-desk
```

## Detection Logic

**Search order:**
1. **Current worktree** (if in worktree): `<worktree>/.aider-desk/opsis/outputs/`
2. **Project root**: `<project-root>/.aider-desk/opsis/outputs/`
3. **Other worktrees**: `<project-root>/.aider-desk/task/*/worktree/.aider-desk/opsis/outputs/`

**Save preference:**
- If in worktree and it has `.aider-desk`: use worktree's `.aider-desk`
- Otherwise: use project root's `.aider-desk`

## Detection Scripts

**Worktree detection:**
```bash
WORKTREE_PATH=""; PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD"); [[ "$PWD" == */.aider-desk/task/*/worktree/* ]] && { WORKTREE_PATH="$PWD"; PROJECT_ROOT=$(echo "$PWD" | sed 's|/\.aider-desk/task/.*||'); }
```

**Find artifacts across all locations:**
```bash
find "$WORKTREE_PATH/.aider-desk/opsis/outputs" "$PROJECT_ROOT/.aider-desk/opsis/outputs" "$PROJECT_ROOT/.aider-desk/task/*/worktree/.aider-desk/opsis/outputs" -type f \( -name "full-prd.md" -o -name "quick-prd.md" -o -name "tasks.md" \) 2>/dev/null | sort
```

**Determine save location:**
```bash
if [ -n "$WORKTREE_PATH" ] && [ -d "$WORKTREE_PATH/.aider-desk" ]; then SAVE_BASE="$WORKTREE_PATH/.aider-desk/opsis/outputs"; else SAVE_BASE="$PROJECT_ROOT/.aider-desk/opsis/outputs"; fi
```

## Usage in Skills

When any opsis skill needs to find or save PRDs/tasks:

1. Detect worktree context (check if CWD is in `.aider-desk/task/*/worktree/*`)
2. Search all locations in priority order
3. Use save preference (worktree's `.aider-desk` if available, else project root)

**Reference this skill** for implementation details - do not duplicate detection scripts in other skills.

## Integration

This utility should be referenced by:
- opsis-refine - Finding existing PRDs
- opsis-compact-recovery - Scanning for artifacts
- opsis-prd - Saving PRDs
- opsis-verify - Finding PRDs and tasks
- opsis-plan - Finding PRDs
- opsis-summarize - Saving outputs
- opsis-implement - Finding tasks
- opsis-archive - Listing PRDs

## See Also

- opsis-using-git-worktrees - Manual worktree management
- using-opsis - Meta-skill for workflow orchestration
