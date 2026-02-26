---
name: opsis-prd
description: Requirements discovery through strategic questioning. Ask one question at a time, validate answers, generate full PRD and quick PRD in .aider-desk/opsis/outputs/{prd-name}/
license: Apache-2.0
---

# Product Requirements Document

Requirements discovery through strategic questioning to create comprehensive PRDs.

## When to Use

**Invoke opsis-prd when:**
- Starting a new feature or project that needs clear requirements
- Requirements are vague and need refinement through dialogue
- A comprehensive Product Requirements Document is needed
- Planning phase of development workflow

**Note:** This is a Planning Mode skill. It does not generate implementation code.

## Mode Declaration

Reference **opsis-mode-enforcer** for complete mode declaration format and enforcement.

**OPSIS MODE: Planning**
Mode: planning
Purpose: Guiding strategic questions to create comprehensive PRD documents
Implementation: BLOCKED - I will develop requirements, not implement the feature

## Activation Logging

When this skill is activated, log:

```
ACTIVATED: opsis-prd
Purpose: Creating Product Requirements Document for [feature/project]
Expected outputs: full-prd.md, quick-prd.md
```

## Preconditions

Before invoking this skill:
1. A feature or project idea has been identified (even if vague)
2. Requirements gathering is needed before implementation
3. No complete PRD exists for this feature/project
4. Planning Mode is appropriate (not implementation or verification)

## Postconditions

After completing this skill:
1. A full PRD document is saved to `{SAVE_BASE}/{prd-name}/full-prd.md`
2. A quick PRD document is saved to `{SAVE_BASE}/{prd-name}/quick-prd.md`
3. Actual file paths are displayed to the user
4. User is directed to next steps (opsis-plan)

## Success Metrics

This skill is successful when:
- All strategic questions (Q1-Q6) are asked and answered
- Validation gates pass (problem+goal stated, 2+ features, 1+ scope exclusion)
- Both full-prd.md and quick-prd.md are created and verified
- Documents follow the standard output structure
- User confirms satisfaction with the PRD

## Pre-Flight: Delegation Assessment

Reference **opsis-coordinator** for complete delegation decision framework.

**Before starting requirements gathering, assess delegation requirements:**

**DELEGATE to appropriate subagent if:**
- Analyzing existing codebase for requirements discovery
- Scanning project structure to understand context
- Reading multiple files to gather technical details
- Identifying patterns or architecture before PRD creation
- Complex file pattern matching for context gathering

**EXECUTE DIRECTLY if:**
- Pure conversational requirements gathering (no codebase access)
- User provides all technical context upfront
- Simple, well-defined feature with clear requirements
- New project with no existing codebase to analyze

**If delegation is required:**
1. Log: "Using subagent for codebase analysis and requirements discovery"
2. Invoke `subagents---run_task` with clear task description and context
3. Review analysis results
4. Incorporate technical context into strategic questions
5. Continue with Strategic Questions step

## Strategic Questions (One at a Time)

Ask these questions one at a time, validating each answer before proceeding.

### Q1: What are we building and why?

**Ask:** "What are we building and why?"

**Validation Requirements:**
- Must have both problem AND goal
- 2-3 sentences minimum

**If vague, probe for:**
- Specific pain points
- Target users
- Decisions supported by this feature

**Example good answer:**
- "Users can't reset their passwords without contacting support (problem). We need a self-service password reset flow to reduce support tickets (goal)."

### Q2: Must-have core features?

**Ask:** "What are the must-have core features?"

**Validation Requirements:**
- At least 2 concrete features
- 3-5 critical features recommended

**If vague, ask:**
- What will users do first?
- What provides core value?

**If too many, help prioritize:**
- Launch blockers vs nice-to-have
- MVP features vs future enhancements

### Q3: Tech stack and requirements?

**Ask:** "What tech stack and requirements do we have?"

**Validation Requirements:**
- Technologies, integrations, constraints
- Optional if extending existing project

**If existing project, ask about:**
- Existing integrations
- Performance requirements
- Team preferences
- Architectural constraints

### Q4: Architecture and design choices?

**Ask:** "Are there specific architecture or design choices?"

**Validation Requirements:**
- Optional question

**Topics to explore:**
- Folder structure preferences
- Design patterns
- Architectural style (monolith vs microservices)
- Data modeling preferences

### Q5: Explicitly OUT of scope?

**Ask:** "What is explicitly OUT of scope?"

**Validation Requirements:**
- At least 1 explicit exclusion
- Prevents scope creep
- Clarifies boundaries

**If none, suggest:**
- "What won't we build in this phase to keep scope manageable?"

### Q6: Additional context?

**Ask:** "Is there any additional context I should know?"

**Validation Requirements:**
- Optional question

**Topics to explore:**
- Compliance requirements
- Accessibility needs
- Localization requirements
- Deadlines or time constraints
- Team size or skill constraints
- Budget constraints

## Validation Gates

Before document generation, verify all gates pass:

**Gate 1 (Q1):** Both problem AND goal stated
**Gate 2 (Q2):** At least 2 concrete features
**Gate 3 (Q5):** At least 1 explicit scope exclusion

**If any gate fails:**
- Return to the relevant question
- Guide user to provide missing information
- Re-validate before proceeding

## File-Saving Protocol

Reference **opsis-worktree-utils** for worktree detection and save location logic.

**Save files:**
1. Determine project name (sanitize: lowercase, spaces→hyphens)
2. Create directory: `mkdir -p {SAVE_BASE}/{prd-name}`
3. Save full PRD to: `{SAVE_BASE}/{prd-name}/full-prd.md`
4. Save quick PRD to: `{SAVE_BASE}/{prd-name}/quick-prd.md`
5. Verify both files with Read tool
6. Display actual file paths

**Detection logic (from opsis-worktree-utils):**
```bash
# Worktree detection
WORKTREE_PATH=""; PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")
[[ "$PWD" == */.aider-desk/task/*/worktree/* ]] && {
    WORKTREE_PATH="$PWD"
    PROJECT_ROOT=$(echo "$PWD" | sed 's|/\.aider-desk/task/.*||')
}

# Save location preference
if [ -n "$WORKTREE_PATH" ] && [ -d "$WORKTREE_PATH/.aider-desk" ]; then
    SAVE_BASE="$WORKTREE_PATH/.aider-desk/opsis/outputs"
else
    SAVE_BASE="$PROJECT_ROOT/.aider-desk/opsis/outputs"
fi
```

## Output Structure

### Full PRD Format

```markdown
# Product Requirements Document: {Project Name}

## Problem & Goal
{Q1 answer - problem and goal, 2-3 sentences}

## Requirements

### Must-Have Features
{Q2 answer expanded - list of 3-5 critical features with brief descriptions}

### Technical Requirements
{Q3 answer detailed - technologies, integrations, constraints}

### Architecture & Design
{Q4 answer if provided - folder structure, design patterns, architectural style}

## Out of Scope
{Q5 answer - explicit exclusions with rationale}

## Additional Context
{Q6 answer if provided - compliance, accessibility, deadlines, team constraints}
```

### Quick PRD Format

2-3 paragraphs, AI-optimized summary of the full PRD for quick reference.

## Integration

This skill is part of the Opsis planning workflow:

**Workflow Order:**
1. **opsis-start** - Conversational exploration for vague ideas (optional)
2. **opsis-prd** - Requirements discovery through strategic questioning (this skill)
3. **opsis-plan** - Task breakdown from PRD
4. **opsis-implement** - Execute tasks from implementation plan
5. **opsis-verify** - Verify implementation against PRD

**Related Skills:**
- **opsis-coordinator** - Delegation decision framework (pre-flight assessment)
- **opsis-mode-enforcer** - Mode declaration and enforcement
- **opsis-worktree-utils** - Worktree detection and file protocol
- **opsis-summarize** - Conversation analysis and mini-PRD extraction
- **opsis-refine** - PRD iteration and updates

**References:**
- **using-opsis** - Complete workflow rules, Iron Laws, and skill invocation order (always load first)

## Next Steps

After PRD generation, use **opsis-plan** to generate task breakdown from the PRD:

```
Use opsis-plan to create a detailed task breakdown from this PRD.
```

The opsis-plan skill will analyze the codebase, map requirements to specific files, and generate tasks.md with technical implementation details.
