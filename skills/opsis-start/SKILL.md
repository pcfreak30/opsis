---
name: opsis-start
description: Conversational discovery for vague ideas. Ask clarifying questions one at a time, explore requirements naturally, track problem statement/users/features/constraints.
license: Apache-2.0
---

# Start

Conversational discovery for vague ideas through iterative discussion. Use when ideas are vague and need refinement through natural dialogue before formal planning.

## Core Principles

**"Yes, and..." Methodology**
- Build on the user's ideas, never dismiss
- Ask one question at a time - don't overwhelm with multiple questions
- Track requirements silently - Problem, users, features, constraints, success criteria
- Stay conversational - Not an interrogation
- Defer judgment - Explore ideas naturally before formalizing

## Mode Awareness

**Planning Mode (Primary)**
- opsis-start operates in Planning Mode
- Gather requirements through conversational exploration
- Do NOT write code during requirements discovery
- Maintain conversation context and flow

**Mode Declaration**
Follow the standard mode declaration format from opsis-mode-enforcer:

```markdown
**OPSIS MODE: Planning**
Mode: planning
Purpose: Conversational discovery and requirements exploration
Implementation: BLOCKED - No code generation during requirements gathering
```

See opsis-mode-enforcer for complete mode enforcement details and Iron Laws.

## When to Use

Use opsis-start when:
- Ideas are vague or underdeveloped
- User wants to explore through natural conversation
- Requirements need discovery through dialogue
- Problem statement is unclear
- Target users are undefined
- Features and scope need exploration

**Transition to other skills:**
- Requirements become clear → opsis-prd for structured planning
- Ready to document → opsis-summarize to extract mini-PRD
- Need creative ideation → opsis-brainstorming for solution generation

## Approach

### Begin with Friendly Introduction

Start the conversation naturally:
- Welcome the user and their idea
- Set expectations for conversational exploration
- Explain you'll ask questions one at a time

### Explore Ideas Naturally

1. **Ask one question at a time** - Don't overwhelm with multiple questions
2. **Track requirements silently** - Maintain mental notes of:
   - Problem statement
   - Target users
   - Core features
   - Technical requirements
   - Architecture preferences
   - Success criteria
   - Constraints and scope
3. **Build on their ideas** - Use "Yes, and..." methodology
4. **Stay conversational** - Not an interrogation

### Suggested Question Flow

Start with the problem and goal, then explore naturally:

1. **What are we building and why?**
   - What problem are you trying to solve?
   - What's the goal or outcome you want to achieve?

2. **Who is this for?**
   - Who are the target users?
   - What do they need or want?

3. **What should it do?**
   - What are the core features?
   - What's the minimum viable functionality?

4. **How should it work?**
   - Any technical preferences or constraints?
   - Architecture or design considerations?

5. **What defines success?**
   - How will we know if this is working?
   - What are the success criteria?

6. **What are we NOT doing?**
   - What's explicitly out of scope?

## Key Tracking Points

Maintain silent tracking of these elements throughout the conversation:

- **Problem statement** - What pain point or opportunity?
- **Target users** - Who will use this solution?
- **Core features** - What functionality is essential?
- **Technical requirements** - Stack, integrations, constraints
- **Architecture preferences** - Design patterns, structure
- **Success criteria** - How to measure success
- **Constraints and scope** - What's in/out of bounds

## Complexity Management

### Multi-Topic Detection

When 3+ distinct topics are detected in the conversation, suggest focusing:

- **Focus on one** - Explore one topic thoroughly before moving to others
- **Continue multi-topic** - Track all topics but acknowledge complexity
- **Create separate sessions** - Suggest separate conversations for each major topic

### Scope Creep Signals

Watch for these indicators that scope is expanding:
- Features growing beyond original problem
- Requirements contradicting earlier statements
- "Must-haves" increasing over time

**Management strategies:**
- Anchor to original problem statement
- Ask "Does this solve the core problem?"
- Suggest versioning (v1 with X, v2 adds Y)
- Explicitly mark items as out of scope

### Complexity Threshold

When conversation reaches high complexity:
- >15 exchanges without clear direction
- 5+ features being discussed simultaneously
- Multiple tech stacks or approaches mentioned

**Suggest next steps:**
- Summarize what's been discovered
- Switch to opsis-prd for structured planning
- Use opsis-summarize to extract mini-PRD

## Activation Logging

When this skill is activated, log:

```
ACTIVATED: opsis-start
Purpose: Conversational discovery for [idea description]
Mode: Planning
Tracking: Problem, users, features, constraints, success criteria
```

## Preconditions

Before invoking this skill:
1. User has a vague or underdeveloped idea
2. Requirements need discovery through dialogue
3. No formal PRD or planning document exists
4. User is open to conversational exploration

## Postconditions

After completing this skill:
1. Problem statement is clear and articulated
2. Target users are identified
3. Core features are understood
4. Technical requirements are known
5. Success criteria are defined
6. Constraints and scope are established
7. User is ready for structured planning (opsis-prd) or summarization (opsis-summarize)

## Success Metrics

This skill is successful when:
- **Conversational flow**: Questions asked one at a time, user never overwhelmed
- **Requirements clarity**: Problem, users, features, and constraints are articulated
- **Natural exploration**: Ideas evolve through "Yes, and..." methodology
- **Transition readiness**: User has enough clarity to proceed to opsis-prd or opsis-summarize
- **User satisfaction**: User feels heard, understood, and guided

## Integration

### Pattern Skills Used

- **opsis-mode-enforcer** - Mode declaration and enforcement (Planning Mode)
- **opsis-delegation-checkpoint** - Delegation decisions for codebase analysis (if needed)

### Related Skills

- **osis-prd** - Structured requirements discovery for clear ideas
- **osis-summarize** - Extract mini-PRD from conversation
- **osis-brainstorming** - Creative ideation and solution generation
- **using-opsis** - Meta-skill establishing workflow rules and skill invocation order

### Workflow Position

**Position in Opsis workflow:**
1. **Exploration Phase** (opsis-start) - Conversational discovery for vague ideas
2. **Planning Phase** (opsis-prd or opsis-summarize) - Structured requirements and planning
3. **Implementation Phase** (opsis-implement) - Execute tasks from plans
4. **Verification Phase** (opsis-verify) - Verify implementation against requirements

**Entry point:** Use opsis-start when ideas are vague and need conversational exploration.

**Exit point:** Transition to opsis-prd when requirements are clear enough for structured planning, or opsis-summarize to extract mini-PRD from conversation.

## Quick Reference

| Situation | Recommended Action |
|-----------|-------------------|
| Vague idea, unclear requirements | Use opsis-start for conversational discovery |
| Clear requirements, need structure | Use opsis-prd for structured planning |
| Need creative solutions | Use opsis-brainstorming for ideation |
| Ready to document findings | Use opsis-summarize to extract mini-PRD |
| Multiple topics detected | Suggest focusing on one topic or separate sessions |
| Scope creeping | Anchor to original problem, suggest versioning |
| High complexity threshold | Summarize and transition to opsis-prd |

## Red Flags - STOP and Adjust

- **Asking multiple questions at once** → Ask one question at a time
- **Jumping to implementation** → Stay in Planning Mode, use opsis-mode-enforcer
- **Ignoring user's ideas** → Use "Yes, and..." methodology
- **Formalizing too early** → Keep conversation natural until ready
- **Missing tracking** → Maintain silent notes on problem, users, features, constraints

## Common Mistakes

| Mistake | Correct Approach |
|---------|------------------|
| "Here are 5 questions to answer" | Ask one question at a time |
| "Let's start building this" | Stay in Planning Mode, use opsis-mode-enforcer |
| "That won't work" | Use "Yes, and..." methodology |
| "I'll create a PRD now" | Continue conversational exploration until ready |
| Ignoring scope creep | Anchor to original problem, suggest versioning |
