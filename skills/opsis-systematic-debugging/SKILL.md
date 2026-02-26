---
name: opsis-systematic-debugging
description: Use when encountering any bug, test failure, crash, performance problem, or unexpected behavior, before proposing fixes. Enforces root cause investigation before any fix attempt.
license: Apache-2.0
---

# Systematic Debugging

Systematic debugging methodology that replaces random fixes with structured root cause investigation.

## Activation Log

When this skill is activated, log:

```text
ACTIVATED: opsis-systematic-debugging
Issue Type: {bug|test failure|crash|performance|unexpected behavior}
Component: {affected component}
Phase: {1|2|3|4} - {phase name}
```

## Preconditions

Before invoking this skill:
1. An issue exists that needs investigation
2. Error messages, logs, or symptoms are accessible
3. Codebase is available for analysis
4. The Iron Law is acknowledged: **NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST**

## Postconditions

After completing this skill:
1. Root cause is identified and documented
2. Fix addresses the root cause, not symptoms
3. Verification confirms the fix works
4. No new bugs introduced
5. Success criteria from Phase 4 are met

## Success Metrics

This skill is successful when:
- First-time fix rate: 95% (vs 40% without systematic approach)
- Time to fix: 15-30 minutes (vs 2-3 hours of thrashing)
- Root cause is understood before any fix attempt
- Fix is verified with evidence before claiming completion
- No regression or new issues introduced

## The Iron Law

**NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST**

This is not negotiable. The skill enforces absolute adherence to this principle.

## When to Use

Use for ANY technical issue:
- Test failures
- Bugs in production
- Unexpected behavior
- Performance problems
- Build failures
- Integration issues

**Especially critical when:**
- Under time pressure (emergencies make guessing tempting)
- "Just one quick fix" seems obvious
- Multiple fixes have already been tried
- Previous fix didn't work
- Full understanding of the issue is lacking

## Mode Declaration

For complete mode enforcement rules, Iron Laws, and mode boundary enforcement, reference **opsis-mode-enforcer**.

**Key modes during debugging:**
- **Investigation Mode** (Phases 1-3): Read-only analysis, hypothesis formation
- **Implementation Mode** (Phase 4): Apply verified fix, create tests
- **Verification Mode**: Confirm fix works, no regressions

## Tool Selection

For the authoritative rule on subagent vs subtask usage, see **using-opsis**:
- **Rule of Thumb:** Use subagents for research and decisions. Use subtasks for executing work.

**This skill primarily uses direct investigation** but may use `subagents---run_task` for:
- Complex multi-component analysis
- Large-scale pattern searches
- Fresh perspective when stuck (≥3 failed fixes)

## The Four Phases

### Phase 1: Root Cause Investigation

**Complete investigation before any fix attempt.**

1. **Read Error Messages Carefully**
   - Do not skip past errors or warnings
   - Read stack traces completely
   - Note line numbers, file paths, error codes
   - Error messages often contain the exact solution

2. **Reproduce Consistently**
   - Can the issue be triggered reliably?
   - What are the exact steps?
   - Does it happen every time?
   - If not reproducible → gather more data, do not guess

3. **Check Recent Changes**
   - What changed that could cause this?
   - Git diff, recent commits
   - New dependencies, config changes
   - Environmental differences

4. **Gather Evidence in Multi-Component Systems**

   **WHEN system has multiple components (e.g., CI → build → signing, API → service → database):**

   **BEFORE proposing fixes, add diagnostic instrumentation:**
   - For EACH component boundary: log what data enters component
   - For EACH component boundary: log what data exits component
   - Verify environment/config propagation
   - Check state at each layer

   Run once to gather evidence showing WHERE it breaks, THEN analyze evidence to identify failing component, THEN investigate that specific component.

5. **Trace Data Flow**

   **WHEN error is deep in call stack:**
   - Where does bad value originate?
   - What called this with bad value?
   - Keep tracing up until the source is found
   - Fix at source, not at symptom

**Success Criteria:** Understand WHAT is happening and WHY it is happening.

### Phase 2: Pattern Analysis

**Find the pattern before fixing.**

1. **Find Working Examples**
   - Locate similar working code in the same codebase
   - What works that's similar to what's broken?

2. **Compare Against References**
   - If implementing a pattern, read reference implementation COMPLETELY
   - Do not skim - read every line
   - Understand the pattern fully before applying

3. **Identify Differences**
   - What's different between working and broken?
   - List every difference, however small
   - Do not assume "that can't matter"

4. **Understand Dependencies**
   - What other components does this need?
   - What settings, config, environment?
   - What assumptions does it make?

**Success Criteria:** Identify differences between working and broken implementations.

### Phase 3: Hypothesis and Testing

**Use scientific method to test hypotheses.**

1. **Form Single Hypothesis**
   - State clearly: "I think X is the root cause because Y"
   - Write it down
   - Be specific, not vague

2. **Test Minimally**
   - Make the SMALLEST possible change to test hypothesis
   - One variable at a time
   - Do not fix multiple things at once

3. **Verify Before Continuing**
   - Did it work? Yes → Phase 4
   - Didn't work? Form NEW hypothesis
   - DO NOT add more fixes on top

4. **When You Don't Know**
   - Say "I don't understand X"
   - Do not pretend to know
   - Ask for help
   - Research more

**Success Criteria:** Hypothesis confirmed or new hypothesis formed.

### Phase 4: Implementation

**Fix the root cause, not the symptom.**

1. **Create Failing Test Case**
   - Simplest possible reproduction
   - Automated test if possible
   - One-off test script if no framework
   - MUST have before fixing

2. **Implement Single Fix**
   - Address the root cause identified
   - ONE change at a time
   - No "while I'm here" improvements
   - No bundled refactoring

3. **Verify Fix**

   For complete verification procedures, reference **opsis-verification-gate**:

   ```
   IDENTIFY → RUN → READ → VERIFY
   ```

   - Test passes now?
   - No other tests broken?
   - Issue actually resolved?

4. **If Fix Doesn't Work**
   - STOP
   - Count: How many fixes have been tried?
   - If < 3: Return to Phase 1, re-analyze with new information
   - **If ≥ 3: STOP and question the architecture (step 5 below)**
   - DO NOT attempt Fix #4 without architectural discussion

5. **If 3+ Fixes Failed: Question Architecture**

   **Pattern indicating architectural problem:**
   - Each fix reveals new shared state/coupling/problem in different place
   - Fixes require "massive refactoring" to implement
   - Each fix creates new symptoms elsewhere

   **STOP and question fundamentals:**
   - Is this pattern fundamentally sound?
   - Are we "sticking with it through sheer inertia"?
   - Should we refactor architecture vs. continue fixing symptoms?

   Discuss with human partner before attempting more fixes. This is NOT a failed hypothesis - this is a wrong architecture.

**Success Criteria:** Bug resolved, tests pass, no new issues introduced.

## Red Flags - STOP and Follow Process

When you see these red flags, STOP and return to Phase 1:

- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "Add multiple changes, run tests"
- "Skip the test, I'll manually verify"
- "It's probably X, let me fix that"
- "I don't fully understand but this might work"
- "Pattern says X but I'll adapt it differently"
- "Here are the main problems: [lists fixes without investigation]"
- Proposing solutions before tracing data flow
- **"One more fix attempt" (when already tried 2+)**
- **Each fix reveals new problem in different place**

## Human Partner Signals

Watch for redirection signals:

- "Is that not happening?" - You assumed without verifying
- "Will it show us...?" - You should have added evidence gathering
- "Stop guessing" - You're proposing fixes without understanding
- "Ultrathink this" - Question fundamentals, not just symptoms
- "We're stuck?" (frustrated) - Your approach isn't working

**Response to signals:** STOP. Return to Phase 1.

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Issue is simple, don't need process" | Simple issues have root causes too. Process is fast for simple bugs. |
| "Emergency, no time for process" | Systematic debugging is FASTER than guess-and-check thrashing. |
| "Just try this first, then investigate" | First fix sets the pattern. Do it right from the start. |
| "I'll write test after confirming fix works" | Untested fixes don't stick. Test first proves it. |
| "Multiple fixes at once saves time" | Can't isolate what worked. Causes new bugs. |
| "Reference too long, I'll adapt the pattern" | Partial understanding guarantees bugs. Read it completely. |
| "I see the problem, let me fix it" | Seeing symptoms ≠ understanding root cause. |
| "One more fix attempt" (after 2+ failures) | 3+ failures = architectural problem. Question pattern, don't fix again. |

## Advanced Problem-Solving Methods

When standard debugging phases don't yield results, apply these advanced frameworks:

### TRIZ (Theory of Inventive Problem Solving)

**40 Inventive Principles for Technical Conflicts:**

| Principle | Application in Debugging |
|-----------|-------------------------|
| **Segmentation** | Break complex problem into smaller, testable parts |
| **Extraction** | Remove problematic component, test in isolation |
| **Local Quality** | Optimize specific part rather than whole system |
| **Asymmetry** | Introduce intentional asymmetry to identify state issues |
| **Merger** | Combine similar bugs to find common root cause |
| **Universality** | Use universal solution that applies to multiple related issues |
| **Nesting** | Test component within different contexts/environments |
| **Counterweight** | Add compensating mechanism to balance problematic behavior |
| **Prior Counteraction** | Anticipate and prevent expected failure modes |
| **Prior Action** | Add instrumentation before problem occurs |
| **Cushion in Advance** | Add safety checks that catch issue early |
| **Equipotentiality** | Simplify system state to eliminate variables |
| **The Other Way Round** | Invert logic to test assumptions (e.g., test what should NOT happen) |
| **Curvature** | Change linear flow to detect state transitions |
| **Dynamicity** | Make system more dynamic to reveal hidden state issues |
| **Partial or Excessive Actions** | Test with partial or excessive inputs to find boundaries |
| **Another Dimension** | Look at problem from different perspective (time, space, abstraction) |
| **Mechanical Vibration** | Introduce controlled chaos to test robustness |
| **Periodic Action** | Use periodic checks to catch intermittent issues |
| **Continuity of Useful Action** | Maintain state monitoring throughout execution |
| **Skipping** | Skip certain operations to isolate problematic step |
| **Blessing in Disguise** | Use failure as diagnostic information |
| **Feedback** | Add extensive feedback/logging to understand behavior |
| **Intermediary** | Insert test component between problematic parts |
| **Self-Service** | Enable system to self-diagnose and report issues |
| **Copying** | Clone working environment to compare with broken |
| **Cheap Short-Living** | Use temporary test environment for quick validation |
| **Mechanics Substitution** | Replace problematic component with alternative implementation |
| **Pneumatics/Hydraulics** | Change flow/pressure patterns to test assumptions |
| **Flexible Shells** | Add wrapper to test component in isolation |
| **Porous Materials** | Add selective visibility into internal state |
| **Color Changes** | Use visual markers to trace execution paths |
| **Homogeneity** | Make similar components identical to eliminate variables |
| **Discarding and Recovering** | Remove and restore components systematically |
| **Parameter Changes** | Vary parameters to find working combination |
| **Phase Transitions** | Change system phase (e.g., cold vs warm start) |
| **Thermal Expansion** | Stress test by expanding scope/complexity |
| **Strong Oxidants** | Introduce aggressive test conditions |
| **Inert Atmosphere** | Test in minimal, controlled environment |
| **Composite Materials** | Combine multiple partial solutions |

**Contradiction Matrix Approach:**
1. Identify conflicting parameters (e.g., speed vs accuracy)
2. Use TRIZ matrix to find applicable principles
3. Apply suggested principles creatively to your debugging context

### Theory of Constraints

**Five Focusing Steps for System Bottlenecks:**

1. **Identify the Constraint**
   - What's limiting system performance?
   - Where is the bottleneck?
   - Which component is the weak link?

2. **Exploit the Constraint**
   - Get maximum value from existing constraint
   - Optimize around the bottleneck
   - Ensure constraint is always working

3. **Subordinate Everything Else**
   - Align all other components to support constraint
   - Don't over-optimize non-constraints
   - Synchronize system to constraint's pace

4. **Elevate the Constraint**
   - If constraint still limits, increase its capacity
   - Add resources to constraint
   - Improve constraint performance

5. **Repeat**
   - Once constraint is broken, find new constraint
   - Continuous improvement cycle

**Thinking Processes:**
- **Current Reality Tree**: Map cause-effect relationships to find root cause
- **Evaporating Cloud**: Resolve conflicts by finding underlying assumptions
- **Future Reality Tree**: Verify solution won't create new problems
- **Prerequisite Tree**: Identify obstacles and intermediate goals
- **Transition Tree**: Plan step-by-step implementation

**When to Use Theory of Constraints:**
- Performance bottlenecks
- System throughput issues
- Resource contention problems
- Complex system interactions
- Multi-component coordination failures

### Systems Thinking

**Causal Loop Diagrams:**
- Map feedback loops in system
- Identify reinforcing (+) and balancing (-) loops
- Find leverage points for intervention

**Stock and Flow:**
- Understand accumulations (stock) and rates of change (flow)
- Identify where delays cause issues
- Find points where system behavior changes

**Mental Models:**
- Uncover hidden assumptions
- Challenge conventional thinking
- Find alternative perspectives

**Leverage Points:**
- Places to intervene in system
- Deep leverage points (high impact, hard to change)
- Shallow leverage points (low impact, easy to change)

**When to Use Systems Thinking:**
- Complex, interconnected problems
- Recurring issues that keep returning
- System-wide performance problems
- Emergent behaviors
- Unintended consequences

## Framework Selection Guide

| Problem Type | Recommended Framework |
|--------------|----------------------|
| Technical conflict/incompatibility | TRIZ (40 Principles) |
| System bottleneck/throughput | Theory of Constraints (5 Focusing Steps) |
| Complex system with feedback loops | Systems Thinking (Causal Loops) |
| Root cause in deep call stack | Root Cause Tracing (Phase 1) |
| Pattern mismatch vs reference | Pattern Analysis (Phase 2) |
| Unknown cause, multiple variables | Hypothesis Testing (Phase 3) |
| 3+ fixes failed | Question Architecture (Phase 4, Step 5) |

## Supporting Files

The skill references these supporting techniques:

- **root-cause-tracing.md** - Complete backward tracing technique for bugs deep in call stack
- **defense-in-depth.md** - Four-layer validation pattern
- **condition-based-waiting.md** - Replacing arbitrary timeouts with condition polling
- **condition-based-waiting-example.ts** - Complete implementation with domain-specific helpers
- **find-polluter.sh** - Bisection script to identify which test causes pollution

## Quick Reference

| Phase | Key Activities | Success Criteria |
|-------|---------------|------------------|
| **1. Root Cause** | Read errors, reproduce, check changes, gather evidence | Understand WHAT and WHY |
| **2. Pattern** | Find working examples, compare | Identify differences |
| **3. Hypothesis** | Form theory, test minimally | Confirmed or new hypothesis |
| **4. Implementation** | Create test, fix, verify | Bug resolved, tests pass |

## Related Skills

- **opsis-mode-enforcer** - For mode enforcement rules and Iron Laws
- **opsis-verification-gate** - For verification procedures and evidence requirements
- **opsis-test-driven-development** - For creating failing test case (Phase 4, Step 1)
- **opsis-verification-before-completion** - Verify fix worked before claiming success
