---
name: opsis-activation-examples
description: Detailed activation log examples for all scenarios. Reference when logging skill activations.
license: Apache-2.0
---

# opsis-activation-examples

Detailed activation logging examples.

## When to Use

**Reference when:**
- Logging skill activation
- Need example for specific scenario
- Formatting activation log

## User Request Examples

### Feature Implementation

```
🔧 SKILL ACTIVATED: opsis-implement
📅 Timestamp: 2026-02-10T15:30:45Z
🎯 Trigger: User request: "Implement user authentication system"
📋 Context: PRD complete, 7 tasks in implementation plan
🔗 Previous Skill: (none)
```

### Bug Fix

```
🔧 SKILL ACTIVATED: opsis-systematic-debugging
📅 Timestamp: 2026-02-10T14:22:18Z
🎯 Trigger: User request: "Fix the crash in payment module"
📋 Context: Stack trace provided, null pointer exception
🔗 Previous Skill: (none)
```

### Discovery

```
🔧 SKILL ACTIVATED: opsis-start
📅 Timestamp: 2026-02-10T09:15:33Z
🎯 Trigger: User request: "I have an idea for a dashboard"
📋 Context: Vague idea, needs exploration
🔗 Previous Skill: (none)
```

## Classifier Routing Examples

### Type 1: Discovery

```
🔧 SKILL ACTIVATED: opsis-start
📅 Timestamp: 2026-02-10T15:35:22Z
🎯 Trigger: Classifier: Type 1 - Discovery
📋 Context: User exploring analytics dashboard idea
🔗 Previous Skill: (none)
```

### Type 4: Implementation

```
🔧 SKILL ACTIVATED: opsis-implement
📅 Timestamp: 2026-02-10T16:45:11Z
🎯 Trigger: Classifier: Type 4 - Implementation
📋 Context: User wants to add API endpoints
🔗 Previous Skill: (none)
```

### Type 5: Debugging

```
🔧 SKILL ACTIVATED: opsis-systematic-debugging
📅 Timestamp: 2026-02-10T17:20:05Z
🎯 Trigger: Classifier: Type 5 - Debugging
📋 Context: Test failures in auth module
🔗 Previous Skill: (none)
```

## Auto-Routing Examples

### Bug Detected

```
🔧 SKILL ACTIVATED: opsis-systematic-debugging
📅 Timestamp: 2026-02-10T15:42:18Z
🎯 Trigger: Auto-routing: Bug detected
📋 Context: Crash in payment module - null pointer exception
🔗 Previous Skill: (none)
```

### Large Project

```
🔧 SKILL ACTIVATED: opsis-two-stage-review-execution
📅 Timestamp: 2026-02-10T11:30:00Z
🎯 Trigger: Auto-routing: Large project (54 tasks)
📋 Context: Full system implementation, needs quality gates
🔗 Previous Skill: (none)
```

### Parallel Failures

```
🔧 SKILL ACTIVATED: opsis-dispatching-parallel-agents
📅 Timestamp: 2026-02-10T13:10:45Z
🎯 Trigger: Auto-routing: Multiple independent failures
📋 Context: Errors in auth, payment, and notification modules
🔗 Previous Skill: (none)
```

## Skill Chaining Examples

### PRD → Plan

```
🔧 SKILL ACTIVATED: opsis-plan
📅 Timestamp: 2026-02-10T15:50:33Z
🎯 Trigger: PRD complete, proceeding to task breakdown
📋 Context: Full PRD for auth system (12 features, 5 constraints)
🔗 Previous Skill: opsis-prd
```

### Debug → Implement

```
🔧 SKILL ACTIVATED: opsis-implement
📅 Timestamp: 2026-02-10T16:05:22Z
🎯 Trigger: Root cause identified, implementing fix
📋 Context: Bug caused by missing null check in processPayment()
🔗 Previous Skill: opsis-systematic-debugging
```

### Plan → Implement

```
🔧 SKILL ACTIVATED: opsis-implement
📅 Timestamp: 2026-02-10T10:20:15Z
🎯 Trigger: Task breakdown complete, ready for implementation
📋 Context: 7 tasks defined, starting with Task 1
🔗 Previous Skill: opsis-plan
```

## Compact Recovery Examples

### Recovery from Compact

```
🔧 SKILL ACTIVATED: using-opsis
📅 Timestamp: 2026-02-10T09:00:00Z
🎯 Trigger: Compact recovery: Resuming work from previous session
📋 Context: Detected incomplete tasks in tasks.md
🔗 Previous Skill: (none)
```

### Protocol Reload

```
🔧 SKILL ACTIVATED: using-opsis
📅 Timestamp: 2026-02-10T14:00:00Z
🎯 Trigger: User request: "Reload opsis protocol"
📋 Context: User requested protocol reload after code changes
🔗 Previous Skill: (none)
```

## using-opsis Meta-Skill

### Direct Activation

```
🔧 SKILL ACTIVATED: using-opsis
📅 Timestamp: 2026-02-10T15:25:10Z
🎯 Trigger: User request: "Continue Phase 3 Task 2"
📋 Context: Resuming work from previous session
🔗 Previous Skill: (none)
```

### Session Start

```
🔧 SKILL ACTIVATED: using-opsis
📅 Timestamp: 2026-02-10T08:30:00Z
🎯 Trigger: Session start: Initial opsis activation
📋 Context: Starting new development session
🔗 Previous Skill: (none)
```

## Field Guidelines

| Field | Max Length | Notes |
|-------|------------|-------|
| skill-name | Exact | Use skill ID exactly |
| Timestamp | ISO 8601 | UTC, include seconds |
| Trigger | 50-100 chars | Specific cause |
| Context | 100-150 chars | Current situation |
| Previous Skill | Exact or "(none)" | Chain tracking |

## Common Mistakes

| Incorrect | Correct |
|-----------|---------|
| `🔧 ACTIVATED: opsis-implement` | `🔧 SKILL ACTIVATED: opsis-implement` |
| `Time: 3:30 PM` | `📅 Timestamp: 2026-02-10T15:30:45Z` |
| `Context: Fix stuff` | `📅 Context: Bug in auth module, 3 test failures` |
| `Previous: plan skill` | `🔗 Previous Skill: opsis-plan` |