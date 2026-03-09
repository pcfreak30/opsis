---
name: opsis-verify
description: "Spec-driven technical audit comparing implementation against PRD requirements and tasks.md. Generate structured review comments."
license: Apache-2.0
---

# Verify

Spec-driven technical audit comparing implementation against PRD and tasks.md.

## When to Use

Use this skill when:

- Verifying implementation against PRD requirements
- Checking compliance with tasks.md specifications
- Generating structured review comments
- Performing gap analysis between plan and code

Do not use when:

- Fixing issues found during verification → Use opsis-implement
- Creating new features → Use opsis-plan then opsis-implement
- Simple code review → Use opsis-review

## Rules

### Rule: No completion claims without evidence

**When:** Claiming any status

**Then:** Provide verification evidence

**Verification gate:**
1. IDENTIFY: Determine what command proves the claim
2. RUN: Execute the FULL command (fresh, complete)
3. READ: Review full output, check exit code, count failures
4. VERIFY: Confirm output actually supports the claim
5. ONLY THEN: Make the completion claim

**Skip any step = lying, not verifying**

### Rule: Use verification process phases

**When:** Starting verification

**Then:** Follow verification phases

**Phase 1: Scope & Context**
- Identify completed work from tasks.md (checked `[x]` items)
- Load requirements from full-prd.md
- Read source files from completed tasks

**Phase 2: The Audit (Gap Analysis)**
- Plan vs Code: Did implementation follow technical notes?
- PRD vs Code: Is business logic present?
- Code vs Standards: Hardcoded values, type errors, violations?

**Phase 3: Review Report**
- Generate structured Review Board with specific, actionable comments

### Rule: Use review comment categories

**When:** Generating review comments

**Then:** Apply correct severity levels

**Severity levels:**

| Severity | When to Use | Action |
|----------|-------------|--------|
| 🔴 CRITICAL | Architectural violation, security risk, feature broken/missing | Must fix |
| 🟠 MAJOR | Logic error, missing edge case, deviation from PRD | Should fix |
| 🟡 MINOR | Code style, naming, comments, optimization | Optional |
| ⚪ OUTDATED | Code correct but Plan/PRD wrong | Update Plan |

### Rule: Use standard output format

**When:** Generating verification report

**Then:** Use report template

**Output format:**
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

### Rule: Apply memory integration

**When:** Storing or retrieving memory

**Then:** Follow eligibility criteria

**When to retrieve:**
- Before starting verification: Retrieve architectural decisions and anti-patterns
- During analysis: Retrieve previous verification findings
- After identifying issues: Retrieve similar patterns

**When to store:**
- After verification passes: Store architectural decisions
- After verification fails: Store anti-patterns and critical findings

**Store ONLY if ALL true:**
- Reusable across future verifications or implementations
- Stable (unlikely to change soon)
- Actionable (changes future behavior or prevents issues)
- Type matches: code-pattern or task

**Never store:**
- Task progress/status or completion state
- One-off bug details or transient issues
- Implementation details
- Specific file lists from this verification
- Logs/stack traces or error messages
- Secrets/tokens/credentials/PII

### Rule: Follow fixing workflow

**When:** User says "Fix #1" or "Fix all critical"

**Then:**
1. Acknowledge
2. Transition to Implementation Mode
3. Implement fix
4. Re-verify (focused verification on specific issue)
5. Return to Verification Mode

## Process

1. Phase 1: Scope & Context
   - Identify completed work from tasks.md
   - Load requirements from full-prd.md
   - Read source files from completed tasks

2. Phase 2: The Audit (Gap Analysis)
   - Compare plan vs code
   - Compare PRD vs code
   - Compare code vs standards

3. Phase 3: Review Report
   - Generate structured Review Board
   - Categorize by severity
   - Provide recommended actions

## Preconditions

Before using this skill, verify:

- PRD document exists (use opsis-worktree-utils to locate)
- Tasks file exists (use opsis-worktree-utils to locate)
- Implementation files are accessible
- Mode is Verification (read-only)

**CRITICAL: Before accessing PRD or tasks.md**
- Stop if worktree state unknown
- Invoke opsis-worktree-utils
- Get resolved paths for state files
- Only then proceed with file operations

## Postconditions

After completing this skill, verify:

- Verification report generated with structured findings
- Review comments categorized by severity
- Gap analysis between spec and implementation documented
- Recommended actions identified

## Success Metrics

This skill is successful when:

- All PRD requirements verified against implementation
- All completed tasks from tasks.md checked
- Review comments use standardized severity levels
- Report includes specific, actionable findings
- Zero false positive claims

## Common Situations

**Situation:** Issues found

**Pattern:**
- When: Verification identifies issues
- Then: Transition to Implementation Mode, implement fix, re-verify

**Situation:** Code correct but plan wrong

**Pattern:**
- When: Implementation matches requirements but plan differs
- Then: Mark as OUTDATED, recommend updating plan

**Situation:** All pass

**Pattern:**
- When: Zero issues, full compliance
- Then: Ready for archive or branch completion
