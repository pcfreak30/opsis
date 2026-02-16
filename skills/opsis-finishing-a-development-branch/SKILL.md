---
name: opsis-finishing-a-development-branch
description: Use when implementation is complete, all tests pass, and you need to decide how to integrate the work - guides completion of development work by presenting structured options for merge, PR, or cleanup
---

# Finishing a Development Branch

## Overview

Guide completion of development work by presenting clear options and handling chosen workflow.

**Core principle:** Verify tests → Present options → Execute choice → Clean up.

**Announce at start:** "I'm using the opsis-finishing-a-development-branch skill to complete this work."

## The Process

### Step 1: Verify Tests

**Before presenting options, verify tests pass:**

```bash
# Run project's test suite
npm test / cargo test / pytest / go test ./...
```

**If tests fail:**
```
Tests failing (<N> failures). Must fix before completing:

[Show failures]

Cannot proceed with merge/PR until tests pass.
```

Stop. Don't proceed to Step 2.

**If tests pass:** Continue to Step 2.

### Step 2: Determine Base Branch

```bash
# Try common base branches
git merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null
```

Or ask: "This branch split from main - is that correct?"

### Step 3: Present Options

Present exactly these 4 options:

```
Implementation complete. What would you like to do?

1. Merge back to <base-branch> locally
2. Push to remote (no PR)
3. Keep the branch as-is (I'll handle it later)
4. Discard this work

Which option?
```

**Don't add explanation** - keep options concise.

### Step 4: Execute Choice

#### Option 1: Merge Locally

**Manual merge:**
```bash
# Switch to base branch
git checkout <base-branch>

# Pull latest
git pull

# Merge feature branch
git merge <feature-branch>

# Verify tests on merged result
<test command>

# If tests pass
git branch -d <feature-branch>
```

**Alternative using git town (if configured):**

Step 1: Compress commits
```bash
git town compress
```

Step 2: Generate commit message
- Invoke **opsis-commit-message** skill to analyze the compressed commit
- The skill will run its diff script and generate a conventional commit message
- Copy the generated message

Step 3: Apply the message
```bash
git commit --amend -m "<paste generated message>"
```

Step 4: Sync and propose (non-interactive)
```bash
# Extract commit message to avoid interactivity
TITLE=$(git log -1 --format=%s)
BODY=$(git log -1 --format=%b)

git town sync
git town propose -t "$TITLE" -b "$BODY"
```

Note: This creates a PR instead of merging locally. If you need a local merge, use the manual merge approach above.

Then: Cleanup worktree (Step 5)

#### Option 2: Push to Remote (No PR)

**Push only:**
```bash
git push -u origin <feature-branch>
```

Then ask: "Would you like to create a Pull Request for this branch?"

**If yes and using git town (if configured):**

Step 1: Compress commits
```bash
git town compress
```

Step 2: Generate commit message
- Invoke **opsis-commit-message** skill to analyze the compressed commit
- The skill will run its diff script and generate a conventional commit message
- Copy the generated message

Step 3: Apply the message
```bash
git commit --amend -m "<paste generated message>"
```

Step 4: Sync and propose (non-interactive)
```bash
# Extract commit message to avoid interactivity
TITLE=$(git log -1 --format=%s)
BODY=$(git log -1 --format=%b)

git town sync
git town propose -t "$TITLE" -b "$BODY"
```

Then: Cleanup worktree (Step 5)

**If yes and NOT using git town:**
```bash
gh pr create --title "<title>" --body "$(cat <<'EOF'
## Summary
<2-3 bullets of what changed>

## Test Plan
- [ ] <verification steps>
EOF
)"
```

Then: Cleanup worktree (Step 5)

If no to PR: Keep worktree (same as Option 3)

#### Option 3: Keep As-Is

Report: "Keeping branch <name>. Worktree preserved at <path>."

**Don't cleanup worktree.**

#### Option 4: Discard

**Confirm first:**
```
This will permanently delete:
- Branch <name>
- All commits: <commit-list>
- Worktree at <path>

Type 'discard' to confirm.
```

Wait for exact confirmation.

If confirmed:
```bash
git checkout <base-branch>
git branch -D <feature-branch>
```

Then: Cleanup worktree (Step 5)

### Step 5: Cleanup Worktree

**For Options 1, 2, 4:**

Check if in worktree:
```bash
git worktree list | grep $(git branch --show-current)
```

If yes:
```bash
git worktree remove <worktree-path>
```

**For Option 3:** Keep worktree.

## Quick Reference

| Option | Merge | Push | Keep Worktree | Cleanup Branch |
|--------|-------|------|---------------|----------------|
| 1. Merge locally | ✓ | - | - | ✓ |
| 2. Push to remote | - | ✓ | ✓ | - (unless PR created) |
| 3. Keep as-is | - | - | ✓ | - |
| 4. Discard | - | - | - | ✓ (force) |

## Common Mistakes

**Skipping test verification**
- **Problem:** Merge broken code, create failing PR
- **Fix:** Always verify tests before offering options

**Open-ended questions**
- **Problem:** "What should I do next?" → ambiguous
- **Fix:** Present exactly 4 structured options

**Automatic worktree cleanup**
- **Problem:** Remove worktree when might need it (Option 2, 3)
- **Fix:** Only cleanup for Options 1 and 4. For Option 2, only cleanup if PR was created.

**Assuming git town is always available**
- **Problem:** Use git town commands without checking if configured
- **Fix:** Always check `command -v git-town && git town config` before using, fall back to manual commands

**No confirmation for discard**
- **Problem:** Accidentally delete work
- **Fix:** Require typed "discard" confirmation

## Red Flags

**Never:**
- Proceed with failing tests
- Merge without verifying tests on result
- Delete work without confirmation
- Force-push without explicit request

**Always:**
- Verify tests before offering options
- Present exactly 4 options
- Get typed confirmation for Option 4
- Clean up worktree for Options 1 & 4 only

## Integration

**Called by:**
- **opsis-two-stage-review-execution** (Step 7) - After all tasks complete
- **opsis-executing-plans** (Step 5) - After all batches complete

**Pairs with:**
- **opsis-using-git-worktrees** - Cleans up worktree created by that skill (when using manual worktrees)

## Git Town Integration

Git Town provides streamlined branch management workflows. When available and configured, this skill uses:

| Command | Purpose | When Used |
|---------|---------|-----------|
| `git town compress` | Squash all commits to single commit with message | Before propose |
| `git town sync` | Sync branch with parent (rebase + push) | Before propose |
| `git town propose` | Create PR using commit message | Option 2 (push to remote) |

**Availability Check:**
```bash
if command -v git-town &> /dev/null && git town config &> /dev/null; then
    # git town is available and configured
else
    # Fall back to manual git commands
fi
```

**Workflow Pattern:**
```bash
# Squash development commits (uses first commit message by default)
git town compress

# Generate commit message using opsis-commit-message skill
# Then apply it:
git commit --amend -m "<generated message>"

# Sync with parent branch (rebase + push)
git town sync

# Create PR (uses commit message)
git town propose
```

**Benefits:**
- Commit message becomes PR content (no templates needed)
- Single command to squash, sync, and propose
- Handles parent-child branch relationships automatically
- Reduces manual git command complexity

**When to prefer manual commands:**
- git town not installed or configured
- Non-standard branch hierarchies
- Custom merge requirements
