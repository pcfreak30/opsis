---
name: opsis-review
description: Code review with criteria-driven analysis (Security, Architecture, Standards, Performance). Generate structured review comments with severity levels.
license: Apache-2.0
---

# Review

Criteria-driven code review with structured actionable feedback.

## Tool Selection

For the authoritative rule on subagent vs subtask usage, see **using-opsis**:
- **Rule of Thumb:** Use subagents for research and decisions. Use subtasks for executing work.

**This skill primarily uses direct analysis** but may use `subagents---run_task` for:
- Large PRs requiring focused analysis on specific areas
- Specialized reviews (security, performance, architecture)
- Cross-file pattern detection

## Mode Declaration

**OPSIS MODE: PR Review**
Mode: analysis
Purpose: Criteria-driven code review generating actionable feedback
Implementation: BLOCKED - I will analyze and report, not modify code

## Context Gathering

1. **PR identification:** Ask for branch name or PR description
2. **Review criteria:** Select focus areas:
   - Security (auth, validation, secrets, XSS/CSRF, injection)
   - Architecture (design patterns, SOLID, separation of concerns)
   - Standards (code style, naming, documentation, testing)
   - Performance (efficiency, caching, query optimization)
   - All-Around (balanced review)
3. **Additional context:** Team conventions, specific concerns

## Diff Analysis

Retrieve and analyze git diff:
```bash
git diff <target-branch>...<source-branch>
```

Read changed files and surrounding context. Check against selected criteria.

## Review Output Format

Generate structured review report:

| Severity | When to Use | Example |
|----------|-------------|---------|
| 🔴 CRITICAL | Security risk, architectural violation, broken feature | "Missing auth check on admin endpoint" |
| 🟠 MAJOR | Logic error, deviation from standards, poor practice | "Function too complex (50+ lines)" |
| 🟡 MINOR | Style, naming, documentation | "Variable name unclear" |
| 💚 GOOD | Positive patterns worth noting | "Good error handling here" |

## File-Saving Protocol

Save to: `.aider-desk/opsis/outputs/reviews/{id}.md`

Frontmatter:
```yaml
---
id: review-{timestamp}-{random}
timestamp: {ISO timestamp}
branch: {source-branch}
target: {target-branch}
criteria: [list of criteria]
---
```

## Integration

References: `.aider-desk/opsis/instructions/workflows/review.md`

## Next Steps

After review, user addresses issues, then opsis-verify to confirm fixes.
