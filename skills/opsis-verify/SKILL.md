---
name: opsis-verify
description: Spec-driven technical audit comparing implementation against PRD requirements and tasks.md. Generate structured review comments.
license: Apache-2.0
---

# Verify

Spec-driven technical audit comparing implementation against PRD and tasks.md.

## Core Principle

**No completion claims without evidence. Verification ensures implementation matches specification.**

## Activation Logging

When activating this skill, always announce:

```text
Using opsis-verify to perform spec-driven technical audit
```

## Mode Declaration

Reference **opsis-mode-enforcer** for mode boundaries.

**OPSIS MODE: Verification**
Mode: verification
Purpose: Spec-driven technical audit against requirements and implementation plan
Implementation: BLOCKED - Read-only analysis, no code modifications

## When to Use

**Use opsis-verify when:**
- Verifying implementation against PRD requirements
- Checking compliance with tasks.md specifications
- Generating structured review comments
- Performing gap analysis between plan and code

**Use alternative approaches when:**
- Fixing issues found during verification → Use opsis-implement
- Creating new features → Use opsis-plan then opsis-implement
- Simple code review → Use opsis-review

## Preconditions

- PRD document exists (`{location}/full-prd.md` or `{location}/prd.md`)
- Tasks file exists (`{location}/tasks.md`)
- Implementation files are accessible
- Mode is Verification (read-only)

## Postconditions

- Verification report generated with structured findings
- Review comments categorized by severity
- Gap analysis between spec and implementation documented
- Recommended actions identified

## Success Metrics

- All PRD requirements verified against implementation
- All completed tasks from tasks.md checked
- Review comments use standardized severity levels
- Report includes specific, actionable findings
- Zero false positive claims

## Tool Selection

For the authoritative rule on subagent vs subtask usage, see **using-opsis**:
- **Rule of Thumb:** Use subagents for research and decisions. Use subtasks for executing work.

**This skill primarily uses direct analysis** but may use `subagents---run_task` for:
- Large-scale requirement coverage analysis
- Cross-file architectural verification
- Fresh perspective when verification is complex

## Verification Process

**Phase 1: Scope & Context**

Reference **opsis-worktree-utils** for worktree detection to find PRD and tasks.md.

**After locating files:**
1. Identify completed work from `{location}/tasks.md` (checked `[x]` items)
2. Load requirements from `{location}/full-prd.md`
3. Read source files from completed tasks

**Phase 2: The Audit (Gap Analysis)**
- Plan vs Code: Did implementation follow technical notes?
- PRD vs Code: Is business logic present?
- Code vs Standards: Hardcoded values, type errors, violations?

**Phase 3: Review Report**
Generate structured Review Board with specific, actionable comments.

## Review Comment Categories

| Severity | When to Use | Action |
|----------|-------------|--------|
| 🔴 CRITICAL | Architectural violation, security risk, feature broken/missing | Must fix |
| 🟠 MAJOR | Logic error, missing edge case, deviation from PRD | Should fix |
| 🟡 MINOR | Code style, naming, comments, optimization | Optional |
| ⚪ OUTDATED | Code correct but Plan/PRD wrong | Update Plan |

## Output Format

```markdown
# Verification Report: [Phase/Feature]

**Spec**: tasks.md (Phase X) | **Status**: [Pass/Fail/Warnings]

## 🔍 Review Comments

| ID | Severity | Location | Issue |
|:--:|:--------:|:---------|:------|
| #1 | 🔴 CRIT | `src/auth.ts` | Architecture Violation: Direct axios call, plan specified apiClient |
| #2 | 🟠 MAJOR | `src/Login.tsx` | Missing Req: Forgot Password link (PRD 3.1) |
| #3 | 🟡 MINOR | `src/Login.tsx` | Hardcoded: "Welcome" should be i18n |

## 🛠️ Recommended Actions

- **Option A**: Fix all critical (recommended)
- **Option B**: Fix #1 and #2
- **Option C**: Mark #1 as outdated
```

## Progress Tracking

Reference **opsis-progress-tracking** for standardized progress reporting.

Use the Review Board table format for verification results:

```markdown
| ID | Severity | Location | Issue |
|:--:|:--------:|:---------|:------|
| 1  | Critical | file.ts:42 | Security vulnerability |
| 2  | High     | api.js:15  | Missing error handling |
```

## Memory Integration

Reference **opsis-memory-storage** for memory eligibility criteria.

**When to Retrieve Memory:**
- Before starting verification: Retrieve architectural decisions and anti-patterns relevant to the project
- During analysis: Retrieve previous verification findings for context
- After identifying issues: Retrieve similar patterns from previous verifications

**When to Store Memory:**
- After verification passes: Store architectural decisions made during implementation
- After verification fails: Store anti-patterns identified and critical findings
- After discovering quality issues: Store patterns that prevent future issues

**Storage Types & Criteria:**

Store ONLY if ALL are true:
1. **Reusable** across future verifications or implementations
2. **Stable** (unlikely to change soon)
3. **Actionable** (changes future behavior or prevents issues)
4. **Type matches**: `code-pattern` or `task`

| Type | When to Store | Examples |
|------|---------------|----------|
| `code-pattern` | Architectural decisions | "Use repository pattern for data access", "DTOs required for API boundaries" |
| `code-pattern` | Anti-patterns identified | "Avoid direct DB access from controllers", "Never hardcode API keys" |
| `task` | Verification contracts | "PRD requirements must be testable", "Tasks must map to specific files" |

**NEVER Store:**
- Task progress/status or completion state
- One-off bug details or transient issues
- Implementation details (how code was written)
- Specific file lists from this verification
- Logs/stack traces or error messages
- Secrets/tokens/credentials/PII
- Information directly derivable from repository or PRD

## Verification Gate

Reference **opsis-verification-before-completion** for the iron law:

**NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE**

Before claiming any work is complete:
1. **IDENTIFY:** Determine what command proves the claim
2. **RUN:** Execute the FULL command (fresh, complete execution)
3. **READ:** Review full output, check exit code, count failures
4. **VERIFY:** Confirm output actually supports the claim
5. **ONLY THEN:** Make the completion claim

## Fixing Workflow

When user says "Fix #1" or "Fix all critical":
1. Acknowledge
2. Transition to Implementation Mode (reference **opsis-mode-enforcer**)
3. Implement fix
4. Re-verify (focused verification on specific issue)
5. Return to Verification Mode

## Integration

Works with verification-gate.js hook to block completion claims without evidence.

References: `.aider-desk/opsis/instructions/workflows/verify.md`

## Related Skills

- **opsis-mode-enforcer** - Mode boundaries and enforcement
- **opsis-verification-before-completion** - Evidence-based completion claims
- **opsis-progress-tracking** - Standardized progress reporting
- **opsis-memory-storage** - Memory eligibility and storage patterns
- **opsis-worktree-utils** - Worktree detection
- **opsis-implement** - Fix implementation after verification
- **opsis-archive** - Archive completed projects after verification passes

---

## License

Apache-2.0
