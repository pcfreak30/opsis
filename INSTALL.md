# Installation Guide

This guide covers installing opsis skills and hooks for AiderDesk.

## Prerequisites

- AiderDesk installed and configured
- Write access to `~/.aider-desk/skills/` and project directories

## Installation Steps

### Step 1: Install Skills

Copy all opsis skills to your AiderDesk skills directory:

```bash
# Copy skills
cp -r skills/* ~/.aider-desk/skills/

# Verify installation
ls ~/.aider-desk/skills/opsis-*
```

Expected output: All 28 opsis skills should be listed, including:
- using-opsis (meta-skill)
- opsis-start, opsis-prd, opsis-plan, opsis-implement
- opsis-verify, opsis-review
- opsis-archive
- And 21 additional skills for quality, workflows, and utilities

### Step 2: Install Hooks

Copy hooks to your project directory:

```bash
# Copy hooks
cp -r hooks/* ./

# Verify installation
ls hooks/
```

Expected output:
```
mode-tracker.js
session-tracker.js
skill-suggester.js
verification-gate.js
```

### Step 3: Create Directories

Create required directories for opsis outputs and logs:

```bash
# Create outputs directory for PRDs, tasks, and prompts
mkdir -p .aider-desk/opsis/outputs
mkdir -p .aider-desk/opsis/archive

# Create logs directory
mkdir -p logs/sessions
```

### Step 4: Configure Hooks (Optional)

Create `hooks/config.json` to customize hook behavior:

```json
{
  "skill-suggester": {
    "maxSuggestions": 3,
    "confidenceThreshold": 0.3,
    "autoLoadTopSkills": true
  },
  "mode-tracker": {
    "planningThreshold": 0.6,
    "implementationThreshold": 0.6,
    "maxViolations": 3
  },
  "verification-gate": {
    "completionThreshold": 0.75,
    "evidenceRequired": true
  },
  "session-tracker": {
    "enableLogging": true,
    "maxLogFileSize": 10485760,
    "maxLogFiles": 5
  }
}
```

## Verification

### Test Skill Loading

Start AiderDesk and verify skills are available:

```
Load skill: using-opsis
```

This should load the meta-skill successfully.

### Test Hook Functionality

The hooks will automatically trigger based on context during normal opsis workflows:

- **skill-suggester.js** - Suggests relevant skills based on task context
- **mode-tracker.js** - Tracks planning vs implementation modes
- **verification-gate.js** - Blocks completion claims without evidence
- **session-tracker.js** - Logs session activity

No manual testing required - hooks operate automatically.

## Troubleshooting

### Skills Not Appearing

**Problem:** opsis skills don't show in skill list

**Solution:**
1. Verify skills are in `~/.aider-desk/skills/`
2. Check YAML frontmatter is valid
3. Restart AiderDesk
4. Check file permissions

### Hooks Not Working

**Problem:** Hooks don't trigger expected behavior

**Solution:**
1. Verify hooks are in project `hooks/` directory
2. Check Node.js is installed (even though hooks use only built-in modules)
3. Review `logs/` directory for error messages
4. Test hooks individually with simple prompts

### Mode Enforcement Not Triggering

**Problem:** Mode violations not detected

**Solution:**
1. Verify `opsis-mode-enforcer` skill is loaded
2. Check `mode-tracker.js` hook is active
3. Ensure mode declaration format is correct
4. Review hook logs for detection errors

### Verification Gate Not Blocking

**Problem:** Completion claims not blocked without evidence

**Solution:**
1. Verify `verification-gate.js` hook is active
2. Check completion threshold in config
3. Review hook logs for detection events
4. Ensure completion phrases match detection patterns

## Uninstallation

### Remove Skills

```bash
# Remove opsis skills
rm -rf ~/.aider-desk/skills/opsis-*
```

### Remove Hooks

```bash
# Remove hooks
rm -rf hooks/
```

### Remove Logs

```bash
# Remove log files
rm -rf logs/
```

## Next Steps

After installation:

1. Review individual skill documentation in `skills/*/SKILL.md`
2. Review [ARCHITECTURE.md](ARCHITECTURE.md) for system design
3. Start with `opsis-mode-enforcer` to establish workflow discipline
4. Use `opsis-brainstorming` for creative ideation
5. Apply quality skills (`opsis-systematic-debugging`, `opsis-test-driven-development`) as needed

## Support

For issues or questions:

1. Check this installation guide
2. Review skill documentation in `skills/*/SKILL.md`
3. Examine hook logs in `logs/` directory
4. Verify YAML validation for all skill files
