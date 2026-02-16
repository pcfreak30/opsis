---
name: opsis-workflow-classifier
description: "Classify user requests into 7 workflow types to determine which Opsis skill to invoke. Type 1-3: Discovery/Planning, Type 4: Implementation, Type 5: Debugging, Type 6: Verification, Type 7: Ideation."
license: Apache-2.0
---

# opsis-workflow-classifier

Classify user requests to determine which Opsis skill to invoke.

## When to Use

**Before activating ANY skill, classify the request type.**

## The 7 Types

| Type | Name | Triggers | Entry Skill |
|------|------|----------|-------------|
| **1** | Discovery | "I have an idea...", "explore", "what if" | `opsis-start` |
| **2** | Requirements | "Create PRD", "requirements", "specs" | `opsis-prd` |
| **3** | Task Breakdown | "Break into tasks", "implementation plan" | `opsis-plan` |
| **4** | Implementation | "Implement", "build", "fix", "add" | Via Decision Point Gate |
| **5** | Debugging | "Bug", "error", "crash", "failing" | `opsis-systematic-debugging` |
| **6** | Verification | "Verify", "review", "check quality" | `opsis-verify` |
| **7** | Ideation | "Brainstorm", "generate ideas", "think of" | `opsis-brainstorming` |

## Quick Reference

**Type 1 - Discovery:**
- Keywords: explore, discover, thinking about, what if
- Action: `opsis-start` → `opsis-summarize` → `opsis-prd`

**Type 2 - Requirements:**
- Keywords: PRD, requirements, user stories, acceptance criteria
- Action: `opsis-prd`

**Type 3 - Task Breakdown:**
- Keywords: break down, tasks, implementation plan
- Precondition: PRD exists
- Action: `opsis-plan`

**Type 4 - Implementation:**
- Keywords: implement, build, fix, add, proceed with
- Action: Decision Point Gate → appropriate implementation skill

**Type 5 - Debugging:**
- Keywords: bug, error, crash, failure, test failing
- Action: `opsis-systematic-debugging`

**Type 6 - Verification:**
- Keywords: verify, review, check, assess quality
- Action: `opsis-verify`

**Type 7 - Ideation:**
- Keywords: brainstorm, generate ideas, creative solutions
- Action: `opsis-brainstorming`

## Classification Process

```
User message
      │
      ▼
Match against 7 types
      │
      ▼
Identify entry skill
      │
      ▼
Invoke skill immediately
```

## Logging

Log classification before activation:

```
[CLASSIFICATION]
Type: {1-7} - {name}
Triggers: {matched keywords}
Entry: {skill}
```

## Integration

- `using-opsis` - Uses this classifier on every request
- `opsis-coordinator` - Delegates classification when needed
- All skills - Log activation after classification

## Need More Detail?

**Invoke `opsis-classification-guide` for:**
- Full trigger lists for all 7 types
- Edge case handling
- Conflicting classification resolution
- Decision algorithms
- Priority ordering