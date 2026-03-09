---
name: opsis-test-driven-development
description: "Use when writing ANY production code - new features, bug fixes, refactoring, or behavior changes. Enforces the RED-GREEN-REFACTOR cycle with mandatory verification at each phase."
license: Apache-2.0
---

# Test-Driven Development

Test-Driven Development (TDD) methodology enforcing the RED-GREEN-REFACTOR cycle with verification at each phase.

## When to Use

Use this skill when:

- New features
- Bug fixes
- Refactoring
- Behavior changes

Do not use when:

- Throwaway prototypes
- Generated code
- Configuration files

## Rules

### Rule: The Iron Law

**When:** Writing ANY production code

**Then:** Follow Iron Law

**Iron Law:** NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST

**This is not negotiable.**

### Rule: RED Phase - Write failing test

**When:** Starting implementation

**Then:** Write one minimal test showing expected behavior

**Requirements:**
- One behavior (no "and" in test name - split it)
- Clear name that describes behavior
- Real code (no mocks unless unavoidable)
- Focus on testing behavior, not implementation

**Good vs. Bad Tests:**
- ✅ Good: `test("returns zero for empty input")`
- ❌ Bad: `test("handles input and output correctly")` (vague)

### Rule: Verify RED Phase

**When:** Test written

**Then:** Watch it fail (MANDATORY)

**Verification steps:**
1. Run the specific test
2. Confirm:
   - Test fails (not errors)
   - Failure message is expected
   - Fails because feature is missing, not because of typos

**Error handling:**
- If test passes → Fix test (it's not testing anything)
- If test errors → Fix error until it fails correctly

### Rule: GREEN Phase - Minimal code

**When:** Test failing correctly

**Then:** Write simplest code to pass the test only

**Requirements:**
- Write the simplest code that makes the test pass
- Prohibit adding features
- Prohibit refactoring other code
- Prohibit "while I'm here" improvements
- Enforce YAGNI principle

**Examples:**
- ✅ Minimal: `return 0;` (to pass empty input test)
- ❌ Over-engineered: Full implementation with error handling, logging, etc.

### Rule: Verify GREEN Phase

**When:** Code written

**Then:** Watch it pass (MANDATORY)

**Verification steps:**
1. Run the specific test
2. Confirm:
   - Test passes
   - Other tests still pass
   - Output is pristine (no errors, no warnings)

**Error handling:**
- If test fails → Fix code, not test
- If other tests fail → Fix now, don't defer

### Rule: REFACTOR Phase - Clean up

**When:** Green confirmed

**Then:** Only after green is confirmed

**REFACTOR actions:**
- Remove duplication
- Improve names
- Extract helpers
- Keep tests green
- Don't add behavior

### Rule: Good test criteria

**When:** Writing tests

**Then:** Follow good test criteria

**Minimal:**
- One thing
- "and" in name? Split it

**Clear:**
- Name describes behavior
- Shows intent (demonstrates desired API)

**Comparison Table:**

| Aspect | Good Tests | Bad Tests |
|--------|-----------|-----------|
| Focus | Behavior | Implementation |
| Name | Describes what happens | Vague or generic |
| Scope | One behavior | Multiple behaviors ("and") |
| Real code | Uses real code | Over-mocked |
| Intent | Clear from reading | Requires code inspection |

### Rule: Verification checklist

**When:** Marking work complete

**Then:** ALL boxes must be checked

**Checklist:**
- [ ] Every new function/method has a test
- [ ] Watched each test fail before implementing
- [ ] Each test failed for expected reason (feature missing, not typo)
- [ ] Wrote minimal code to pass each test
- [ ] All tests pass
- [ ] Output pristine (no errors, no warnings)
- [ ] Tests use real code (mocks only if unavoidable)
- [ ] Edge cases and errors covered

**If all boxes can't be checked:**
**Then:** Mandate restart with TDD

### Rule: Red flags

**When:** Seeing red flags

**Then:** STOP immediately

**Red flags:**
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

### Rule: Rationalization prevention

**When:** Rationalizing

**Then:** Apply reality check

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

## Process

1. RED Phase: Write failing test
   - Write one minimal test showing expected behavior
   - Verify test fails correctly

2. GREEN Phase: Minimal code
   - Write simplest code to pass the test only
   - Verify test passes

3. REFACTOR Phase: Clean up
   - Remove duplication
   - Improve names
   - Extract helpers
   - Keep tests green

## Preconditions

Before using this skill, verify:

- Writing production code (not prototypes, generated code, or config)
- User wants TDD methodology

## Postconditions

After completing this skill, verify:

- Every new function/method has a test
- Watched each test fail before implementing
- Wrote minimal code to pass each test
- All tests pass
- Output pristine (no errors, no warnings)

## Success Metrics

When TDD is followed:

- Bug rate: Significantly reduced
- Regression rate: Near zero
- Refactoring confidence: High (tests guard against breakage)
- Code documentation: Tests serve as living documentation

## Common Situations

**Situation:** Don't know how to test

**Pattern:**
- When: Unsure how to write test
- Then: Write wished-for API, write assertion first, ask for help

**Situation:** Test too complicated

**Pattern:**
- When: Design too complicated
- Then: Simplify interface, extract helper functions

**Situation:** Must mock everything

**Pattern:**
- When: Code too coupled
- Then: Use dependency injection, extract interfaces, decouple components

**Situation:** Test setup huge

**Pattern:**
- When: Setup too complex
- Then: Extract helper setup functions, simplify design

**Situation:** Bug fix workflow

**Pattern:**
- When: Fixing bug
- Then: Write failing test reproducing bug, follow TDD cycle
