---
name: opsis-activation-log
description: Standard activation logging format for all Opsis skills. Provides templates, rules, and detailed examples for logging when skills are activated.
license: Apache-2.0
---

# Opsis Activation Log

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

### PRD Creation

```
🔧 SKILL ACTIVATED: opsis-prd
📅 Timestamp: 2026-02-10T10:45:12Z
🎯 Trigger: User request: "Create a PRD for the API"
📋 Context: Requirements gathering phase
🔗 Previous Skill: opsis-start
```

### Task Breakdown

```
🔧 SKILL ACTIVATED: opsis-plan
📅 Timestamp: 2026-02-10T11:30:00Z
🎯 Trigger: PRD complete, user approved
📋 Context: Breaking down requirements into implementation tasks
🔗 Previous Skill: opsis-prd
```

### Verification

```
🔧 SKILL ACTIVATED: opsis-verify
📅 Timestamp: 2026-02-10T16:45:30Z
🎯 Trigger: Implementation complete
📋 Context: All 7 tasks marked complete, verifying requirements coverage
🔗 Previous Skill: opsis-implement
```

### Code Review

```
🔧 SKILL ACTIVATED: opsis-review
📅 Timestamp: 2026-02-10T17:00:15Z
🎯 Trigger: User request: "Review the code for quality"
📋 Context: 450 lines changed across 12 files
🔗 Previous Skill: opsis-verify
```

### Brainstorming

```
🔧 SKILL ACTIVATED: opsis-brainstorming
📅 Timestamp: 2026-02-10T13:20:45Z
🎯 Trigger: User request: "Brainstorm search feature ideas"
📋 Context: Exploring 10+ ideation techniques
🔗 Previous Skill: (none)
```

### Two-Stage Review Execution

```
🔧 SKILL ACTIVATED: opsis-two-stage-review-execution
📅 Timestamp: 2026-02-10T12:00:00Z
🎯 Trigger: Decision Point Gate selection
📋 Context: 54 tasks, user said "all", need quality gates
🔗 Previous Skill: opsis-plan
```

### Parallel Dispatching

```
🔧 SKILL ACTIVATED: opsis-dispatching-parallel-agents
📅 Timestamp: 2026-02-10T14:00:00Z
🎯 Trigger: Multiple independent test failures
📋 Context: 5 failing tests across different modules (auth, api, ui)
🔗 Previous Skill: (none)
```

### Compact Recovery

```
🔧 SKILL ACTIVATED: opsis-compact-recovery
📅 Timestamp: 2026-02-10T18:30:00Z
🎯 Trigger: Detected conversation compact
📋 Context: Restoring workflow state from artifacts
🔗 Previous Skill: (none)
```

### Mode Enforcement

```
🔧 SKILL ACTIVATED: opsis-mode-enforcer
📅 Timestamp: 2026-02-10T09:00:00Z
🎯 Trigger: using-opsis activation
📋 Context: Establishing mode boundaries and permissions
🔗 Previous Skill: using-opsis
```

### Archiving

```
🔧 SKILL ACTIVATED: opsis-archive
📅 Timestamp: 2026-02-10T19:00:00Z
🎯 Trigger: User request: "Archive this project"
📋 Context: All tasks complete, verification passed
🔗 Previous Skill: opsis-finishing-a-development-branch
```

### Summarization

```
🔧 SKILL ACTIVATED: opsis-summarize
📅 Timestamp: 2026-02-10T10:00:00Z
🎯 Trigger: Conversation complete, extracting requirements
📋 Context: 23 messages covering feature exploration
🔗 Previous Skill: opsis-start
```

### Refinement

```
🔧 SKILL ACTIVATED: opsis-refine
📅 Timestamp: 2026-02-10T11:00:00Z
🎯 Trigger: User request: "Update the PRD with new requirements"
📋 Context: Adding OAuth2 support to existing PRD
🔗 Previous Skill: opsis-prd
```

### Improvement

```
🔧 SKILL ACTIVATED: opsis-improve
📅 Timestamp: 2026-02-10T11:30:00Z
🎯 Trigger: User request: "Optimize this prompt"
📋 Context: Improving clarity and specificity of task description
🔗 Previous Skill: (none)
```

### Finishing Branch

```
🔧 SKILL ACTIVATED: opsis-finishing-a-development-branch
📅 Timestamp: 2026-02-10T20:00:00Z
🎯 Trigger: Implementation complete, tests passing
📋 Context: Presenting merge/PR/cleanup options
🔗 Previous Skill: opsis-verify
```

### Executing Plans

```
🔧 SKILL ACTIVATED: opsis-executing-plans
📅 Timestamp: 2026-02-10T12:00:00Z
🎯 Trigger: User request: "Execute plan in separate session"
📋 Context: 15 tasks, batch execution with human checkpoints
🔗 Previous Skill: opsis-plan
```

### Test-Driven Development

```
🔧 SKILL ACTIVATED: opsis-test-driven-development
📅 Timestamp: 2026-02-10T14:00:00Z
🎯 Trigger: Writing production code
📋 Context: Enforcing RED-GREEN-REFACTOR cycle
🔗 Previous Skill: (none)
```

## Classifier Routing Examples

### Type 1 - Discovery Routing

```
🔧 SKILL ACTIVATED: opsis-start
📅 Timestamp: 2026-02-10T09:15:33Z
🎯 Trigger: Classifier: Type 1 - Discovery
📋 Context: User said "I have an idea for a dashboard"
🔗 Previous Skill: using-opsis
```

### Type 2 - Requirements Routing

```
🔧 SKILL ACTIVATED: opsis-prd
📅 Timestamp: 2026-02-10T10:45:12Z
🎯 Trigger: Classifier: Type 2 - Requirements
📋 Context: User said "Create a PRD for the API"
🔗 Previous Skill: using-opsis
```

### Type 3 - Task Breakdown Routing

```
🔧 SKILL ACTIVATED: opsis-plan
📅 Timestamp: 2026-02-10T11:30:00Z
🎯 Trigger: Classifier: Type 3 - Task Breakdown
📋 Context: User said "Break down into tasks"
🔗 Previous Skill: using-opsis
```

### Type 4 - Implementation Routing

```
🔧 SKILL ACTIVATED: opsis-two-stage-review-execution
📅 Timestamp: 2026-02-10T12:00:00Z
🎯 Trigger: Classifier: Type 4 - Implementation + Decision Point Gate
📋 Context: 54 tasks, user said "all", quality gates needed
🔗 Previous Skill: opsis-plan
```

### Type 5 - Debugging Routing

```
🔧 SKILL ACTIVATED: opsis-systematic-debugging
📅 Timestamp: 2026-02-10T14:22:18Z
🎯 Trigger: Classifier: Type 5 - Debugging
📋 Context: User said "Fix the crash in payment module"
🔗 Previous Skill: using-opsis
```

### Type 6 - Verification Routing

```
🔧 SKILL ACTIVATED: opsis-verify
📅 Timestamp: 2026-02-10T16:45:30Z
🎯 Trigger: Classifier: Type 6 - Verification
📋 Context: User said "Verify the implementation"
🔗 Previous Skill: using-opsis
```

### Type 7 - Ideation Routing

```
🔧 SKILL ACTIVATED: opsis-brainstorming
📅 Timestamp: 2026-02-10T13:20:45Z
🎯 Trigger: Classifier: Type 7 - Ideation
📋 Context: User said "Brainstorm search feature ideas"
🔗 Previous Skill: using-opsis
```

## Skill Chain Examples

### Full Planning Chain

```
🔧 SKILL ACTIVATED: opsis-start
📅 Timestamp: 2026-02-10T09:15:33Z
🎯 Trigger: User request: "I have an idea for a dashboard"
📋 Context: Vague idea, needs exploration
🔗 Previous Skill: using-opsis

🔧 SKILL ACTIVATED: opsis-summarize
📅 Timestamp: 2026-02-10T10:00:00Z
🎯 Trigger: Conversation complete, extracting requirements
📋 Context: 23 messages covering feature exploration
🔗 Previous Skill: opsis-start

🔧 SKILL ACTIVATED: opsis-prd
📅 Timestamp: 2026-02-10T10:45:12Z
🎯 Trigger: Requirements extracted from conversation
📋 Context: Creating comprehensive PRD from exploration
🔗 Previous Skill: opsis-summarize

🔧 SKILL ACTIVATED: opsis-plan
📅 Timestamp: 2026-02-10T11:30:00Z
🎯 Trigger: PRD complete, user approved
📋 Context: Breaking down requirements into implementation tasks
🔗 Previous Skill: opsis-prd
```

### Full Implementation Chain

```
🔧 SKILL ACTIVATED: opsis-two-stage-review-execution
📅 Timestamp: 2026-02-10T12:00:00Z
🎯 Trigger: Decision Point Gate selection
📋 Context: 54 tasks, user said "all", need quality gates
🔗 Previous Skill: opsis-plan

🔧 SKILL ACTIVATED: opsis-verify
📅 Timestamp: 2026-02-10T16:45:30Z
🎯 Trigger: Implementation complete
📋 Context: All 54 tasks marked complete, verifying requirements coverage
🔗 Previous Skill: opsis-two-stage-review-execution

🔧 SKILL ACTIVATED: opsis-review
📅 Timestamp: 2026-02-10T17:00:15Z
🎯 Trigger: Verification passed, code review requested
📋 Context: 2847 lines changed across 87 files
🔗 Previous Skill: opsis-verify
```

### Debugging Chain

```
🔧 SKILL ACTIVATED: opsis-systematic-debugging
📅 Timestamp: 2026-02-10T14:22:18Z
🎯 Trigger: User request: "Fix the crash in payment module"
📋 Context: Stack trace provided, null pointer exception
🔗 Previous Skill: using-opsis

🔧 SKILL ACTIVATED: opsis-implement
📅 Timestamp: 2026-02-10T15:00:00Z
🎯 Trigger: Root cause identified, fix implemented
📋 Context: Adding null check to payment processor
🔗 Previous Skill: opsis-systematic-debugging

🔧 SKILL ACTIVATED: opsis-verify
📅 Timestamp: 2026-02-10T15:30:00Z
🎯 Trigger: Fix implemented, re-verification required
📋 Context: Running tests to confirm bug fix
🔗 Previous Skill: opsis-implement
```

## Remember

- Log activation EVERY time a skill is activated
- Include all required fields: skill-name, timestamp, trigger, context, previous skill
- Use ISO 8601 UTC format for timestamps
- Provide enough context to understand why the skill was activated
- Track skill chains to understand workflow progression
