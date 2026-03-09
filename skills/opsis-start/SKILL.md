---
name: opsis-start
description: "Conversational discovery for vague ideas. Ask clarifying questions one at a time, explore requirements naturally, track problem statement/users/features/constraints."
license: Apache-2.0
---

# Start

Conversational discovery for vague ideas through iterative discussion.

## When to Use

Use this skill when:

- Ideas are vague or underdeveloped
- User wants to explore through natural conversation
- Requirements need discovery through dialogue
- Problem statement is unclear
- Target users are undefined
- Features and scope need exploration

Do not use when:

- Requirements are clear enough for structured planning
- User wants to start implementation immediately

## Rules

### Rule: Use "Yes, and..." methodology

**When:** Conversing with user

**Then:** Build on user's ideas, never dismiss

**Methodology:**
- Ask one question at a time - don't overwhelm
- Track requirements silently (Problem, users, features, constraints, success criteria)
- Stay conversational - Not an interrogation
- Defer judgment - Explore ideas naturally before formalizing

### Rule: Ask one question at a time

**When:** Exploring requirements

**Then:** Ask single question, wait for answer, then proceed

**Never:** Ask multiple questions at once

### Rule: Track requirements silently

**When:** Conversing

**Then:** Maintain mental notes of tracking points

**Tracking points:**
- Problem statement
- Target users
- Core features
- Technical requirements
- Architecture preferences
- Success criteria
- Constraints and scope

### Rule: Suggested question flow

**When:** Starting conversation

**Then:** Start with problem and goal, explore naturally

**Suggested flow:**
1. What are we building and why? (problem and goal)
2. Who is this for? (target users)
3. What should it do? (core features)
4. How should it work? (technical preferences)
5. What defines success? (success criteria)
6. What are we NOT doing? (out of scope)

### Rule: Manage multi-topic complexity

**When:** 3+ distinct topics detected

**Then:** Suggest focusing

**Options:**
- Focus on one - explore one topic thoroughly
- Continue multi-topic - track all but acknowledge complexity
- Create separate sessions - separate conversations for each major topic

### Rule: Detect and manage scope creep

**When:** Scope expanding

**Then:** Watch for indicators and manage

**Scope creep signals:**
- Features growing beyond original problem
- Requirements contradicting earlier statements
- "Must-haves" increasing over time

**Management strategies:**
- Anchor to original problem statement
- Ask "Does this solve the core problem?"
- Suggest versioning (v1 with X, v2 adds Y)
- Explicitly mark items as out of scope

### Rule: Handle complexity threshold

**When:** High complexity reached

**Then:** Suggest next steps

**Complexity threshold:**
- >15 exchanges without clear direction
- 5+ features being discussed simultaneously
- Multiple tech stacks or approaches mentioned

**Suggest next steps:**
- Summarize what's been discovered
- Switch to opsis-prd for structured planning
- Use opsis-summarize to extract mini-PRD

## Process

1. Begin with friendly introduction
2. Ask one question at a time
3. Track requirements silently
4. Build on user's ideas with "Yes, and..."
5. Maintain conversational flow
6. Detect multi-topic complexity
7. Manage scope creep
8. Handle complexity threshold
9. Transition to opsis-prd or opsis-summarize when ready

## Preconditions

Before using this skill, verify:

- User has a vague or underdeveloped idea
- Requirements need discovery through dialogue
- No formal PRD or planning document exists
- User is open to conversational exploration

## Postconditions

After completing this skill, verify:

- Problem statement is clear and articulated
- Target users are identified
- Core features are understood
- Technical requirements are known
- Success criteria are defined
- Constraints and scope are established
- User ready for structured planning or summarization

## Success Metrics

This skill is successful when:

- Conversational flow maintained (questions asked one at a time)
- Requirements clarity achieved (problem, users, features, constraints articulated)
- Natural exploration achieved (ideas evolve through "Yes, and...")
- Transition readiness achieved (user has enough clarity for next skill)
- User satisfaction (user feels heard, understood, and guided)

## Common Situations

**Situation:** User provides vague idea

**Pattern:**
- When: Idea is underdeveloped
- Then: Use "Yes, and..." methodology, explore naturally

**Situation:** Multiple topics detected

**Pattern:**
- When: 3+ distinct topics in conversation
- Then: Suggest focusing on one topic or separate sessions

**Situation:** Scope creeping

**Pattern:**
- When: Features growing beyond original problem
- Then: Anchor to original problem, suggest versioning

**Situation:** High complexity threshold

**Pattern:**
- When: >15 exchanges, 5+ features, multiple tech stacks
- Then: Summarize, suggest opsis-prd or opsis-summarize
