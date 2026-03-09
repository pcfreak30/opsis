---
name: opsis-systematic-debugging
description: "Use when encountering any bug, test failure, crash, performance problem, or unexpected behavior, before proposing fixes. Enforces root cause investigation before any fix attempt."
license: Apache-2.0
---

# Systematic Debugging

Systematic debugging methodology that replaces random fixes with structured root cause investigation.

## When to Use

Use this skill when:

- Test failures
- Bugs in production
- Unexpected behavior
- Performance problems
- Build failures
- Integration issues

Do not use when:

- No issue exists
- Issue is already understood and documented

## Rules

### Rule: The Iron Law

**When:** ANY technical issue

**Then:** Follow Iron Law

**Iron Law:** NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST

**This is not negotiable.**

### Rule: Phase 1 - Root Cause Investigation

**When:** Starting investigation

**Then:** Complete investigation before any fix attempt

**Phase 1 steps:**

1. **Read error messages carefully**
   - Do not skip past errors or warnings
   - Read stack traces completely
   - Note line numbers, file paths, error codes

2. **Reproduce consistently**
   - Can the issue be triggered reliably?
   - What are the exact steps?
   - Does it happen every time?

3. **Check recent changes**
   - What changed that could cause this?
   - Git diff, recent commits
   - New dependencies, config changes

4. **Gather evidence in multi-component systems**

   **WHEN system has multiple components:**

   **BEFORE proposing fixes, add diagnostic instrumentation:**
   - For EACH component boundary: log what data enters component
   - For EACH component boundary: log what data exits component
   - Verify environment/config propagation
   - Check state at each layer

   Run once to gather evidence showing WHERE it breaks, THEN analyze evidence to identify failing component, THEN investigate that specific component.

5. **Trace data flow**

   **WHEN error is deep in call stack:**
   - Where does bad value originate?
   - What called this with bad value?
   - Keep tracing up until the source is found
   - Fix at source, not at symptom

**Success criteria:** Understand WHAT is happening and WHY it is happening.

### Rule: Phase 2 - Pattern Analysis

**When:** Root cause investigation complete

**Then:** Find the pattern before fixing

**Phase 2 steps:**

1. **Find working examples**
   - Locate similar working code in the same codebase
   - What works that's similar to what's broken?

2. **Compare against references**
   - If implementing a pattern, read reference implementation COMPLETELY
   - Do not skim - read every line
   - Understand the pattern fully before applying

3. **Identify differences**
   - What's different between working and broken?
   - List every difference, however small

4. **Understand dependencies**
   - What other components does this need?
   - What settings, config, environment?

**Success criteria:** Identify differences between working and broken implementations.

### Rule: Phase 3 - Hypothesis and Testing

**When:** Pattern analysis complete

**Then:** Use scientific method

**Phase 3 steps:**

1. **Form single hypothesis**
   - State clearly: "I think X is the root cause because Y"
   - Write it down
   - Be specific, not vague

2. **Test minimally**
   - Make the SMALLEST possible change to test hypothesis
   - One variable at a time

3. **Verify before continuing**
   - Did it work? Yes → Phase 4
   - Didn't work? Form NEW hypothesis
   - DO NOT add more fixes on top

4. **When you don't know**
   - Say "I don't understand X"
   - Do not pretend to know
   - Ask for help
   - Research more

**Success criteria:** Hypothesis confirmed or new hypothesis formed.

### Rule: Phase 4 - Implementation

**When:** Hypothesis confirmed

**Then:** Fix the root cause, not the symptom

**Phase 4 steps:**

1. **Create failing test case**
   - Simplest possible reproduction
   - Automated test if possible
   - One-off test script if no framework
   - MUST have before fixing

2. **Implement single fix**
   - Address the root cause identified
   - ONE change at a time

3. **Verify fix**

4. **If fix doesn't work**
   - STOP
   - Count: How many fixes have been tried?
   - If < 3: Return to Phase 1, re-analyze with new information
   - **If ≥ 3: STOP and question the architecture (step 5 below)**

5. **If 3+ fixes failed: Question architecture**

   **Pattern indicating architectural problem:**
   - Each fix reveals new shared state/coupling/problem
   - Fixes require "massive refactoring"
   - Each fix creates new symptoms elsewhere

   **STOP and question fundamentals:**
   - Is this pattern fundamentally sound?
   - Are we "sticking with it through sheer inertia"?

   Discuss with human partner before attempting more fixes.

**Success criteria:** Bug resolved, tests pass, no new issues introduced.

### Rule: Stop at red flags

**When:** Seeing red flags

**Then:** STOP and follow process

**Red flags:**
- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "Add multiple changes, run tests"
- "Skip the test, I'll manually verify"
- "It's probably X, let me fix that"
- "I don't fully understand but this might work"
- "Pattern says X but I'll adapt it differently"
- Proposing solutions before tracing data flow
- **"One more fix attempt" (when already tried 2+)**
- **Each fix reveals new problem in different place**

### Rule: Use advanced problem-solving methods

**When:** Standard debugging phases don't yield results

**Then:** Apply advanced frameworks

**Frameworks:**
- TRIZ (Theory of Inventive Problem Solving) - 40 Inventive Principles
- Theory of Constraints - Five Focusing Steps
- Systems Thinking - Causal Loop Diagrams, Stock and Flow

## Process

1. Phase 1: Root Cause Investigation
   - Read error messages carefully
   - Reproduce consistently
   - Check recent changes
   - Gather evidence in multi-component systems
   - Trace data flow

2. Phase 2: Pattern Analysis
   - Find working examples
   - Compare against references
   - Identify differences
   - Understand dependencies

3. Phase 3: Hypothesis and Testing
   - Form single hypothesis
   - Test minimally
   - Verify before continuing
   - When you don't know: ask for help

4. Phase 4: Implementation
   - Create failing test case
   - Implement single fix
   - Verify fix
   - If fix doesn't work: question architecture after 3+ failures

## Preconditions

Before using this skill, verify:

- An issue exists that needs investigation
- Error messages, logs, or symptoms are accessible
- Codebase is available for analysis
- Iron Law acknowledged: NO FIXES WITHOUT ROOT CAUSE INVESTIGATION

## Postconditions

After completing this skill, verify:

- Root cause is identified and documented
- Fix addresses the root cause, not symptoms
- Verification confirms the fix works
- No new bugs introduced
- Success criteria from Phase 4 met

## Success Metrics

This skill is successful when:

- First-time fix rate: 95% (vs 40% without systematic approach)
- Time to fix: 15-30 minutes (vs 2-3 hours of thrashing)
- Root cause understood before any fix attempt
- Fix verified with evidence before claiming completion
- No regression or new issues introduced

## Common Situations

**Situation:** Multi-component system error

**Pattern:**
- When: System has multiple components (CI → build → signing)
- Then: Add diagnostic instrumentation at each boundary
- Verify: Log data entering and exiting each component

**Situation:** Error deep in call stack

**Pattern:**
- When: Error location deep in stack trace
- Then: Trace data flow up to source
- Verify: Fix at source, not at symptom

**Situation:** 3+ fixes failed

**Pattern:**
- When: Multiple fix attempts unsuccessful
- Then: STOP and question architecture
- Verify: Discuss with human before more fixes
