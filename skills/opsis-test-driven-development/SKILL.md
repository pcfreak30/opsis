---
name: opsis-test-driven-development
description: Use when writing ANY production code - new features, bug fixes, refactoring, or behavior changes. Enforces the RED-GREEN-REFACTOR cycle with mandatory verification at each phase.
license: Apache-2.0
---

# Test-Driven Development

Test-Driven Development (TDD) methodology enforcing the RED-GREEN-REFACTOR cycle with verification at each phase.

## The Iron Law

**NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST**

This is not negotiable. Violating the letter of the rules is violating the spirit of the rules.

## When to Use

**Always:**
- New features
- Bug fixes
- Refactoring
- Behavior changes

**Exceptions (require explicit permission):**
- Throwaway prototypes
- Generated code
- Configuration files

**Anti-rationalization:** "Thinking skip TDD just this once? Stop. That's rationalization."

## RED-GREEN-REFACTOR Cycle

### RED Phase: Write Failing Test

**Write one minimal test showing expected behavior.**

Requirements:
- One behavior (no "and" in test name - split it)
- Clear name that describes behavior
- Real code (no mocks unless unavoidable)
- Focus on testing behavior, not implementation

**Good vs. Bad Tests:**
- ✅ Good: `test("returns zero for empty input")`
- ❌ Bad: `test("handles input and output correctly")` (vague)

### Verify RED Phase: Watch It Fail

**MANDATORY verification step - never skip.**

1. Run the specific test
2. Confirm:
   - Test fails (not errors)
   - Failure message is expected
   - Fails because feature is missing, not because of typos

**Error Handling:**
- If test passes → Fix test (it's not testing anything)
- If test errors → Fix error until it fails correctly

### GREEN Phase: Minimal Code

**Write simplest code to pass the test only.**

Requirements:
- Write the simplest code that makes the test pass
- Prohibit adding features
- Prohibit refactoring other code
- Prohibit "while I'm here" improvements
- Enforce YAGNI principle

**Examples:**
- ✅ Minimal: `return 0;` (to pass empty input test)
- ❌ Over-engineered: Full implementation with error handling, logging, etc.

### Verify GREEN Phase: Watch It Pass

**MANDATORY verification step.**

1. Run the specific test
2. Confirm:
   - Test passes
   - Other tests still pass
   - Output is pristine (no errors, no warnings)

**Error Handling:**
- If test fails → Fix code, not test
- If other tests fail → Fix now, don't defer

### REFACTOR Phase: Clean Up

**Only after green is confirmed.**

- Remove duplication
- Improve names
- Extract helpers
- Keep tests green
- Don't add behavior

## Verification Checklist

Before marking work complete, ALL boxes must be checked:

- [ ] Every new function/method has a test
- [ ] Watched each test fail before implementing
- [ ] Each test failed for expected reason (feature missing, not typo)
- [ ] Wrote minimal code to pass each test
- [ ] All tests pass
- [ ] Output pristine (no errors, no warnings)
- [ ] Tests use real code (mocks only if unavoidable)
- [ ] Edge cases and errors covered

**If all boxes can't be checked, mandate restart with TDD.**

## Good Test Criteria

### Minimal
- One thing
- "and" in name? Split it

### Clear
- Name describes behavior
- Shows intent (demonstrates desired API, not obscures what code should do)

### Comparison Table

| Aspect | Good Tests | Bad Tests |
|--------|-----------|-----------|
| Focus | Behavior | Implementation |
| Name | Describes what happens | Vague or generic |
| Scope | One behavior | Multiple behaviors ("and") |
| Real code | Uses real code | Over-mocked |
| Intent | Clear from reading | Requires code inspection |

## Red Flags and Common Rationalizations

### Red Flags - STOP Immediately

- Code before test
- Test after implementation
- Test passes immediately
- Can't explain why test failed
- Tests added "later"
- Rationalizing "just this once"
- "I already manually tested it"
- "Tests after achieve the same purpose"
- "It's about spirit not ritual"
- "Keep as reference" or "adapt existing code"
- "Already spent X hours, deleting is wasteful"
- "TDD is dogmatic, I'm being pragmatic"
- "This is different because..."

### Rationalization Prevention Matrix

| Excuse | Reality |
|--------|---------|
| "Issue is simple, don't need test" | Simple issues have edge cases. Tests provide documentation. |
| "I'll test after" | Tests after pass immediately, proving nothing. |
| "I already manually tested it" | Manual testing is ad-hoc, automated is systematic. |
| "It's about spirit not ritual" | Violating letter = violating spirit. No exceptions. |
| "Keep as reference" | Deleting means deleting. No keeping code as reference. |
| "Already spent X hours" | Sunk cost fallacy. Keeping unverified code = technical debt. |
| "TDD is dogmatic" | TDD is pragmatic: finds bugs before commit, prevents regressions. |
| "This is different because..." | No exceptions without explicit human permission. |

## Troubleshooting

### Don't Know How to Test

**Solution:**
1. Write wished-for API
2. Write assertion first
3. Ask for help

### Test Too Complicated

**Problem:** Design too complicated.

**Solution:**
1. Simplify interface
2. Extract helper functions
3. If still complex → redesign

### Must Mock Everything

**Problem:** Code too coupled.

**Solution:**
1. Use dependency injection
2. Extract interfaces
3. Decouple components

### Test Setup Huge

**Solution:**
1. Extract helper setup functions
2. Simplify design if still complex
3. Question: is test doing too much?

## Bug Fix Workflow

1. Write failing test reproducing bug
2. Follow TDD cycle (RED → GREEN → REFACTOR)
3. Test proves fix and prevents regression

## Testing Anti-Patterns

- Testing mock behavior instead of real behavior
- Adding test-only methods to production classes
- Mocking without understanding dependencies

## Why Order Matters

- Tests written after pass immediately, proving nothing
- Test-first forces seeing test fail, proving it tests something
- Manual testing is ad-hoc, automated is systematic
- Sunk cost fallacy doesn't apply - keeping unverified code is technical debt
- TDD is pragmatic: finds bugs before commit, prevents regressions, documents behavior

## Final Rule

**Production code → test exists and failed first. Otherwise → not TDD.**

## Related Skills

- **opsis-systematic-debugging** - If tests reveal complex bugs
- **opsis-verification-before-completion** - Verify all tests pass before claiming completion

## Success Metrics

When TDD is followed:
- Bug rate: Significantly reduced
- Regression rate: Near zero
- Refactoring confidence: High (tests guard against breakage)
- Code documentation: Tests serve as living documentation
