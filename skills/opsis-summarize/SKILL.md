---
name: opsis-summarize
description: Conversation analysis and mini-PRD extraction. Extract requirements, organize them, create documentation files.
license: Apache-2.0
---

# Summarize

Extract and optimize requirements from conversation into structured documentation.

## Mode Declaration

**OPSIS MODE: Requirements Extraction**
Mode: planning
Purpose: Extracting and optimizing requirements from conversation
Implementation: BLOCKED - I will extract requirements, not implement them

## Pre-Extraction Validation

Check conversation completeness:
- **Objective/Goal**: Clear problem or goal stated?
- **Requirements**: 2-3 concrete features described?
- **Context**: Enough about who/what/why?

If missing, ask targeted questions before proceeding.

## Extraction Process

Extract and annotate with confidence indicators:
- **[HIGH]**: Explicitly stated multiple times with details
- **[MEDIUM]**: Mentioned once or inferred from context
- **[LOW]**: Assumed based on limited information

Extract:
- Problem/Goal [confidence]
- Key Requirements [confidence per requirement]
- Technical Constraints [confidence]
- Architecture & Design [confidence]
- User Needs [confidence]
- Success Criteria [confidence]
- Context [confidence]

## Output Files (Required)

1. **mini-prd.md** - Structured PRD with requirements prioritized
2. **original-prompt.md** - Raw extraction (2-4 paragraphs)
3. **optimized-prompt.md** - Enhanced version with pattern-based optimization

## File-Saving Protocol

Reference **opsis-worktree-utils** for worktree detection and save location logic.

**Save files:**
1. Determine project name (from conversation, confirm with user)
2. Create directory: `{SAVE_BASE}/{prd-name}/`
3. Write all three files: `mini-prd.md`, `original-prompt.md`, `optimized-prompt.md`
4. Verify with Read tool
5. Display actual file paths

## Integration

Works with session-tracker.js hook for tracking conversation patterns.

References: `.aider-desk/opsis/instructions/workflows/summarize.md`

## Next Steps

After summarization, use opsis-prd for structured planning or opsis-improve for prompt optimization.
