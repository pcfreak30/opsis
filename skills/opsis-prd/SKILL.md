---
name: opsis-prd
description: "Requirements discovery through strategic questioning. Ask one question at a time, validate answers, generate full PRD and quick PRD in .aider-desk/opsis/outputs/{prd-name}/"
license: Apache-2.0
---

# Product Requirements Document

Requirements discovery through strategic questioning to create comprehensive PRDs.

## When to Use

Use this skill when:

- Starting a new feature or project that needs clear requirements
- Requirements are vague and need refinement through dialogue
- A comprehensive Product Requirements Document is needed
- Planning phase of development workflow

Do not use when:

- Requirements are already clear and documented
- User wants to start implementation immediately

## Rules

### Rule: Ask strategic questions one at a time

**When:** Gathering requirements

**Then:** Ask one question, validate answer, then proceed

**Strategic questions:**

**Q1: What are we building and why?**
- **Validation requirements:** Must have both problem AND goal, 2-3 sentences minimum
- **If vague, probe for:** Specific pain points, target users, decisions supported

**Q2: Must-have core features?**
- **Validation requirements:** At least 2 concrete features, 3-5 critical features recommended
- **If vague, ask:** What will users do first? What provides core value?
- **If too many, help prioritize:** Launch blockers vs nice-to-have

**Q3: Tech stack and requirements?**
- **Validation requirements:** Technologies, integrations, constraints
- **Optional if:** Extending existing project
- **If existing project, ask about:** Existing integrations, performance requirements, team preferences

**Q4: Architecture and design choices?**
- **Validation requirements:** Optional question
- **Topics:** Folder structure preferences, design patterns, architectural style, data modeling

**Q5: Explicitly OUT of scope?**
- **Validation requirements:** At least 1 explicit exclusion
- **Prevents:** Scope creep
- **Clarifies:** Boundaries
- **If none, suggest:** "What won't we build in this phase to keep scope manageable?"

**Q6: Additional context?**
- **Validation requirements:** Optional question
- **Topics:** Compliance, accessibility, deadlines, team constraints

### Rule: Validate before document generation

**When:** All questions answered

**Then:** Verify all validation gates pass

**Validation gates:**
- Gate 1 (Q1): Both problem AND goal stated
- Gate 2 (Q2): At least 2 concrete features
- Gate 3 (Q5): At least 1 explicit scope exclusion

**If any gate fails:**
**Then:** Return to relevant question, guide user to provide missing information

### Rule: Save files to correct location

**When:** Generating PRD documents

**Then:** Use opsis-worktree-utils for save location

**Save preference:**
- If in worktree and it has `.aider-desk`: use worktree's `.aider-desk/opsis/outputs`
- Otherwise: use project root's `.aider-desk/opsis/outputs`

**Save files:**
1. Determine project name (sanitize: lowercase, spaces→hyphens)
2. Create directory: `mkdir -p {SAVE_BASE}/{prd-name}`
3. Save full PRD to: `{SAVE_BASE}/{prd-name}/full-prd.md`
4. Save quick PRD to: `{SAVE_BASE}/{prd-name}/quick-prd.md`
5. Verify both files with Read tool
6. Display actual file paths

### Rule: Use standard output structure

**When:** Generating PRD documents

**Then:** Follow standard format

**Full PRD format:**
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

**Quick PRD format:**
2-3 paragraphs, AI-optimized summary of the full PRD

## Process

1. Ask Q1: What are we building and why?
2. Validate Q1 answer (problem + goal, 2-3 sentences)
3. Ask Q2: Must-have core features?
4. Validate Q2 answer (2+ concrete features)
5. Ask Q3: Tech stack and requirements? (optional if existing project)
6. Ask Q4: Architecture and design choices? (optional)
7. Ask Q5: Explicitly out of scope?
8. Validate Q5 answer (1+ explicit exclusion)
9. Ask Q6: Additional context? (optional)
10. Validate all gates pass
11. Generate full PRD with standard structure
12. Generate quick PRD (2-3 paragraphs)
13. Save files to correct location
14. Verify files exist
15. Display actual file paths
16. Direct user to opsis-plan

## Preconditions

Before using this skill, verify:

- A feature or project idea has been identified (even if vague)
- Requirements gathering is needed before implementation
- No complete PRD exists for this feature/project
- Planning Mode is appropriate

## Postconditions

After completing this skill, verify:

- Full PRD document saved to `{SAVE_BASE}/{prd-name}/full-prd.md`
- Quick PRD document saved to `{SAVE_BASE}/{prd-name}/quick-prd.md`
- Actual file paths displayed to user
- User directed to next steps (opsis-plan)

## Success Metrics

This skill is successful when:

- All strategic questions (Q1-Q6) asked and answered
- Validation gates pass (problem+goal stated, 2+ features, 1+ scope exclusion)
- Both full-prd.md and quick-prd.md created and verified
- Documents follow standard output structure
- User confirms satisfaction with PRD

## Common Situations

**Situation:** User provides vague problem statement

**Pattern:**
- When: Problem statement unclear
- Then: Probe for specific pain points, target users, decisions supported

**Situation:** User lists too many features

**Pattern:**
- When: >5 features listed
- Then: Help prioritize (launch blockers vs nice-to-have)

**Situation:** User has no scope exclusions

**Pattern:**
- When: No exclusions provided
- Then: Suggest: "What won't we build in this phase to keep scope manageable?"
