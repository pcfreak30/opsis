---
name: opsis-classification-guide
description: Detailed classification guide with full trigger lists, edge cases, and decision algorithms for the 7 workflow types.
license: Apache-2.0
---

# opsis-classification-guide

Detailed workflow type classification guide.

## When to Use

**Reference when:**
- Classifying ambiguous requests
- Handling edge cases
- Need full trigger list
- Training on classification

## Type 1: Discovery & Planning

### Full Trigger List

**Exploration Keywords:**
- "I have an idea...", "What if we...", "Thinking about..."
- "Explore", "discover", "brainstorm ideas", "ideation"
- "Not sure how to start", "need help figuring out"
- "What would it take to...", "How could we..."

**Question Patterns:**
- Questions about possibilities, alternatives, options
- Conversational exploration with multiple topics
- Vague or undefined requirements

### Decision Algorithm

```
Is the idea vague or undefined?
├─→ YES → opsis-start
│         └─→ After conversation → opsis-summarize
│                └─→ If ready for PRD → opsis-prd
└─→ NO → Check other types
```

### Edge Cases

| Ambiguous Input | Classification | Action |
|-----------------|----------------|--------|
| "Let's discuss X" | Type 1 | Start with exploration |
| "I want to build something" | Type 1 | Needs discovery |
| "What are the options for..." | Type 1 | Exploration needed |

## Type 2: Requirements Structuring

### Full Trigger List

**Documentation Keywords:**
- "Create a PRD", "write requirements", "specify requirements"
- "Define the features", "what should it do?"
- "User stories", "acceptance criteria", "functional requirements"
- "How should this work?", "What are the requirements?"

**Planning Keywords:**
- "Plan out the requirements", "structure the requirements"
- "What do we need to build?"

### Decision Algorithm

```
Is there a clear feature/concept that needs requirements documentation?
├─→ YES → opsis-prd
└─→ NO → Check Type 1 (Discovery) first
```

### Edge Cases

| Ambiguous Input | Classification | Action |
|-----------------|----------------|--------|
| "Document the API" | Type 2 | Requirements needed |
| "Write specs for X" | Type 2 | PRD creation |
| "What should this feature do?" | Type 2 | Requirements discovery |

## Type 3: Task Breakdown

### Full Trigger List

**Planning Keywords:**
- "Break down into tasks", "create tasks", "task breakdown"
- "Implementation plan", "how to implement", "step-by-step"
- "What needs to be done?", "task list", "action items"
- "Plan the implementation", "create an implementation plan"

### Decision Algorithm

```
Does a PRD or requirements document exist?
├─→ YES → opsis-plan
└─→ NO → Check Type 2 (Requirements) first
```

### Edge Cases

| Ambiguous Input | Classification | Action |
|-----------------|----------------|--------|
| "How do we build this?" + PRD exists | Type 3 | Task breakdown |
| "What are the steps?" + PRD exists | Type 3 | Create tasks |
| "Create a roadmap" + PRD exists | Type 3 | opsis-plan |

## Type 4: Implementation

### Full Trigger List

**Action Keywords:**
- "Implement", "build", "create", "add feature", "fix bug"
- "Proceed with", "continue with", "start working on"
- "Make these changes", "update the code", "refactor"

**Technical Keywords:**
- Specific technical work: "add function", "modify class", "update API"
- "Fix this issue", "resolve the bug", "address the problem"
- "All tasks", "each task", "complete the tasks"

### Decision Algorithm

```
Is this implementation work?
├─→ YES → Complete Decision Point Gate
│         ├─→ Bug detected? → opsis-systematic-debugging
│         ├─→ Multiple independent failures? → opsis-dispatching-parallel-agents
│         ├─→ Want two-stage review? → opsis-two-stage-review-execution
│         └─→ Direct execution? → opsis-implement
└─→ NO → Check other types
```

### Edge Cases

| Ambiguous Input | Classification | Action |
|-----------------|----------------|--------|
| "Fix the bug" | Type 5 (Debug) | Not Type 4 |
| "Build X" + no PRD | Type 2 first | Then Type 4 |
| "Refactor the code" + tasks exist | Type 4 | opsis-implement |

## Type 5: Debugging

### Full Trigger List

**Error Keywords:**
- "Bug", "error", "failure", "crash", "not working"
- "Test failing", "tests don't pass", "broken test"
- "Performance problem", "slow", "timeout", "memory leak"

**Investigation Keywords:**
- "Unexpected behavior", "wrong output", "incorrect result"
- "Why is this happening?", "investigate the issue"
- "Debug", "troubleshoot", "diagnose"
- Stack traces, error messages, unexpected exceptions

### Decision Algorithm

```
Is there a bug, failure, or unexpected behavior?
├─→ YES → opsis-systematic-debugging
│         └─→ After root cause → May invoke Type 4 for fixes
└─→ NO → Check other types
```

### Edge Cases

| Ambiguous Input | Classification | Action |
|-----------------|----------------|--------|
| "The tests are failing" | Type 5 | Debugging |
| "Something's wrong with..." | Type 5 | Investigation |
| "Why is this slow?" | Type 5 | Performance debugging |

## Type 6: Verification

### Full Trigger List

**Assessment Keywords:**
- "Verify", "review", "check quality"
- "Audit", "validate", "inspect"
- "Does this meet requirements?"
- "Code review", "PR review"

### Decision Algorithm

```
Is this quality assessment or requirements verification?
├─→ YES → opsis-verify
└─→ NO → Check other types
```

### Edge Cases

| Ambiguous Input | Classification | Action |
|-----------------|----------------|--------|
| "Review the changes" | Type 6 | Code review |
| "Does this match the PRD?" | Type 6 | Verification |
| "Check if this is correct" | Type 6 | Validation |

## Type 7: Ideation

### Full Trigger List

**Creativity Keywords:**
- "Brainstorm", "generate ideas", "think of"
- "Creative solutions", "innovative approaches"
- "What are some ideas for..."

### Decision Algorithm

```
Is this creative ideation without specific implementation?
├─→ YES → opsis-brainstorming
└─→ NO → Check Type 1 (Discovery)
```

### Edge Cases

| Ambiguous Input | Classification | Action |
|-----------------|----------------|--------|
| "Brainstorm features" | Type 7 | Ideation |
| "Generate ideas for X" | Type 7 | Brainstorming |
| "What creative solutions exist?" | Type 7 | opsis-brainstorming |

## Conflicting Classifications

### Priority Order

When input matches multiple types:

1. **Type 5 (Debugging)** - Always first if error keywords present
2. **Type 7 (Ideation)** - If purely creative
3. **Type 1 (Discovery)** - If vague/undefined
4. **Type 2 (Requirements)** - If needs documentation
5. **Type 3 (Task Breakdown)** - If PRD exists
6. **Type 4 (Implementation)** - If clear action
7. **Type 6 (Verification)** - If assessment

### Examples

| Input | Matches | Priority | Result |
|-------|---------|----------|--------|
| "Fix the bug in the new feature" | Type 4, Type 5 | Type 5 | Debug first |
| "Brainstorm ideas for the dashboard" | Type 1, Type 7 | Type 7 | Ideation |
| "Implement the feature we discussed" | Type 1, Type 4 | Type 1 | Clarify first |