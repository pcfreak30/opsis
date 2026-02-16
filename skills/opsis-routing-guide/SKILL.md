---
name: opsis-routing-guide
description: Detailed routing guide with flow diagrams, threshold explanations, and exception handling for implementation requests.
license: Apache-2.0
---

# opsis-routing-guide

Detailed routing guide for Type 4 (Implementation) requests.

## When to Use

**Reference when:**
- Determining execution strategy
- Handling routing edge cases
- Need threshold details
- Understanding routing rationale

## Complete Routing Flow

```
START: Implementation Request
        │
        ▼
┌─────────────────────┐
│ Read tasks.md       │
│ Count total tasks   │
│ Parse user command  │
└─────────────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│ BUG DETECTED?                           │
│ (error, crash, failure keywords)        │
└─────────────────────────────────────────┘
        │                    │
       YES                   NO
        │                    │
        ▼                    ▼
┌──────────────────┐  ┌──────────────────────────────────────┐
│ opsis-systematic │  │ MULTIPLE INDEPENDENT FAILURES?       │
│ -debugging       │  │ (different files, subsystems)        │
└──────────────────┘  └──────────────────────────────────────┘
                             │                    │
                            YES                   NO
                             │                    │
                             ▼                    ▼
              ┌──────────────────────┐  ┌──────────────────────────┐
              │ opsis-dispatching-   │  │ USER SAYS "all"?         │
              │ parallel-agents      │  └──────────────────────────┘
              └──────────────────────┘           │                    │
                                               YES                   NO
                                                 │                    │
                                                 ▼                    ▼
                                   ┌─────────────────────┐  ┌──────────────────┐
                                   │ task_count > 10?    │  │ Specific task?   │
                                   └─────────────────────┘  └──────────────────┘
                                         │                    │              │
                                        YES                   NO            YES
                                         │                    │              │
                                         ▼                    ▼              ▼
                           ┌─────────────────────┐  ┌──────────────┐  ┌──────────────┐
                           │ opsis-two-stage-    │  │ opsis-       │  │ opsis-       │
                           │ review-execution    │  │ implement    │  │ implement    │
                           └─────────────────────┘  │ (small)      │  │ (single)     │
                                                    └──────────────┘  └──────────────┘
```

## Routing Rules Reference

| Detection Condition | Auto-Invoke | Threshold | Rationale |
|---------------------|-------------|-----------|-----------|
| Bug detected | opsis-systematic-debugging | Any | Debug before implement |
| Multiple independent failures | opsis-dispatching-parallel-agents | 2+ domains | Parallel investigation |
| User says "all" AND tasks > 10 | opsis-two-stage-review-execution | 11+ tasks | Large project needs quality gates |
| User says "all" AND tasks ≤ 10 | opsis-implement | 1-10 tasks | Direct execution manageable |
| User says "task N" | opsis-implement | Single task | Direct execution |
| User says "phase N" | opsis-implement | Phase-based | Sequential execution |
| No tasks.md | Ask for clarification | - | Need scope definition |

## Bug Detection Details

### Trigger Keywords

**Always route to debugging:**
- "bug", "error", "failure", "crash"
- "not working", "broken", "fix"
- "stack trace", "exception", "stacktrace"
- "test failing", "fails", "broken test"
- "null pointer", "segmentation fault"
- "timeout", "hang", "freeze"

### Action

```
IF (bug keywords detected):
    → AUTO-SWITCH to opsis-systematic-debugging
    → DO NOT implement directly
    → Invoke opsis-systematic-debugging skill immediately
    → Log: "[AUTO-ROUTE] Bug detected → opsis-systematic-debugging"
```

### Example

```
User: "Fix this crash in the payment module"
Agent: Bug detected → Auto-route to opsis-systematic-debugging
       "[AUTO-ROUTE] Bug detected → opsis-systematic-debugging"
       [Invokes opsis-systematic-debugging]
```

## Task Count Routing Details

### Threshold: 10 tasks

**Why 10?**
- Manageable for direct execution (≤10)
- Needs quality gates (>10)
- Based on average task complexity

### Logic

```
IF (user says "all" OR continuation intent):
    → Read tasks.md
    → Count total tasks
    
    IF (task_count > 10):
        → AUTO-SWITCH to opsis-two-stage-review-execution
        → Invoke immediately
        → Log: "[AUTO-ROUTE] Large project (N tasks) → opsis-two-stage-review-execution"
    
    ELSE (task_count ≤ 10):
        → Use opsis-implement (direct execution)
        → Log: "[AUTO-ROUTE] Small project (N tasks) → opsis-implement"
```

### Examples

**Large Project (54 tasks):**
```
User: "Proceed with all tasks"
Agent: Reads tasks.md → 54 tasks detected
       → Auto-route to opsis-two-stage-review-execution
       "[AUTO-ROUTE] Large project (54 tasks) → opsis-two-stage-review-execution"
```

**Small Project (7 tasks):**
```
User: "Implement all tasks"
Agent: Reads tasks.md → 7 tasks detected
       → Use opsis-implement directly
       "[AUTO-ROUTE] Small project (7 tasks) → opsis-implement"
```

## Parallel Problem Detection

### Detection Criteria

Multiple failures across:
- Different files (file A, file B, file C)
- Different subsystems (auth, payment, notifications)
- Different problem domains (database, API, frontend)
- Independent error sources

### Action

```
IF (2+ independent failures across different domains):
    → AUTO-SWITCH to opsis-dispatching-parallel-agents
    → Invoke immediately
    → Log: "[AUTO-ROUTE] Multiple failures → opsis-dispatching-parallel-agents"
```

### Examples

```
User: "Fix the auth error, payment timeout, and notification bug"
Agent: 3 independent failures detected
       → Auto-route to parallel dispatch
       "[AUTO-ROUTE] Multiple failures → opsis-dispatching-parallel-agents"
```

## Scope-Based Routing

### User Says "all"

- Read tasks.md
- Count tasks
- Route based on task_count threshold

### User Says "task N"

- Route to opsis-implement
- Execute single task directly
- No auto-routing needed

### User Says "phase N"

- Route to opsis-implement
- Execute phase sequentially
- No auto-routing needed

### No tasks.md Found

- Cannot determine scope
- Ask user for clarification
- Suggest creating tasks via opsis-plan

## Logging Format

### Auto-Route Log

```
[AUTO-ROUTE] {condition} → {skill}
Example: [AUTO-ROUTE] Bug detected → opsis-systematic-debugging
```

### After Routing

```
🔧 SKILL ACTIVATED: {skill}
📅 Timestamp: {ISO timestamp}
🎯 Trigger: Auto-routing: {condition}
📋 Context: {brief description}
🔗 Previous Skill: (none)
```

## Edge Cases

### Mixed Bug + Feature

**Input:** "Fix the auth bug and add the new feature"

**Resolution:** Debug first, then implement
```
1. Route to opsis-systematic-debugging (bug priority)
2. After fix, return to implementation
3. Route to appropriate implementation skill
```

### Large Project with Specific Task

**Input:** "Implement task 5" (in project with 54 tasks)

**Resolution:** Respect user specificity
```
1. User specified single task
2. Use opsis-implement (not two-stage-review)
3. Execute Task 5 directly
```

### Missing tasks.md

**Input:** "Proceed with all tasks" (no tasks.md)

**Resolution:** Clarify scope
```
1. Cannot determine "all" without tasks.md
2. Ask: "Should I create tasks first?"
3. Or: "Which specific tasks?"
```