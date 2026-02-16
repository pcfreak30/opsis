# Opsis Architecture

System design and architecture for the Opsis AI coding assistant.

## Overview

Opsis is a unified AI coding assistant system that provides structured development workflows with optional quality discipline. The system organizes skills into functional layers, enforces mode boundaries, and integrates automation hooks for workflow enforcement.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Opsis System                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │            Discovery & Planning Layer               │    │
│  │  • Conversational requirements gathering            │    │
│  │  • Strategic questioning                            │    │
│  │  • PRD and task planning                            │    │
│  │  • Prompt optimization                              │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │          Mode Enforcement Layer                      │    │
│  │  • Planning / Implementation / Verification modes   │    │
│  │  • Iron Law enforcement                            │    │
│  │  • Self-correction protocols                       │    │
│  │  • External state representation                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           Implementation Layer                       │    │
│  │  • Task execution                                   │    │
│  │  • Subagent coordination                            │    │
│  │  • Optional quality skills                          │    │
│  │  • Parallel workflows                               │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           Verification Layer                         │    │
│  │  • PRD verification                                 │    │
│  │  • Code review                                      │    │
│  │  • Evidence requirements                            │    │
│  │  • Fix loop enforcement                             │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │       Automation Layer (AiderDesk Hooks)             │    │
│  │  • Skill suggester (context-aware)                  │    │
│  │  • Mode tracker (boundary enforcement)              │    │
│  │  • Verification gate (evidence requirement)         │    │
│  │  • Session tracker (analytics)                      │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Mode System

### Three Modes

**Planning Mode**
- **Purpose:** Requirements gathering, analysis, document creation
- **Authorized:** Questions, analysis, documents, context retrieval
- **Blocked:** Code generation, file modifications, implementation
- **Skills:** using-opsis, opsis-start, opsis-prd, opsis-plan, opsis-summarize, opsis-improve, opsis-refine
- **Transition:** To Implementation (requires complete PRD)

**Implementation Mode**
- **Purpose:** Execute tasks, write code, implement features
- **Authorized:** Code, files, verification, task completion
- **Blocked:** Skip verification, no evidence completion
- **Skills:** opsis-implement, opsis-subagent-driven-development, opsis-dispatching-parallel-agents
- **Transition:** To Verification (requires all tasks with evidence)

**Verification Mode**
- **Purpose:** Review implementation, ensure quality
- **Authorized:** Read, analyze, report, run tests
- **Blocked:** Fixes, code modifications, evidence-less claims
- **Skills:** opsis-verify, opsis-review
- **Transition:** To Implementation (for fixes) or Complete

### Mode State Machine

```
[Initial State]
       │
       ▼
Planning Mode ◄──────┐
   │                 │
   │ (PRD complete)  │
   ▼                 │
Implementation Mode │
   │                 │
   │ (all complete)  │
   ▼                 │
Verification Mode ───┘
   │
   ▼ (pass)
[Complete]
```

### Mode Declaration Format

Required before ANY action:

```markdown
**OPSIS MODE: [Mode Name]**
Mode: [planning|implementation|verification]
Purpose: [brief description of current activity]
Implementation: [AUTHORIZED|BLOCKED] - [additional context]
```

## Iron Laws

### Iron Law 1: No Completion Without Verification
- Cannot claim task completion without fresh verification evidence
- Evidence must be specific to completed task
- Test results, code analysis, or proof of functionality required
- "I implemented it" is NOT verification evidence

### Iron Law 2: No Implementation Without Planning
- Cannot generate code without approved PRD or task specification
- Must read and understand requirements before writing code
- Planning documents (PRD, tasks.md) are source of truth
- "I'll just implement this" without planning is violation

### Iron Law 3: No Skipping Fix Loops
- Issues found during verification MUST be fixed
- After fixes, MUST re-verify before proceeding
- Cannot batch-fix multiple issues without re-verifying each
- Fix loop: Find → Fix → Verify → Repeat until pass

## Skills Architecture

### Skill Organization

```
skills/
├── using-opsis/              # Meta-skill
├── opsis-start/              # Discovery
├── opsis-prd/                # Discovery
├── opsis-summarize/          # Discovery
├── opsis-improve/            # Discovery
├── opsis-refine/             # Discovery
├── opsis-plan/               # Implementation
├── opsis-implement/          # Implementation
├── opsis-verify/             # Verification
├── opsis-review/             # Verification
├── opsis-archive/            # Utility
├── opsis-systematic-debugging/          # Quality
├── opsis-subagent-driven-development/   # Quality
├── opsis-test-driven-development/        # Quality
├── opsis-verification-before-completion/ # Quality
├── opsis-dispatching-parallel-agents/    # Quality
├── opsis-mode-enforcer/                  # Quality
├── opsis-brainstorming/                  # Ideation
├── opsis-executing-plans/                # Workflow
├── opsis-finishing-a-development-branch/ # Workflow
├── opsis-requesting-code-review/         # Code Review
├── opsis-receiving-code-review/          # Code Review
├── opsis-using-git-worktrees/            # Git Workflow
├── opsis-writing-skills/                 # Meta
├── opsis-commit-message/                 # Git Workflow
├── opsis-design-thinking/                # Ideation
├── opsis-innovation-strategy/            # Ideation
└── opsis-storytelling/                   # Ideation
```

### Skill Format

All skills follow AiderDesk format:

```markdown
---
name: opsis-skill-name
description: "Use when [specific triggering conditions]"
license: Apache-2.0
---

# Skill Content

Instructions, workflows, and patterns...
```

**Progressive Disclosure:**
1. **Metadata** (~27 tokens) - YAML frontmatter for triggering
2. **Instructions** (<680 tokens) - Core patterns and workflows
3. **Resources** (unlimited) - Detailed docs, scripts, assets

### Skill Categories

**Discovery & Planning (6 skills)**
- using-opsis - Meta-skill establishing workflow rules
- opsis-start - Conversational discovery for vague ideas
- opsis-prd - Requirements discovery through strategic questioning
- opsis-summarize - Conversation analysis and mini-PRD extraction
- opsis-improve - Prompt optimization with auto-depth selection
- opsis-refine - PRD iteration and updates

**Implementation (2 skills)**
- opsis-plan - Task breakdown from PRD
- opsis-implement - Execution with optional quality skill invocation

**Verification (2 skills)**
- opsis-verify - PRD verification against requirements
- opsis-review - Code review with criteria-driven analysis

**Utility (1 skill)**
- opsis-archive - Project management and archiving

**Quality (7 skills)**
- opsis-systematic-debugging - Root cause investigation
- opsis-test-driven-development - RED-GREEN-REFACTOR
- opsis-verification-before-completion - Evidence requirements
- opsis-subagent-driven-development - Fresh subagent pattern
- opsis-dispatching-parallel-agents - Parallel execution
- opsis-mode-enforcer - Mode boundaries, self-correction

**Ideation (4 skills)**
- opsis-brainstorming - Creative techniques, "Yes, and..."
- opsis-design-thinking - Human-centered design methodology
- opsis-innovation-strategy - Strategic frameworks
- opsis-storytelling - Narrative frameworks

**Workflow (3 skills)**
- opsis-executing-plans - Execute plans in separate sessions
- opsis-finishing-a-development-branch - Complete development work
- opsis-requesting-code-review - Request code review
- opsis-receiving-code-review - Handle code review feedback

**Git Workflow (2 skills)**
- opsis-using-git-worktrees - Create isolated worktrees
- opsis-commit-message - Generate commit messages

**Meta (1 skill)**
- opsis-writing-skills - Create new skills using TDD

## Hooks Architecture

### Hook System

```
hooks/
├── skill-suggester.js       # Context-aware recommendations
├── mode-tracker.js          # Mode boundary enforcement
├── verification-gate.js     # Evidence requirement enforcement
└── session-tracker.js       # Usage analytics
```

### Hook Event Flow

```
User Prompt
    │
    ├─→ skill-suggester.js (onPromptSubmitted)
    │   └─→ Suggest relevant skills based on keywords
    │
    ├─→ mode-tracker.js (onPromptSubmitted)
    │   └─→ Detect and set mode
    │
    ├─→ session-tracker.js (onTaskCreated)
    │   └─→ Initialize session tracking
    │
    ▼
Agent Processing
    │
    ├─→ mode-tracker.js (onToolCalled)
    │   └─→ Enforce mode boundaries
    │
    ├─→ session-tracker.js (onToolCalled)
    │   └─→ Log tool usage
    │
    ├─→ session-tracker.js (onCommandExecuted)
    │   └─→ Log command execution
    │
    ▼
Agent Response
    │
    ├─→ verification-gate.js (onPromptFinished)
    │   └─→ Check for completion claims
    │
    ├─→ verification-gate.js (onResponseMessageProcessed)
    │   └─→ Block claims without evidence
    │
    ├─→ mode-tracker.js (onPromptFinished)
    │   └─→ Track mode transitions
    │
    └─→ session-tracker.js (onTaskClosed)
        └─→ Generate session summary
```

### Hook Responsibilities

**skill-suggester.js**
- Analyze prompt for keywords
- Match keywords to skill descriptions
- Calculate relevance scores
- Display top N suggestions
- Track skill usage frequency

**mode-tracker.js**
- Detect mode from prompt keywords
- Track mode state per task
- Detect write operations in planning mode
- Escalate warnings for repeated violations
- Log mode transitions

**verification-gate.js**
- Detect completion claims in responses
- Track verification command execution
- Block claims without verification evidence
- Require fix and re-verification after failures
- Log verification events

**session-tracker.js**
- Initialize session on task creation
- Log all tool calls and commands
- Track skill and subagent usage
- Calculate session statistics
- Generate session summaries and recommendations

## External Representations

### Purpose

Replace mental visualization with external, readable representations that:
- Agent maintains and updates
- User reads and provides feedback
- Enable iterative refinement
- Serve as session documentation

### Representation Types

**Documents**
- PRDs (Product Requirements Documents)
- Task breakdowns (tasks.md)
- Brainstorming sessions
- Verification reports

**Diagrams**
- ASCII diagrams for architecture
- Mermaid diagrams for flows
- Component relationship maps
- State machine diagrams

**Tables**
- Feature comparison tables
- Task progress tracking
- Mode transition logs
- Verification results

### Maintenance Workflow

1. **Agent Creates**
   - Generate initial representation
   - Use structured format (markdown, tables, diagrams)
   - Include all relevant information

2. **User Reviews**
   - Read representation
   - Provide feedback
   - Request changes or clarification

3. **Agent Updates**
   - Incorporate user feedback
   - Refine representation
   - Maintain version history

## Workflow Integration

### Standard Workflow Flow

```
Discovery Layer
├── using-opsis (meta-skill)
├── opsis-start (conversational discovery)
├── opsis-prd (requirements discovery)
├── opsis-summarize (conversation extraction)
├── opsis-improve (prompt optimization)
└── opsis-refine (PRD iteration)
         │
         ▼ (PRD complete)
Planning Layer
└── opsis-plan (task breakdown)
         │
         ▼ (plan ready)
Implementation Layer
├── opsis-implement (mode enforcement + quality skills)
│   ├── Optional: opsis-subagent-driven-development
│   ├── Optional: opsis-dispatching-parallel-agents
│   ├── Optional: opsis-test-driven-development
│   ├── Optional: opsis-systematic-debugging
│   └── Required: opsis-verification-before-completion
         │
         ▼ (all tasks complete)
Verification Layer
├── opsis-verify (PRD verification)
└── opsis-review (code review)
         │
         ▼ (verification passes)
Utility Layer
└── opsis-archive (project management)
```

### Skill Orchestration Flow

```
User: "I want to build X"
    ↓
Load using-opsis: Apply The Rule
    ↓
Load opsis-start: Conversational discovery
    ↓ (conversation complete)
Load opsis-prd: Requirements discovery → Generate full-prd.md + quick-prd.md
    ↓ (PRD approved)
Load opsis-plan: Task breakdown → Generate tasks.md
    ↓ (plan ready)
Load opsis-implement: Mode enforcement + optional quality skills
    ├── Suggest relevant skills based on context
    ├── Execute tasks from tasks.md
    ├── Invoke quality skills as needed
    └─→ Enforce verification before completion
    ↓ (all tasks complete)
Load opsis-verify: Verify against PRD requirements
    ↓ (verification passes)
Load opsis-archive: Archive completed work
```

### Mode Enforcement Flow

```
Planning Mode (opsis-start, opsis-prd, opsis-plan)
    │
    ├─→ User wants to implement?
    │   └─→ mode-tracker.js detects mode switch
    │   └─→ Suggest transition to Implementation Mode
    │
    └─→ Continue planning (NO CODE allowed)

Implementation Mode (opsis-implement)
    │
    ├─→ User asks planning questions?
    │   └─→ mode-tracker.js detects mode violation
    │   └─→ Warn: "You're in Implementation Mode. Planning questions should be done first."
    │
    ├─→ User claims completion without verification?
    │   └─→ verification-gate.js blocks claim
    │   └─→ Require: "Run verification before claiming completion"
    │
    └─→ Continue implementation (code allowed)

Verification Mode (opsis-verify)
    │
    └─→ Verify implementation against PRD
        └─→ Generate verification report
```

### File Structure

```
/ (project root)
├── skills/                           # All skills
│   ├── using-opsis/                  # Meta-skill
│   ├── opsis-start/                  # Discovery
│   ├── opsis-prd/                    # Discovery
│   ├── opsis-summarize/              # Discovery
│   ├── opsis-improve/                # Discovery
│   ├── opsis-refine/                 # Discovery
│   ├── opsis-plan/                   # Planning
│   ├── opsis-implement/              # Implementation
│   ├── opsis-verify/                 # Verification
│   ├── opsis-review/                 # Verification
│   ├── opsis-archive/                # Utility
│   └── [18 additional quality, ideation, and workflow skills]
│
├── hooks/                           # AiderDesk hooks
│   ├── skill-suggester.js
│   ├── mode-tracker.js
│   ├── verification-gate.js
│   └── session-tracker.js
│
└── .aider-desk/                     # AiderDesk data directory
    └── opsis/                       # Opsis-specific data
        ├── outputs/                 # Generated documents
        │   └── {project-name}/
        │       ├── full-prd.md
        │       ├── quick-prd.md
        │       └── tasks.md
        ├── archive/                 # Completed work
        └── prompts/                 # Optimized prompts
```

## Configuration

### Hook Configuration

`hooks/config.json`:

```json
{
  "skill-suggester": {
    "maxSuggestions": 3,
    "confidenceThreshold": 0.3,
    "autoLoadTopSkills": true,
    "topSkillsCount": 3
  },
  "mode-tracker": {
    "planningThreshold": 0.6,
    "implementationThreshold": 0.6,
    "maxViolations": 3,
    "enableLogging": true
  },
  "verification-gate": {
    "completionThreshold": 0.75,
    "evidenceRequired": true
  },
  "session-tracker": {
    "enableLogging": true,
    "maxLogFileSize": 10485760,
    "maxLogFiles": 5
  }
}
```

## Data Flow

### Session Data

```
Session Tracker (session-tracker.js)
    │
    ├─→ Logs all events to logs/sessions/
    ├─→ Tracks tool usage frequency
    ├─→ Tracks skill usage patterns
    ├─→ Calculates statistics
    └─→ Generates summaries and recommendations
```

### Mode Data

```
Mode Tracker (mode-tracker.js)
    │
    ├─→ Maintains per-task mode state
    ├─→ Tracks mode history
    ├─→ Logs transitions
    └─→ Escalates violations
```

### Verification Data

```
Verification Gate (verification-gate.js)
    │
    ├─→ Tracks verification execution
    ├─→ Stores verification results
    ├─→ Blocks claims without evidence
    └─→ Requires fix loops
```

## Documentation

- [README.md](README.md) - Project overview
- [INSTALL.md](INSTALL.md) - Installation guide
- Individual skill files in `skills/*/SKILL.md` - Detailed skill documentation

## Attribution

Opsis incorporates concepts and methodologies from:
- Clavix - Conversational workflows and requirements discovery
- Superpowers - Implementation discipline and quality enforcement
- BMad CIS - Ideation techniques and creative problem-solving
