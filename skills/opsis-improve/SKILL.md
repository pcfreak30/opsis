---
name: opsis-improve
description: Prompt optimization with auto-depth selection. 6-dimension quality assessment (Clarity, Efficiency, Structure, Completeness, Actionability, Specificity).
license: Apache-2.0
---

# Improve

Analyze and optimize prompts with auto-detected depth.

## Mode Declaration

**OPSIS MODE: Improve**
Mode: planning
Purpose: Optimizing user prompt with pattern-based analysis
Depth: [standard|comprehensive] (auto-detected based on quality score)
Implementation: BLOCKED - I will analyze and improve the prompt, not implement it

## Smart Depth Selection

- **Quality ≥ 75%**: Comprehensive depth (add polish and enhancements)
- **Quality 60-74%**: User choice (borderline quality)
- **Quality < 60%**: Standard depth (focus on basic fixes)

## Quality Assessment (6 Dimensions)

- **Clarity**: Objective clear and unambiguous?
- **Efficiency**: Concise without losing critical info?
- **Structure**: Information organized logically?
- **Completeness**: All necessary details provided?
- **Actionability**: AI can take immediate action?
- **Specificity**: Concrete and precise (versions, paths, identifiers)?

Score each 0-100%, calculate weighted overall.

## Intent Detection

Analyze what user is trying to achieve:
- code-generation, planning, refinement, debugging
- documentation, prd-generation, testing, migration
- security-review, learning, summarization

## Output Structure

**Standard Depth:**
- Intent Analysis
- Quality Assessment (6 dimensions)
- Optimized Prompt
- Improvements Applied (labeled with quality dimensions)
- Patterns Applied

**Comprehensive Depth (adds):**
- Alternative Approaches (2-3 different ways)
- Validation Checklist
- Edge Cases to Consider
- What Could Go Wrong (risk assessment)

## File-Saving Protocol

Save to: `.aider-desk/opsis/outputs/prompts/{id}.md`

Frontmatter:
```yaml
---
id: std-{timestamp}-{random}
timestamp: {ISO timestamp}
executed: false
originalPrompt: "{user's original prompt}"
---
```

After saving, tell user: "Run opsis-implement to implement."

## Integration

References: `.aider-desk/opsis/instructions/workflows/improve.md`

## Next Steps

After improvement, use opsis-implement to execute the optimized prompt.
