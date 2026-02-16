---
name: opsis-activation-log
description: Standard activation logging format for all Opsis skills. Provides templates and rules for logging when skills are activated.
license: Apache-2.0
---

# opsis-activation-log

Standard activation logging format for all Opsis skills.

## When to Use

**Log activation EVERY time a skill is activated via `skills---activate_skill`.**

## Standard Format

```
🔧 SKILL ACTIVATED: {skill-name}
📅 Timestamp: {ISO timestamp}
🎯 Trigger: {what caused activation}
📋 Context: {brief context}
🔗 Previous Skill: {if chained}
```

## Field Definitions

| Field | Description | Example |
|-------|-------------|---------|
| `skill-name` | Exact skill ID | `opsis-implement` |
| `Timestamp` | ISO 8601 UTC | `2026-02-10T15:30:45Z` |
| `Trigger` | What caused activation | `User request: "Fix tests"` |
| `Context` | Situation summary | `3 test failures in auth module` |
| `Previous Skill` | Chain source | `opsis-systematic-debugging` |

## Examples

**Direct request:**
```
🔧 SKILL ACTIVATED: opsis-implement
📅 Timestamp: 2026-02-10T15:30:45Z
🎯 Trigger: User request: "Implement auth system"
📋 Context: PRD complete, 7 tasks in plan
🔗 Previous Skill: (none)
```

**Classifier routing:**
```
🔧 SKILL ACTIVATED: opsis-start
📅 Timestamp: 2026-02-10T15:35:22Z
🎯 Trigger: Classifier: Type 1 - Discovery
📋 Context: User exploring analytics dashboard idea
🔗 Previous Skill: (none)
```

**Auto-routing:**
```
🔧 SKILL ACTIVATED: opsis-systematic-debugging
📅 Timestamp: 2026-02-10T15:42:18Z
🎯 Trigger: Auto-routing: Bug detected
📋 Context: Null pointer in payment module
🔗 Previous Skill: (none)
```

**Skill chaining:**
```
🔧 SKILL ACTIVATED: opsis-plan
📅 Timestamp: 2026-02-10T15:50:33Z
🎯 Trigger: PRD complete, task breakdown next
📋 Context: Auth system PRD (12 features)
🔗 Previous Skill: opsis-prd
```

## Critical Rules

- **MANDATORY** for all skill activations
- Log BEFORE following skill instructions
- **Exception:** `using-opsis` itself (meta-skill)
- Include ALL required fields
- Use consistent format

## Integration

With Workflow Type Classifier:
1. Log classification
2. Log activation

With Auto-Routing:
1. Log routing decision
2. Log activation

## Need More Detail?

**Invoke `opsis-activation-examples` for:**
- Detailed examples for every scenario
- User request examples
- Classifier routing examples
- Auto-routing examples
- Skill chaining examples
- Field guidelines

## Success Metrics

- 100% of activations logged
- All required fields present
- Format consistent
- Timestamps accurate