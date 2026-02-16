---
name: opsis-brainstorming
description: Use for creative ideation, feature exploration, and solution generation. Combines CIS brainstorming techniques with Opsis mode enforcement and external representation maintenance. Uses 'Yes, and...' methodology for collaborative ideation.
license: Apache-2.0
---

# Brainstorming

Creative ideation and solution generation using 60+ techniques across 10 categories, integrated with Opsis mode enforcement and external representation maintenance.

## When to Use

**Invoke opsis-brainstorming when:**
- Exploring new features or capabilities
- Creative problem-solving for complex challenges
- Breaking through mental blocks
- Generating multiple solution options before selection
- Seeking innovative approaches to ambiguous requirements

**Note:** This is a Planning Mode skill. It does not generate implementation code.

## Mode Declaration

Reference **opsis-mode-enforcer** for complete mode declaration format and enforcement.

**OPSIS MODE: Planning**
Mode: planning
Purpose: Brainstorming solutions and generating creative ideas
Implementation: BLOCKED - Ideation phase only, no code generation

## Activation Logging

When this skill is activated, log:

```
ACTIVATED: opsis-brainstorming
Purpose: Creative ideation for [topic/challenge]
Expected outputs: Brainstorming session document with generated ideas
Techniques to use: [selected techniques from categories]
```

## Preconditions

Before invoking this skill:
1. A challenge, problem, or opportunity has been identified
2. Creative ideation is needed before solution selection
3. Planning Mode is appropriate (not implementation or verification)
4. Time is available for exploration (brainstorming requires patience)

## Postconditions

After completing this skill:
1. A brainstorming session document is created with all generated ideas
2. Ideas are organized by technique and theme
3. Prioritized list of ideas for further evaluation
4. Clear next steps for selected ideas (transition to PRD or implementation)

## Success Metrics

This skill is successful when:
- 20+ ideas generated per session
- Techniques from 3+ categories used
- 80%+ of responses build on ideas ("Yes, and..." ratio)
- All ideas documented in structured format
- User confirms value from ideation output

## Core Principles

**"Yes, and..." Methodology**
- Build on ideas, never dismiss
- Defer judgment - quantity before quality
- Wild ideas welcome - absurdity can spark genius
- Stay focused on the challenge
- Building on others' combination creates innovation

**External Representation Maintenance**
- Agent maintains session documents with ideas, techniques, and outcomes
- User reads and provides feedback on representations
- Iterative refinement based on user input
- All ideation captured in structured format for reference

## Technique Categories

### 1. Collaborative Techniques
Generate ideas together with structured group approaches.

| Technique | Best For | Prompt |
|-----------|----------|--------|
| Brainstorming | Classic group ideation | "Let's generate as many ideas as possible about [topic]" |
| Brainwriting | Silent written ideation | "Write down ideas silently, then build on others'" |
| Round Robin | Equal participation | "Each person contributes one idea in turn" |
| Mind Mapping | Visual idea connection | "Let's map out connections between ideas" |
| Starbursting | Question-based ideation | "What questions can we ask about [topic]?" |

### 2. Structured Techniques
Systematic approaches for focused ideation.

| Technique | Best For | Prompt |
|-----------|----------|--------|
| SCAMPER | Product improvement | "Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse" |
| Analogies | Cross-domain ideas | "This is like what? How is this similar to [other domain]?" |
| Reverse Thinking | Challenge assumptions | "What if we did the opposite? How could we make this worse?" |
| Forced Connections | Novel combinations | "What connections exist between [A] and [B]?" |
| Parameter Listing | Constraint exploration | "What are all the parameters/constraints?" |

### 3. Creative Techniques
Unconventional approaches for breakthrough ideas.

| Technique | Best For | Prompt |
|-----------|----------|--------|
| Random Entry | Breaking mental blocks | "Random word: [word]. How does this relate to [topic]?" |
| Word Association | Free association | "What comes to mind when I say [word]?" |
| Metaphor Exploration | Abstract thinking | "[Topic] is like a [metaphor]. Let's explore that." |
| What If Analysis | Scenario ideation | "What if we had unlimited resources? What if this didn't exist?" |
| Dreaming | Unconstrained vision | "In a perfect world with no constraints, what would this look like?" |

### 4. Deep Techniques
Focused exploration for complex problems.

| Technique | Best For | Prompt |
|-----------|----------|--------|
| 6-3-5 Method | Structured divergence | "6 people, 3 ideas each, 5 rounds of building" |
| Delphi Method | Expert consensus | "What do experts think? Let's gather multiple perspectives" |
| Nominal Group | Individual then group | "Individual ideation first, then group discussion" |
| Idea Sandwich | Build on ideas | "Idea A + Idea B = New Idea C" |
| Pinboard | Visual clustering | "Let's cluster these ideas visually" |

### 5. Theatrical Techniques
Embodied, physical approaches.

| Technique | Best For | Prompt |
|-----------|----------|--------|
| Role Playing | User perspective | "Let's role-play as [stakeholder]. What would they want?" |
| Bodystorming | Physical context | "Let's physically walk through this scenario" |
| Scenario Planning | Future stories | "Imagine it's 5 years from now. What happened?" |
| Character Cards | User archetypes | "What would [archetype] think about this?" |
| Storyboarding | Sequence ideation | "Let's storyboard the user journey" |

### 6. Wild Techniques
Unconventional, boundary-pushing approaches.

| Technique | Best For | Prompt |
|-----------|----------|--------|
| Worst Possible Idea | Safety in absurdity | "What's the worst idea we could have? Now improve it" |
| Provocation | Deliberate absurdity | "What if [absurd statement]? How could this be useful?" |
| Lateral Thinking | Indirect approach | "Approach this from a completely different angle" |
| Concept Extension | Push ideas further | "Take this idea to its extreme. What happens?" |
| Anti-Problem | Define what NOT to do | "How could we make this fail? What does that reveal?" |

### 7. Introspective Techniques
Individual reflection approaches.

| Technique | Best For | Prompt |
|-----------|----------|--------|
| Free Writing | Stream of consciousness | "Write continuously for 5 minutes about [topic]" |
| Solo Brainwriting | Individual ideation | "Generate ideas individually before sharing" |
| Affinity Mapping | Organize thoughts | "Let's group these ideas by theme" |
| Personal Proxy | Self-interview | "If you were interviewing yourself, what would you ask?" |
| Quiet Thinking | Reflection time | "Take time to reflect before responding" |

### 8. Biomimetic Techniques
Nature-inspired problem-solving using 3.8 billion years of evolutionary wisdom.

| Technique | Best For | Prompt |
|-----------|----------|--------|
| Nature's Solutions | Biological strategies | "How would nature solve this? What ecosystems provide parallels?" |
| Ecosystem Thinking | System relationships | "Analyze as ecosystem: What symbiotic relationships exist?" |
| Evolutionary Pressure | Adaptive optimization | "How would evolution optimize this? What selective pressures apply?" |

### 9. Quantum Techniques
Quantum physics-inspired thinking for innovation.

| Technique | Best For | Prompt |
|-----------|----------|--------|
| Observer Effect | Measurement influence | "How does observing this change it? What measurement effects matter?" |
| Entanglement Thinking | Hidden connections | "What elements are entangled? How do distant parts affect each other?" |
| Superposition Collapse | Multiple possibilities | "What if all options were possible? Which emerges when observed?" |

### 10. Cultural Techniques
Cross-cultural wisdom and anthropological insights.

| Technique | Best For | Prompt |
|-----------|----------|--------|
| Indigenous Wisdom | Traditional knowledge | "How would specific cultures approach this? What ancestral wisdom guides us?" |
| Fusion Cuisine | Cultural cross-pollination | "What happens when mixing culture A with culture B? What fusion creates?" |
| Ritual Innovation | Transformative experiences | "What ritual would transform this? How to make it ceremonial?" |
| Mythic Frameworks | Archetypal patterns | "What myth parallels this? What archetypes are involved?" |

## Workflow

### Phase 1: Define Challenge
1. Clearly state the problem or opportunity
2. Identify constraints and boundaries
3. Define success criteria
4. Establish session goals

### Phase 2: Select Techniques
1. Match techniques to context and energy
2. Consider team dynamics and preferences
3. Select 2-3 techniques for variety
4. Prepare prompts and facilitation approach

### Phase 3: Generate Ideas
1. Apply chosen techniques with "Yes, and..." mindset
2. Capture all ideas without judgment
3. Build on and combine ideas
4. Encourage wild and unconventional thinking

### Phase 4: External Representation
1. Document all generated ideas in session file
2. Create visual representations (mind maps, diagrams)
3. Cluster and organize ideas by theme
4. Maintain document for user review and feedback

### Phase 5: Cluster and Organize
1. Group related ideas together
2. Identify patterns and themes
3. Look for unexpected connections
4. Create categories or clusters

### Phase 6: Evaluate and Select
1. Apply selection criteria
2. Prioritize for action
3. Identify quick wins vs long-term
4. Create action plan for selected ideas

## File-Saving Protocol

Reference **opsis-worktree-utils** for worktree detection and save location logic.

**Save files:**
1. Determine session name (sanitize: lowercase, spaces→hyphens)
2. Create directory: mkdir -p {SAVE_BASE}/{session-name}
3. Save session document to: {SAVE_BASE}/{session-name}/brainstorm-session.md
4. Verify file with Read tool
5. Display actual file path

## Session Document Structure

```markdown
# Brainstorming Session: [Topic]

**Date:** [timestamp]
**Techniques Used:** [list]
**Goals:** [session goals]

## Challenge Definition
[Problem statement, constraints, success criteria]

## Ideation Results
[All generated ideas organized by technique]

## Clustering and Organization
[Grouped ideas by theme/pattern]

## Evaluation and Selection
[Selection criteria, prioritized ideas, rationale]

## Action Plan
[Next steps, implementation priorities]
```

## Kernel-Mode Probing

**Deep questioning techniques for uncovering fundamental assumptions:**

- **Five Whys**: Ask "Why?" repeatedly to reach root causes
- **First Principles**: Strip away assumptions to fundamental truths
- **Assumption Reversal**: Challenge core assumptions by flipping them
- **Question Storming**: Generate questions before seeking answers
- **Constraint Mapping**: Identify all constraints to find workarounds

**Usage:**
User: "We need to add feature X"
Agent (Kernel-Mode Probing):
  "Why do we need feature X?"
  "What problem does feature X solve?"
  "What assumptions are we making about feature X?"
  "What if we didn't have feature X? What would we do instead?"
  "What are the fundamental truths about this problem?"

## Quick Reference

| Situation | Recommended Technique |
|-----------|----------------------|
| Stuck, need fresh ideas | Random Entry, What If Analysis |
| Improving existing product | SCAMPER, Analogies |
| Complex system design | Mind Mapping, Parameter Listing |
| Breaking through assumptions | Reverse Thinking, Assumption Reversal |
| User-centered design | Role Playing, Bodystorming |
| Team ideation | Brainwriting, Round Robin |
| Deep problem solving | Five Whys, First Principles |
| Innovation | Concept Extension, Fusion Cuisine |

## Red Flags - STOP and Adjust

- **Dismissing ideas** → Use "Yes, and..." instead
- **Premature evaluation** → Defer judgment, generate quantity first
- **Staying in comfort zone** → Try wild or theatrical techniques
- **Jumping to implementation** → Stay in ideation phase, maintain representations
- **Ignoring quiet voices** → Use brainwriting for equal participation

## Common Mistakes

| Mistake | Correct Approach |
|---------|------------------|
| "That won't work" | "Yes, and how could we make it work?" |
| "We've tried that" | "What would make it work this time?" |
| "Let's pick the best one" | "Let's generate more options first" |
| "This is silly" | "What can we learn from this idea?" |
| Writing code during ideation | Stay in Planning Mode, maintain representations |

## Integration

This skill is part of the Opsis planning workflow:

**Workflow Order:**
1. **opsis-start** - Conversational exploration for vague ideas (optional)
2. **opsis-prd** - Requirements discovery through strategic questioning (if PRD needed)
3. **opsis-brainstorming** - Creative ideation for complex problems (this skill)
4. **opsis-plan** - Task breakdown from selected ideas
5. **opsis-implement** - Execute tasks from implementation plan
6. **opsis-verify** - Verify implementation against requirements

**Related Skills:**
- **opsis-mode-enforcer** - Mode boundaries and enforcement
- **opsis-worktree-utils** - Worktree detection and file protocol
- **opsis-prd** - Convert brainstorming outputs to formal PRD
- **opsis-start** - Conversational discovery before ideation
- **opsis-summarize** - Extract structured requirements from brainstorming

**References:**
- **using-opsis** - Complete workflow rules, Iron Laws, and skill invocation order (always load first)

## Next Steps

After brainstorming:
- Select 1-3 ideas for implementation
- Use **opsis-prd** if a formal requirements document is needed
- Use **opsis-plan** to break down selected ideas into tasks
- Proceed to **opsis-implement** for execution
