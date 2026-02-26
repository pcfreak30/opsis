---
name: opsis-iron-laws
description: Core principles for Opsis workflow. Three Iron Laws governing verification, planning, and fix loops. Includes enforcement patterns, violation examples, and rationale.
license: Apache-2.0
---

# Opsis Iron Laws

Core principles for Opsis workflow. Three Iron Laws governing verification, planning, and fix loops.

## The Three Iron Laws

### Iron Law 1: No Completion Without Verification

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

If you haven't run the verification command in this message, you cannot claim it passes.

### Iron Law 2: No Implementation Without Planning

```
NO CODE CHANGES WITHOUT A PLAN OR TASK SPECIFICATION
```

If you're implementing features, there should be a PRD or task list guiding the work.

### Iron Law 3: No Skipping Fix Loops

```
ISSUES FOUND = ISSUES FIXED + RE-VERIFIED
```

If verification found issues, you must fix them AND re-verify. Proceeding without re-verification is forbidden.

## Enforcement

**Reference:** `opsis-mode-enforcer` - Mode boundaries and self-correction

## Integration

All Opsis skills operate under these laws:
- `opsis-implement` - Requires verification before completion claims
- `opsis-plan` - Blocks implementation during planning
- `opsis-verify` - Enforces fix + re-verify loops

---

## Iron Law 1: No Completion Without Verification

### Rationale

**Why this law exists:**
- Agents often claim completion without actually verifying
- False positives waste time and create rework
- User trust requires demonstrable evidence
- "It should work" ≠ "It works"

### What Constitutes Verification

**Valid Evidence:**
- Test output showing PASS (0 failures)
- Build output showing success (exit 0)
- File content verification (file_read showing expected content)
- Lint/type checker output (0 errors)
- User explicit confirmation

**Invalid Claims:**
- "I implemented the feature"
- "The code looks correct"
- "It should work now"
- "Changes are saved"
- "I fixed the bug" (without reproduction)

### Enforcement Pattern

```python
# ❌ WRONG - Claim without verification
"I've fixed the authentication bug. The code now properly validates tokens."

# ✅ CORRECT - Claim with verification
"Running tests to verify authentication bug fix..."
[Execute test command]
"Test output: 15 passed, 0 failed. Bug is verified fixed."
```

### Common Violations

**Violation 1: Assumed Success**
```
❌ "The build should pass now"
✅ "Running build..." [show output] "Build succeeded with 0 errors"
```

**Violation 2: Partial Verification**
```
❌ "Tests pass" (without showing output)
✅ "Test output: 42 passed, 0 failed"
```

**Violation 3: Previous Evidence**
```
❌ "The tests passed earlier, so it's done"
✅ "Re-running tests to verify..." [fresh output]
```

---

## Iron Law 2: No Implementation Without Planning

### Rationale

**Why this law exists:**
- Implementation without specs leads to misaligned features
- Requirements get discovered mid-implementation (expensive)
- No clear acceptance criteria
- Cannot verify against requirements that don't exist

### Required Planning Artifacts

**For Feature Implementation:**
- PRD (Product Requirements Document) OR
- Task specification with clear acceptance criteria

**For Bug Fixes:**
- Bug report with reproduction steps OR
- Test case demonstrating the issue

### Enforcement Pattern

```python
# ❌ WRONG - Implement without spec
User: "Add user authentication"
Agent: [starts implementing auth system]

# ✅ CORRECT - Plan first
User: "Add user authentication"
Agent: "I need to understand requirements before implementing."
        [Activates opsis-prd]
        [Creates PRD]
        "PRD complete. Ready to implement?"
```

### Common Violations

**Violation 1: Premature Implementation**
```
❌ User: "Build a dashboard"
   Agent: [starts creating dashboard components]
✅ User: "Build a dashboard"
   Agent: Activates opsis-prd to gather requirements
```

**Violation 2: Missing Acceptance Criteria**
```
❌ Task: "Implement login"
   [Implements without knowing what "done" means]
✅ Task: "Implement login with email/password, JWT tokens, and session timeout"
```

**Violation 3: Planning During Implementation**
```
❌ [Writing code]
   "Wait, do we need 2FA?"
✅ [In opsis-prd]
   "Should we include 2FA?"
```

---

## Iron Law 3: No Skipping Fix Loops

### Rationale

**Why this law exists:**
- Issues found in verification must be addressed
- Re-verification is required to confirm fixes
- Partial fixes create hidden bugs
- User cannot trust "fixed but not verified"

### Fix Loop Pattern

```
1. Verification → Issues found
   ↓
2. Fix the issues
   ↓
3. Re-run verification (REQUIRED)
   ↓
4. If issues remain → Loop back to step 2
   ↓
5. All pass → Complete
```

### Enforcement Pattern

```python
# ❌ WRONG - Fix without re-verification
"Verification found 3 issues. I've fixed them all. Done."

# ✅ CORRECT - Fix loop with re-verification
"Verification found 3 issues:
  1. Missing error handling
  2. No input validation
  3. Timeout not configured

Fixing issues..."
[Apply fixes]

"Re-running verification..."
[Execute verification commands]
"Verification output: All checks passed. Issues resolved."
```

### Common Violations

**Violation 1: Fix and Assume**
```
❌ "Fixed 2 linter errors" (no re-run)
✅ "Fixed 2 linter errors. Re-running linter..."
   "Linter output: 0 errors"
```

**Violation 2: Partial Fix Loop**
```
❌ "Fixed 3 of 5 issues. The other 2 are minor."
✅ "Fixed 3 issues. Re-verification shows 2 remaining."
   "Fixing remaining 2 issues..."
   "Re-running verification..."
   "All issues resolved."
```

**Violation 3: Break the Loop**
```
❌ "Found issues, but they're edge cases. Moving on."
✅ "Found edge case issues. Fixing now..."
   "Re-verifying edge cases..."
   "All edge cases handled."
```

---

## Violation Examples

### Complete Violation Scenario

```
User: "Implement the payment feature"

❌ AGENT VIOLATION:
1. No PRD created (Violates Iron Law 2)
2. Starts implementing immediately
3. "Payment feature is done" without tests (Violates Iron Law 1)
4. User reports bugs
5. "I'll fix it" but never re-verifies (Violates Iron Law 3)

✅ CORRECT WORKFLOW:
1. Activates opsis-prd to gather requirements
2. Creates PRD with acceptance criteria
3. Activates opsis-plan to break into tasks
4. Implements following tasks.md
5. Runs tests, shows output: "15 passed, 0 failed"
6. User reports bug
7. Activates opsis-systematic-debugging
8. Fixes bug
9. Re-runs tests: "15 passed, 0 failed"
10. Confirms bug is fixed with fresh evidence
```

---

## Quick Reference

| Iron Law | Statement | Key Check |
|----------|-----------|-----------|
| 1 | No completion without verification | Did I run verification in THIS message? |
| 2 | No implementation without planning | Does a PRD or task spec exist? |
| 3 | No skipping fix loops | Did I re-verify after fixing issues? |

---

## Integration with Skills

**Planning Skills:**
- `opsis-prd` - Enforces Iron Law 2 by requiring PRD before implementation
- `opsis-plan` - Creates task specifications for implementation

**Implementation Skills:**
- `opsis-implement` - Requires verification before completion claims
- `opsis-two-stage-review-execution` - Includes verification gates

**Verification Skills:**
- `opsis-verify` - Enforces Iron Law 1 with spec-driven audits
- `opsis-review` - Identifies issues requiring fix loops
- `opsis-verification-before-completion` - Comprehensive verification methodology

**Debugging Skills:**
- `opsis-systematic-debugging` - Root cause investigation before fixes

**Mode Enforcement:**
- `opsis-mode-enforcer` - Blocks implementation during planning, enforces verification before completion

---

## Remember

- NEVER claim completion without running verification in the same message
- NEVER implement features without a PRD or clear task specification
- NEVER skip re-verification after fixing issues
- ALWAYS show fresh evidence for claims
- ALWAYS complete the fix loop: Find → Fix → Re-verify
