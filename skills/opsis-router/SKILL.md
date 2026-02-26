---
name: opsis-router
description: "Classify user requests into 7 workflow types and auto-route to appropriate Opsis skill. Type 1-3: Discovery/Planning, Type 4: Implementation, Type 5: Debugging, Type 6: Verification, Type 7: Ideation."
license: Apache-2.0
---

# Opsis Router

Classify user requests into 7 workflow types and auto-route to appropriate Opsis skill.

## When to Use

**Before activating ANY skill, classify the request type and route accordingly.**

## The 7 Workflow Types

| Type | Name | Triggers | Entry Skill |
|------|------|----------|-------------|
| **1** | Discovery | "I have an idea...", "explore", "what if" | `opsis-start` |
| **2** | Requirements | "Create PRD", "requirements", "specs" | `opsis-prd` |
| **3** | Task Breakdown | "Break into tasks", "implementation plan" | `opsis-plan` |
| **4** | Implementation | "Implement", "build", "fix", "add" | Via Decision Point Gate |
| **5** | Debugging | "Bug", "error", "crash", "failing" | `opsis-systematic-debugging` |
| **6** | Verification | "Verify", "review", "check quality" | `opsis-verify` |
| **7** | Ideation | "Brainstorm", "generate ideas", "think of" | `opsis-brainstorming` |

## Type 1 - Discovery

**Keywords:** explore, discover, thinking about, what if, idea

**Action:** `opsis-start` → `opsis-summarize` → `opsis-prd`

**Example:**
```
User: "I have an idea for a new dashboard feature"
Route: opsis-start
```

## Type 2 - Requirements

**Keywords:** PRD, requirements, user stories, acceptance criteria, specs

**Action:** `opsis-prd`

**Example:**
```
User: "Create a PRD for the authentication system"
Route: opsis-prd
```

## Type 3 - Task Breakdown

**Keywords:** break down, tasks, implementation plan

**Precondition:** PRD exists

**Action:** `opsis-plan`

**Example:**
```
User: "Break this PRD into implementation tasks"
Route: opsis-plan
```

## Type 4 - Implementation

**Keywords:** implement, build, fix, add, proceed with, continue

**Action:** Complete Decision Point Gate → appropriate implementation skill

### Implementation Routing Logic

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

### Implementation Routing Rules

| Condition | Action | Skill |
|-----------|--------|-------|
| Bug keywords | Debug first | `opsis-systematic-debugging` |
| Multiple independent failures | Parallel investigation | `opsis-dispatching-parallel-agents` |
| "all" + tasks > 10 | Two-stage review | `opsis-two-stage-review-execution` |
| "all" + tasks ≤ 10 | Direct execution | `opsis-implement` |
| Specific task | Single task | `opsis-implement` |

### Bug Detection Keywords

**Keywords:** bug, error, failure, crash, not working, broken, fix, stack trace, exception, test failing

**Examples:**
```
User: "Fix the bug in the payment module"
Route: opsis-systematic-debugging

User: "Tests are failing with NullPointerException"
Route: opsis-systematic-debugging
```

### Implementation Examples

**Large project (all tasks):**
```
User: "Proceed with all 54 tasks"
Route: opsis-two-stage-review-execution
```

**Small project (all tasks):**
```
User: "Implement all 7 tasks"
Route: opsis-implement
```

**Specific task:**
```
User: "Implement task 3: Create API client"
Route: opsis-implement
```

## Type 5 - Debugging

**Keywords:** bug, error, crash, failure, test failing, not working, broken, exception, stack trace

**Action:** `opsis-systematic-debugging`

**Example:**
```
User: "The app crashes when I try to login"
Route: opsis-systematic-debugging
```

## Type 6 - Verification

**Keywords:** verify, review, check quality, audit, validate

**Action:** `opsis-verify` (spec-driven) or `opsis-review` (code quality)

**Example:**
```
User: "Verify the implementation meets requirements"
Route: opsis-verify

User: "Review the code for quality issues"
Route: opsis-review
```

## Type 7 - Ideation

**Keywords:** brainstorm, generate ideas, think of, explore solutions

**Action:** `opsis-brainstorming`

**Example:**
```
User: "Brainstorm ways to improve the search feature"
Route: opsis-brainstorming
```

## Quick Reference Table

| User Says | Type | Route To |
|-----------|------|----------|
| "I have an idea for X" | 1 Discovery | `opsis-start` |
| "Create a PRD for X" | 2 Requirements | `opsis-prd` |
| "Break down into tasks" | 3 Task Breakdown | `opsis-plan` |
| "Implement X" | 4 Implementation | Decision Point Gate |
| "Fix this bug" | 4 Implementation → Bug | `opsis-systematic-debugging` |
| "Proceed with all tasks" | 4 Implementation → All | Decision Point Gate |
| "Verify the code" | 6 Verification | `opsis-verify` |
| "Review for quality" | 6 Verification | `opsis-review` |
| "Brainstorm ideas" | 7 Ideation | `opsis-brainstorming` |

## Decision Point Gate

For Type 4 (Implementation), you MUST complete the Decision Point Gate before proceeding.

**See `using-opsis` for the complete Decision Point Gate template.**

## Integration

This router is used by:
- **using-opsis** - Entry point for all Opsis workflows
- **opsis-mode-enforcer** - Mode-specific routing validation
- **opsis-compact-recovery** - Restoring workflow state

## Remember

- Always classify the request type before activating any skill
- Use the Decision Point Gate for Type 4 (Implementation) requests
- Follow the routing logic to choose the appropriate implementation skill
- Bug detection takes priority in Type 4 requests
