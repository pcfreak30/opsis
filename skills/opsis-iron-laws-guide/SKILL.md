---
name: opsis-iron-laws-guide
description: Deep dive into the three Iron Laws with enforcement patterns, violation examples, and rationale.
license: Apache-2.0
---

# opsis-iron-laws-guide

Deep dive into the three Iron Laws.

## When to Use

**Reference when:**
- Enforcing Iron Laws
- Handling violations
- Understanding rationale
- Training on principles

## Iron Law 1: No Completion Without Verification

### Statement

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

### Rationale

**Why this law exists:**
- Agents often claim completion without actually verifying
- False positives waste time and create rework
- User trust requires demonstrable evidence
- "It should work" ≠ "It works"

### What Constitutes Verification

**Valid Evidence:**
- Test output showing PASS
- Build output showing success
- File content verification (file_read)
- Lint/type checker output
- User explicit confirmation

**Invalid Claims:**
- "I implemented the feature"
- "The code looks correct"
- "It should work now"
- "Changes are saved"

### Enforcement Pattern

```
Before claiming completion:
1. Run verification command (test, build, lint)
2. Read and verify output
3. Display evidence to user
4. Then claim completion
```

### Violation Example

**Incorrect:**
```
User: "Did the tests pass?"
Agent: "I implemented the fix. The tests should pass now."
```

**Correct:**
```
User: "Did the tests pass?"
Agent: [Runs tests]
       "Test results: 7 passed, 0 failed"
       "✅ All tests pass - fix verified"
```

### Common Violations

| Violation | Correct Approach |
|-----------|------------------|
| "I fixed the bug" | "Bug fixed. Verification: tests pass (7/7)" |
| "Tasks are complete" | "Tasks complete. Verification: TODO shows 7/7 done" |
| "Code is correct" | "Code correct. Verification: go build passes, no errors" |

## Iron Law 2: No Implementation Without Planning

### Statement

```
NO CODE CHANGES WITHOUT A PLAN OR TASK SPECIFICATION
```

### Rationale

**Why this law exists:**
- Implementation without requirements leads to wrong solutions
- PRD/tasks provide specification and acceptance criteria
- Scope creep happens without documented boundaries
- User expectations need explicit alignment

### What Constitutes Planning

**Valid Plans:**
- PRD (full-prd.md) with requirements
- tasks.md with specific tasks
- Explicit user specification
- Clear acceptance criteria

**Invalid "Plans":**
- Vague user descriptions
- "Just make it work"
- Implied requirements
- Assumed understanding

### Enforcement Pattern

```
Before implementing:
1. Check for PRD or tasks.md
2. Verify current task is defined
3. Understand acceptance criteria
4. Then proceed with implementation
```

### Planning Mode vs Implementation Mode

**PLANNING MODE:**
- Create PRD, tasks, specifications
- Ask clarifying questions
- Define acceptance criteria
- **NO CODE CHANGES**

**IMPLEMENTATION MODE:**
- Execute from tasks.md
- Write code per specification
- Verify against criteria
- **CODE CHANGES ALLOWED**

### Violation Example

**Incorrect:**
```
User: "I need a login system"
Agent: [Starts writing code immediately]
       "Here's the login implementation..."
```

**Correct:**
```
User: "I need a login system"
Agent: "Let's create a PRD first to define requirements."
       [Invokes opsis-prd]
       "After PRD, I'll create tasks and then implement."
```

### Common Violations

| Violation | Correct Approach |
|-----------|------------------|
| Writing code during PRD creation | Stay in Planning Mode, no code |
| Implementing from vague description | Create tasks.md first |
| Adding unplanned features | Stick to tasks.md specification |
| "I'll just fix this quickly" | Check if fix is in plan |

## Iron Law 3: No Skipping Fix Loops

### Statement

```
ISSUES FOUND = ISSUES FIXED + RE-VERIFIED
```

### Rationale

**Why this law exists:**
- Fixes often introduce new issues
- Verification after fix is essential
- Skipping re-verification leaves bugs
- False confidence from partial fixes

### The Fix Loop

```
┌─────────────┐
│  Find Issue │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Fix Issue  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Re-Verify   │◄──── Must not skip
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Issue      │
│  Resolved?  │
└──────┬──────┘
       │
   YES─┴─NO
       │
       ▼
┌─────────────┐
│  Done       │
└─────────────┘
```

### Re-Verification Requirements

**After every fix:**
1. Run same verification that found the issue
2. Confirm issue is resolved
3. Check for regressions
4. Display new verification results

### Violation Example

**Incorrect:**
```
Verification: "3 issues found in code"
Agent: [Fixes issues]
       "All issues fixed. Implementation complete."
       [No re-verification]
```

**Correct:**
```
Verification: "3 issues found in code"
Agent: [Fixes issues]
       [Re-runs verification]
       "Re-verification: 0 issues found"
       "✅ All issues resolved and verified"
```

### Common Violations

| Violation | Correct Approach |
|-----------|------------------|
| "Fixed, moving on" | Fix → Verify → Confirm |
| "Should be good now" | Run verification to confirm |
| Skipping verification after small fix | All fixes need verification |
| Assuming fix worked | Evidence required |

## Mode Enforcement

### Planning Mode (using-opsis, opsis-start, opsis-prd, opsis-plan)

**AUTHORIZED:**
- Ask questions, gather requirements
- Create documents (PRD, tasks.md)
- Use `opsis-brainstorming`, `opsis-summarize`

**BLOCKED:**
- Write application code
- Modify production files
- Execute build/test commands

### Implementation Mode (opsis-implement, opsis-two-stage-review-execution)

**AUTHORIZED:**
- Write production code
- Execute tasks from tasks.md
- Run verification commands

**BLOCKED:**
- Skip verification steps
- Mark tasks complete without evidence
- Ignore blocked task reporting

### Verification Mode (opsis-verify, opsis-review)

**AUTHORIZED:**
- Read and analyze code
- Compare against PRD
- Generate review comments

**BLOCKED:**
- Fix issues automatically
- Modify code without direction
- Make evidence-less claims

## Integration with Skills

| Skill | Iron Law Focus |
|-------|----------------|
| `opsis-mode-enforcer` | Enforces all three laws |
| `opsis-verification-before-completion` | Law 1 (verification) |
| `opsis-plan`, `opsis-prd` | Law 2 (planning) |
| `opsis-systematic-debugging` | Law 3 (fix loops) |
| `opsis-implement` | All three laws |

## Success Metrics

**Iron Laws are followed when:**
- Every completion claim includes verification evidence
- No code written without PRD or tasks.md
- Every fix is followed by re-verification
- Mode boundaries are respected
- No protocol violations detected