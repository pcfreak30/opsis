---
name: opsis-memory-storage
description: Memory storage eligibility criteria and retrieval patterns for Opsis workflows. Store ONLY reusable, stable, actionable information.
license: Apache-2.0
---

# Memory Storage

Memory storage eligibility criteria and retrieval patterns for Opsis workflows.

## Core Principle

**Store ONLY what changes future behavior.**

Memory is NOT for:
- Task progress tracking (use TODO tools)
- Recording what happened (use git history)
- Temporary notes (use conversation context)

Memory IS for:
- Architectural decisions that guide future work
- Patterns that should be replicated
- Anti-patterns to avoid
- User preferences that affect behavior

## Activation Logging

```
MODE: Memory Management
Purpose: Applying eligibility criteria to determine what information should be stored
```

## When to Use

Use this skill when:
1. **Before starting implementation** - Retrieve workflow contracts and architectural decisions
2. **Before complex tasks** - Retrieve architectural decisions to guide implementation
3. **After debugging** - Retrieve critical findings and anti-patterns
4. **After workflow completion** - Evaluate what to store (milestones, decisions, anti-patterns)
5. **After verification passes/fails** - Store decisions or anti-patterns discovered
6. **Before chunk validation** - Consider storing successful patterns
7. **When uncertain** - Apply eligibility criteria to determine if storage is appropriate

## Tool Selection

**Available Memory Tools:**
- `memory---store_memory` - Store information with type and content
- `memory---retrieve_memory` - Retrieve memories using semantic query (3-7 descriptive words)

**Tool Usage Pattern:**
```
Retrieve: memory---retrieve_memory with query
  ↓
Query format: 3-7 descriptive words including key concepts and context
  ↓
Example: "LLM provider integration patterns"
  ↓
Store: memory---store_memory with type and content
  ↓
Type: task, code-pattern, or user-preference
```

## Preconditions

- Opsis workflow is active
- Memory tools are available
- Eligibility criteria are understood

## Postconditions

- Only eligible information is stored
- Retrieval queries use 3-7 descriptive words
- Storage types match eligibility criteria

## Success Metrics

- **No ineligible storage**: Task progress, one-off bugs, implementation details, transient notes, file lists, logs, secrets, derivable info are NEVER stored
- **High reusability**: Stored information is reusable across future tasks
- **High stability**: Stored information is unlikely to change soon
- **High actionability**: Stored information changes future behavior
- **Correct typing**: Storage type matches information category (task, code-pattern, user-preference)

## Eligibility Criteria

**Store ONLY if ALL four rules are TRUE:**

1. **Reusable across future tasks** - Can this information be used in multiple future tasks?
2. **Stable (unlikely to change soon)** - Is this information stable or will it change frequently?
3. **Actionable (changes future behavior)** - Does this information change how future tasks are executed?
4. **Type matches** - Is this one of: task, code-pattern, user-preference?

**If ANY rule is FALSE → DO NOT STORE**

## Storage Type Table

| Type | When to Store | Examples |
|------|---------------|----------|
| `task` | Workflow contracts, milestones | "PRD requirements must be testable", "Tasks must map to specific files", "Phase 3 requires 100% test coverage" |
| `code-pattern` | Architecture decisions, patterns, anti-patterns | "Use repository pattern for data access", "DTOs required for API boundaries", "Avoid direct DB access from controllers", "Never hardcode API keys" |
| `user-preference` | Strategy preferences, thresholds | "Require 100% test coverage for critical paths", "Security issues must be critical severity", "Prefer TDD over test-after" |

## When to Retrieve Memory

**Retrieve memory BEFORE:**

1. **Implementation starts** - Retrieve workflow contracts and architectural decisions
   - Query: "workflow contracts" or "implementation requirements"
   - Example: "LLM provider integration patterns"

2. **Complex tasks** - Retrieve architectural decisions to guide approach
   - Query: 3-7 descriptive words including key concepts
   - Example: "authentication flow implementation details"
   - Example: "database migration strategy patterns"

3. **After debugging** - Retrieve critical findings and anti-patterns
   - Query: "debugging findings" or related domain
   - Example: "concurrency issues patterns"

**Retrieval Query Guidelines:**
- Use 3-7 descriptive words
- Include key concepts and context
- Use natural language (describe what you're looking for)
- Example: "Voice control implementation details"
- Example: "Testing framework configuration"
- Example: "User interface theming system"

**AVOID:**
- Single words (too generic)
- Generic terms (lacks context)
- Overly brief queries (no context)

## When to Store Memory

**Store memory AFTER:**

1. **Chunk validation succeeds** - Store successful patterns
   - Type: `code-pattern`
   - Example: "Successful pattern: Use builder pattern for complex object construction"

2. **Workflow completion** - Store milestones, decisions, anti-patterns
   - Type: `task` (milestones, decisions)
   - Type: `code-pattern` (anti-patterns)
   - Example: "Milestone: Phase 3 API layer complete with 100% test coverage"
   - Example: "Anti-pattern: Direct database access from controllers"

3. **Before starting new work** - Store workflow contracts if applicable
   - Type: `task`
   - Example: "Workflow contract: All PRD requirements must be testable"

4. **Verification passes** - Store architectural decisions made during implementation
   - Type: `code-pattern`
   - Example: "Architectural decision: Use repository pattern for all data access"

5. **Verification fails** - Store anti-patterns and critical findings
   - Type: `code-pattern`
   - Example: "Anti-pattern: Missing error handling on API endpoints"

## NEVER Store List

**DO NOT store any of the following:**

- **Task progress/status** - "Task 3 is 50% complete", "Currently working on file X"
- **One-off bugs** - "Fixed typo in line 42", "Fixed null pointer in function Y"
- **Implementation details** - "How the code was written", "Specific implementation approach used"
- **Transient implementation notes** - "Temporary workaround for issue Z", "Notes for future reference"
- **File lists from a single task** - "Files changed in this task: A, B, C"
- **Logs/stack traces** - Error messages, debug output, crash reports
- **Secrets/tokens/credentials/PII** - API keys, passwords, personal data
- **Derivable information** - Anything instantly readable from a single file location

**Rationale:**
- Task progress → Use TODO tools
- One-off bugs → Use git history
- Implementation details → Use git diff
- Transient notes → Use conversation context
- File lists → Use git status
- Logs/stack traces → Use debugging tools
- Secrets → Never store
- Derivable info → Read from source

## Storage Commands

**Store Memory:**
```javascript
memory---store_memory({
  type: "task" | "code-pattern" | "user-preference",
  content: "description of information to store"
})
```

**Retrieve Memory:**
```javascript
memory---retrieve_memory({
  query: "3-7 descriptive words including key concepts and context",
  limit: 3  // optional, default 3
})
```

## Decision Framework

**Before storing, ask:**

1. **Is this reusable?** Will this help future tasks?
   - NO → Don't store
   - YES → Continue

2. **Is this stable?** Will this change soon?
   - YES → Don't store
   - NO → Continue

3. **Is this actionable?** Does this change future behavior?
   - NO → Don't store
   - YES → Continue

4. **Is the type correct?** Is this task, code-pattern, or user-preference?
   - NO → Don't store
   - YES → Store

## Examples

### ✅ Correct Storage

**Example 1: Architectural Decision**
```javascript
memory---store_memory({
  type: "code-pattern",
  content: "Use repository pattern for all data access layer implementations. All database operations must go through repository interfaces."
})
```
- ✅ Reusable: Yes, applies to all data access
- ✅ Stable: Yes, architectural decision
- ✅ Actionable: Yes, changes how data access is implemented
- ✅ Type: code-pattern

**Example 2: Anti-Pattern**
```javascript
memory---store_memory({
  type: "code-pattern",
  content: "Anti-pattern: Never access database directly from controller layer. All database access must go through repository layer."
})
```
- ✅ Reusable: Yes, applies to all controllers
- ✅ Stable: Yes, architectural rule
- ✅ Actionable: Yes, prevents future violations
- ✅ Type: code-pattern

**Example 3: User Preference**
```javascript
memory---store_memory({
  type: "user-preference",
  content: "Security issues must be marked as CRITICAL severity in verification reports. All security findings block completion."
})
```
- ✅ Reusable: Yes, applies to all verifications
- ✅ Stable: Yes, user preference
- ✅ Actionable: Yes, changes verification behavior
- ✅ Type: user-preference

**Example 4: Workflow Contract**
```javascript
memory---store_memory({
  type: "task",
  content: "All PRD requirements must be testable. Requirements without test cases are incomplete and must be refined."
})
```
- ✅ Reusable: Yes, applies to all PRDs
- ✅ Stable: Yes, workflow rule
- ✅ Actionable: Yes, changes PRD creation behavior
- ✅ Type: task

### ❌ Incorrect Storage

**Example 1: Task Progress**
```javascript
memory---store_memory({
  type: "task",
  content: "Task 3 is 50% complete. Currently working on user authentication."
})
```
- ❌ Reusable: NO - specific to this task
- ❌ Stable: NO - will change as task progresses
- ❌ Actionable: NO - doesn't change future behavior
- ❌ Type: task (but fails other criteria)

**Example 2: One-Off Bug**
```javascript
memory---store_memory({
  type: "code-pattern",
  content: "Fixed null pointer exception in login.ts line 42 by adding null check."
})
```
- ❌ Reusable: NO - specific to this bug
- ❌ Stable: NO - one-off fix
- ❌ Actionable: NO - doesn't change future behavior
- ❌ Type: code-pattern (but fails other criteria)

**Example 3: Implementation Detail**
```javascript
memory---store_memory({
  type: "code-pattern",
  content: "Implemented user authentication using JWT tokens stored in localStorage."
})
```
- ❌ Reusable: NO - specific to this implementation
- ❌ Stable: NO - implementation detail
- ❌ Actionable: NO - doesn't change future behavior
- ❌ Type: code-pattern (but fails other criteria)

**Example 4: File List**
```javascript
memory---store_memory({
  type: "task",
  content: "Files changed in this task: src/auth.ts, src/login.tsx, src/user.ts"
})
```
- ❌ Reusable: NO - specific to this task
- ❌ Stable: NO - task-specific
- ❌ Actionable: NO - doesn't change future behavior
- ❌ Type: task (but fails other criteria)

## Retrieval Examples

**Example 1: Retrieve architectural decisions**
```javascript
memory---retrieve_memory({
  query: "data access layer architecture patterns"
})
```

**Example 2: Retrieve user preferences**
```javascript
memory---retrieve_memory({
  query: "security severity thresholds verification"
})
```

**Example 3: Retrieve anti-patterns**
```javascript
memory---retrieve_memory({
  query: "controller layer anti-patterns database"
})
```

## Integration

Works with all Opsis workflows:
- **opsis-prd** - Store workflow contracts before starting
- **opsis-plan** - Retrieve architectural decisions before planning
- **opsis-implement** - Retrieve patterns before implementation, store decisions after
- **opsis-verify** - Retrieve quality principles, store anti-patterns after
- **opsis-systematic-debugging** - Retrieve anti-patterns, store findings after

## Related Skills

- **using-opsis** - Meta-skill for workflow rules
- **opsis-verify** - Spec-driven verification with memory integration
- **opsis-mode-enforcer** - Mode boundaries and self-correction
