---
name: opsis-router
description: Auto-routing logic for Type 4 (Implementation) requests. Routes to appropriate skill based on task count, bug detection, and scope.
license: Apache-2.0
---

# opsis-router

Auto-routing logic for Type 4 (Implementation) requests.

## When to Use

**After Workflow Type Classifier identifies Type 4 (Implementation).**

## Routing Logic

```
Implementation Request
        │
        ▼
Bug detected? ──YES──► opsis-systematic-debugging
        │ NO
        ▼
Multiple failures ──YES──► opsis-dispatching-parallel-agents
  across domains?         │
        │ NO              │
        ▼                 │
User says "all"? ◄────────┘
        │
   YES ─┴──► tasks > 10? ──YES──► opsis-two-stage-review-execution
        │           │ NO
        │           ▼
        │    opsis-implement
        ▼ (NO)
User says specific task ──► opsis-implement (single task)
```

## Routing Rules

| Condition | Action | Skill |
|-----------|--------|-------|
| Bug keywords | Debug first | `opsis-systematic-debugging` |
| Multiple independent failures | Parallel investigation | `opsis-dispatching-parallel-agents` |
| "all" + tasks > 10 | Two-stage review | `opsis-two-stage-review-execution` |
| "all" + tasks ≤ 10 | Direct execution | `opsis-implement` |
| Specific task | Single task | `opsis-implement` |

## Bug Detection

**Keywords:** bug, error, failure, crash, not working, broken, fix, stack trace, exception, test failing

**Action:** Route to `opsis-systematic-debugging` first.

## Task Count Routing

```bash
# Read tasks.md
task_count=$(grep -c "^- \[ \]" tasks.md)

if [ "$task_count" -gt 10 ]; then
    route_to="opsis-two-stage-review-execution"
else
    route_to="opsis-implement"
fi
```

## Logging

```
[AUTO-ROUTE] {condition} → {skill}
Example: [AUTO-ROUTE] Bug detected → opsis-systematic-debugging
```

## Integration

- `using-opsis` - Uses this router after Type 4 classification
- `opsis-workflow-classifier` - Provides Type 4 trigger
- Target skills - Execute after routing

## Need More Detail?

**Invoke `opsis-routing-guide` for:**
- Complete routing flow diagrams
- Detailed threshold explanations
- Exception handling patterns
- Edge case resolution
- Logging formats

## Success Metrics

- Correct skill selected for context
- No manual override needed
- User workflow proceeds smoothly