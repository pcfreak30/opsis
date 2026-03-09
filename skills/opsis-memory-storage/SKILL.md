---
name: opsis-memory-storage
description: "Memory storage eligibility criteria and retrieval patterns for Opsis workflows. Store ONLY reusable, stable, actionable information."
license: Apache-2.0
---

# Memory Storage

Memory storage eligibility criteria and retrieval patterns for Opsis workflows.

## When to Use

Use this skill when:

- Before starting implementation
- Before complex tasks
- After debugging
- After workflow completion
- After verification passes/fails
- Before chunk validation
- When uncertain about storage eligibility

Do not use when:

- Storing task progress/status
- Storing one-off bugs
- Storing implementation details
- Storing transient notes

## Rules

### Rule: Store ONLY what changes future behavior

**When:** Considering storage

**Then:** Apply eligibility criteria

**Memory is NOT for:**
- Task progress tracking (use TODO tools)
- Recording what happened (use git history)
- Temporary notes (use conversation context)

**Memory IS for:**
- Architectural decisions that guide future work
- Patterns that should be replicated
- Anti-patterns to avoid
- User preferences that affect behavior

### Rule: Apply eligibility criteria

**When:** Storing information

**Then:** Verify ALL four rules are true

**Eligibility rules:**
1. Reusable across future tasks
2. Stable (unlikely to change soon)
3. Actionable (changes future behavior)
4. Type matches (task, code-pattern, or user-preference)

**If ANY rule is false:**
**Then:** DO NOT store

### Rule: Use correct storage types

**When:** Storing information

**Then:** Match type to content

**Type table:**
- `task`: Workflow contracts, milestones
- `code-pattern`: Architecture decisions, patterns, anti-patterns
- `user-preference`: Strategy preferences, thresholds

### Rule: Retrieve with descriptive queries

**When:** Retrieving memory

**Then:** Use 3-7 descriptive words

**Query guidelines:**
- Include key concepts and context
- Use natural language
- Example: "LLM provider integration patterns"
- Example: "authentication flow implementation details"

**Avoid:**
- Single words (too generic)
- Generic terms (lacks context)
- Overly brief queries (no context)

### Rule: Never store ineligible information

**When:** Storing information

**Then:** Verify against never-store list

**Never store:**
- Task progress/status
- One-off bugs
- Implementation details
- Transient implementation notes
- File lists from a single task
- Logs/stack traces
- Secrets/tokens/credentials/PII
- Information directly derivable from repository content

## Process

1. Determine if information needs storage
2. Apply eligibility criteria (all four rules must be true)
3. Verify type matches (task, code-pattern, or user-preference)
4. Store with appropriate type
5. Use descriptive queries (3-7 words) when retrieving

## Preconditions

Before using this skill, verify:

- Information is reusable across future tasks
- Information is stable (unlikely to change soon)
- Information is actionable (changes future behavior)
- Type matches (task, code-pattern, or user-preference)

## Postconditions

After completing this skill, verify:

- Only eligible information stored
- Retrieval queries use 3-7 descriptive words
- Storage types match eligibility criteria

## Success Metrics

This skill is successful when:

- No ineligible storage occurs
- Stored information is reusable across future tasks
- Stored information is stable
- Stored information is actionable
- Storage type matches information category

## Common Situations

**Situation:** Architectural decision

**Pattern:**
- When: Decision affects future implementation
- Then: Store as code-pattern
- Verify: Reusable, stable, actionable, type matches

**Situation:** Anti-pattern discovered

**Pattern:**
- When: Pattern to avoid in future
- Then: Store as code-pattern
- Verify: Reusable, stable, actionable, type matches

**Situation:** User preference identified

**Pattern:**
- When: User preference affects behavior
- Then: Store as user-preference
- Verify: Reusable, stable, actionable, type matches

**Situation:** Task progress attempted

**Pattern:**
- When: Attempting to store task progress
- Then: DO NOT store
- Use: TODO tools instead
