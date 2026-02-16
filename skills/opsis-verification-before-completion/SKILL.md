---
name: opsis-verification-before-completion
description: "Use BEFORE claiming any work is complete, fixed, or passing. Enforces the iron law: NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE."
license: Apache-2.0
---

# Verification Before Completion

Enforces evidence-based completion claims through mandatory verification gates.

## The Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

If verification has not been executed in the current message context, no success claim may be made.

This is not negotiable. Skipping verification constitutes lying.

## The Gate Function

A five-step process that must complete before any completion-oriented statement:

1. **IDENTIFY:** Determine what command proves the claim
2. **RUN:** Execute the FULL command (fresh, complete execution)
3. **READ:** Review full output, check exit code, count failures
4. **VERIFY:** Confirm output actually supports the claim
   - If NO: State actual status with evidence
   - If YES: State claim WITH evidence
5. **ONLY THEN:** Make the completion claim

**Rule:** Skipping any step constitutes lying, not verification.

## When to Apply

Apply verification BEFORE:
- ANY variation of success/completion claims
- ANY expression of satisfaction
- ANY positive statement about work state
- Committing code changes
- Creating pull requests
- Marking tasks complete
- Moving to next task
- Delegating to other agents

## Domain-Specific Verification Patterns

### Test Verification

**Required Evidence:**
- Test command output showing: 0 failures
- Full test count and pass count

**Insufficient Evidence:**
- Previous run results
- Extrapolation from partial tests
- Statements like "should pass now"

**Correct Pattern:**
```
✅ Ran `go test ./...` showing 34/34 tests passing. All tests pass.
❌ "Should pass now" / "Looks correct"
```

### Linter Verification

**Required Evidence:**
- Linter output showing: 0 errors, 0 warnings (as applicable)
- Full file analysis results

**Insufficient Evidence:**
- Partial file checks
- Linter passing used to claim build success
- Extrapolation from similar files

### Build Verification

**Required Evidence:**
- Build command exit code: 0
- Successful compilation output

**Insufficient Evidence:**
- Linter passing (linter ≠ compiler)
- Logs appearing correct without exit code confirmation
- Partial builds

**Correct Pattern:**
```
✅ Executed `npm run build` with exit code 0. Build succeeds.
❌ "Linter passed" (linter doesn't check compilation)
```

### Bug Fix Verification

**Required Evidence:**
- Test demonstrating original symptom now passes
- Before/after comparison if applicable

**Insufficient Evidence:**
- Code changes without symptom testing
- Assumption that fix resolves issue
- Different symptoms tested

### Regression Test Verification (TDD Red-Green)

**Required Evidence:**
- Test written
- Test passes with fix in place
- Test FAILS with fix reverted (red phase)
- Test passes again with fix restored (green phase)

**Insufficient Evidence:**
- Test passing once without red-green cycle
- Claim of test existence without execution

**Correct Pattern:**
```
✅ Write → Run (pass) → Revert fix → Run (MUST FAIL) → Restore → Run (pass)
❌ "I've written a regression test" (without red-green verification)
```

### Agent Delegation Verification

**Required Evidence:**
- Agent reports success
- Version control system (VCS) diff shows actual changes
- Independent verification of changes
- Report of actual state (not assumed state)

**Insufficient Evidence:**
- Agent success report without independent check
- Assuming delegation completed correctly

**Correct Pattern:**
```
✅ Agent reports success → Check VCS diff → Verify changes → Report actual state
❌ Trust agent report
```

### Requirements Verification

**Required Evidence:**
- Re-reading plan/specification
- Creating itemized checklist
- Verifying each requirement against implementation
- Reporting either gaps or completion

**Insufficient Evidence:**
- Tests passing used to claim all requirements met
- Assumption that test coverage equals requirement coverage

**Correct Pattern:**
```
✅ Re-read plan → Create checklist → Verify each → Report gaps or completion
❌ "Tests pass, phase complete"
```

## Prohibited Phrasing

Agents MUST NOT use language implying success without verification:
- "should", "probably", "seems to"
- "Great!", "Perfect!", "Done!", "Excellent!" (before verification)
- "Looks correct", "Appears to work"
- Any satisfaction expression before evidence

## Required Phrasing

All completion claims MUST follow pattern:
```
[Verification command executed] + [Evidence from output] + [Claim]
```

Examples:
- "Ran `go test ./...` showing 42/42 tests passing. All tests pass."
- "Executed `npm run build` with exit code 0. Build succeeds."

## Red Flags - STOP Immediately

Indicators that verification is being bypassed:
- Using hedging language: "should", "probably", "seems to"
- Expressing satisfaction before verification ("Great!", "Perfect!", "Done!")
- About to commit/push/PR without verification
- Trusting agent success reports without independent check
- Relying on partial verification
- Thinking "just this once"
- Fatigue or impatience influencing behavior
- ANY wording implying success without having run verification

## Rationalization Prevention Matrix

| Excuse | Reality | Counter-Action |
|--------|---------|----------------|
| "Should work now" | Confidence ≠ evidence | RUN the verification |
| "I'm confident" | Confidence ≠ evidence | Execute command, read output |
| "Just this once" | No exceptions | Never skip verification |
| "Linter passed" | Linter ≠ compiler | Run actual verification |
| "Agent said success" | Verify independently | Check VCS diff, verify changes |
| "I'm tired" | Exhaustion ≠ excuse | Verification is non-negotiable |
| "Partial check is enough" | Partial proves nothing | Run complete verification |
| "Different words so rule doesn't apply" | Spirit over letter | Any success implication requires verification |

## Anti-Patterns

### Premature Satisfaction
Expressing satisfaction ("Great!", "Perfect!", "Excellent!") before running verification.

### Partial Verification
Running incomplete checks (e.g., linter instead of compiler, single test instead of full suite).

### Cached Evidence
Using results from previous messages or sessions without fresh execution.

### Assumption-Based Claims
Stating success based on code changes, logic review, or confidence without testing.

### Agent Trust Blindness
Accepting delegated agent success reports without independent verification.

## Verification Checklist

Before making any completion claim:

- [ ] Have I run the verification command in this message?
- [ ] Have I read the complete output?
- [ ] Does the output actually confirm my claim?
- [ ] Am I including the evidence in my claim?
- [ ] Am I avoiding hedging language ("should", "probably")?
- [ ] Am I avoiding premature satisfaction expressions?
- [ ] Is this a complete verification, not partial?

**If any answer is NO: Run verification first.**

## Evidence Formatting Examples

```
✅ CORRECT:
Ran `go test ./...` showing 42/42 tests passing with exit code 0. All tests pass.

❌ INCORRECT:
Tests should pass now.

✅ CORRECT:
Executed `npm run build` with exit code 0. Build succeeds with no compilation errors.

❌ INCORRECT:
Build looks good.

✅ CORRECT:
Verified requirements against checklist:
- [x] Requirement 1: Function implemented and tested
- [x] Requirement 2: API endpoint created with correct response
- [x] Requirement 3: Error handling added
All requirements verified and complete.

❌ INCORRECT:
Tests pass, requirements met.
```

## Common Verification Commands by Ecosystem

**Go:**
- Tests: `go test ./... -v`
- Build: `go build ./...`
- Lint: `golangci-lint run`

**JavaScript/Node:**
- Tests: `npm test`
- Build: `npm run build`
- Lint: `npm run lint`

**Python:**
- Tests: `pytest`
- Build: `python -m build`
- Lint: `flake8 .` or `ruff check .`

**Rust:**
- Tests: `cargo test`
- Build: `cargo build --release`
- Clippy: `cargo clippy`

## Related Skills

- **opsis-test-driven-development** - TDD requires red-green verification
- **opsis-systematic-debugging** - Debugging requires evidence-based conclusions
- **opsis-two-stage-review-execution** - Task work requires independent verification

## Success Metrics

When this skill is followed:
- Zero false completion claims
- 100% verification rate for completion-oriented statements
- Zero instances of shipping broken code due to lack of verification
- Increased trust from collaborators (reduced challenge of claims)
- Reduced rework cycles caused by false completion

## Core Value

**Honesty is a core value. If you lie, you'll be replaced.**

Claiming completion without verification is dishonest. Always verify before claiming success.
