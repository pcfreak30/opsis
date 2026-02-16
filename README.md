# Opsis

A unified AI coding assistant system for AiderDesk with conversational discovery and optional quality discipline.

## Core Philosophy

**Conversational Discovery**
- Build understanding through iterative feedback
- One question at a time
- External representations replace mental visualization

**Quality Discipline (Optional)**
- Systematic debugging with root cause investigation
- Test-driven development with RED-GREEN-REFACTOR
- Verification before completion claims
- Evidence-based task completion

**Mode Enforcement**
- Clear boundaries between Planning and Implementation
- Self-correction protocols for violations
- External state representation for transparency

## Features

### Skills

18 specialized skills organized into 4 layers:

```
Discovery Layer (Conversational Requirements):
- using-opsis - Meta-skill establishing workflow rules and Iron Laws
- opsis-start - Conversational discovery for vague ideas
- opsis-prd - Requirements discovery through strategic questioning
- opsis-summarize - Conversation analysis and mini-PRD extraction
- opsis-improve - Prompt optimization with auto-depth selection
- opsis-refine - PRD iteration and updates

Implementation Layer (Code Execution):
- opsis-plan - Task breakdown from PRD
- opsis-implement - Execution with optional quality skill invocation

Verification Layer (Quality Assurance):
- opsis-verify - PRD verification against requirements
- opsis-review - Code review with criteria-driven analysis

Utility Layer (Project Management):
- opsis-archive - Project management and archiving

Quality Skills (Optional Quality Discipline):
- opsis-systematic-debugging - 4-phase root cause investigation
- opsis-subagent-driven-development - Fresh subagent per task + two-stage review
- opsis-test-driven-development - RED-GREEN-REFACTOR TDD cycle
- opsis-verification-before-completion - Evidence before claims
- opsis-dispatching-parallel-agents - Concurrent workflows
- opsis-mode-enforcer - Mode boundaries and self-correction
- opsis-brainstorming - "Yes, and..." ideation methodology
```

### Hooks

4 automation hooks for workflow enforcement:

- **skill-suggester.js** - Context-aware skill suggestions
- **mode-tracker.js** - Enforce mode boundaries (planning vs implementation)
- **verification-gate.js** - Block completion claims without evidence
- **session-tracker.js** - Track skill usage and sessions

## Workflow

### Standard Opsis Workflow

```
Discovery → Planning → Implementation → Verification → Archive
```

**Detailed steps:**

1. **Discovery Phase**
   - Use opsis-start for conversational exploration
   - Or opsis-summarize to extract requirements from conversation
   - Or provide requirements directly

2. **Planning Phase**
   - Use opsis-prd to create comprehensive PRD (full + quick versions)
   - Output: `.aider-desk/opsis/outputs/{project}/full-prd.md` + `quick-prd.md`
   - Mode: PLANNING (no code allowed)

3. **Task Preparation**
   - Use opsis-plan to generate technical task breakdown
   - Output: `.aider-desk/opsis/outputs/{project}/tasks.md`
   - Mode: PLANNING (pre-implementation)

4. **Implementation Phase**
   - Use opsis-implement to execute tasks
   - Agent executes tasks systematically, optionally invoking quality skills
   - Mode: IMPLEMENTATION (code allowed)
   - Agent marks tasks complete (`- [ ]` → `- [x]`) in tasks.md

5. **Verification Phase**
   - Use opsis-verify to audit implementation against PRD
   - Compare built code against requirements and plan
   - Mode: VERIFICATION (quality assessment)

6. **Completion**
   - Use opsis-archive to archive completed project
   - Output: `.aider-desk/opsis/archive/`
   - Mode: MANAGEMENT

### Quality Skill Integration

**opsis-implement** automatically suggests relevant quality skills based on task context:

- **Multiple independent failures?** → Suggest: opsis-dispatching-parallel-agents
- **Implementation plan with clear tasks?** → Suggest: opsis-subagent-driven-development
- **Bug or unexpected behavior?** → Suggest: opsis-systematic-debugging
- **Writing new code?** → Suggest: opsis-test-driven-development (optional)
- **About to claim completion?** → Require: opsis-verification-before-completion

**Skills are optional** - user confirms before activation.

## Installation

See [INSTALL.md](INSTALL.md) for detailed installation instructions.

Quick start:

```bash
# Copy skills to AiderDesk skills directory
cp -r skills/* ~/.aider-desk/skills/

# Copy hooks to project hooks directory
cp -r hooks/* ./

# Create data directory structure
mkdir -p .aider-desk/opsis/{outputs,instructions/{workflows,core},archive}

# Verify installation
ls ~/.aider-desk/skills/opsis-*
ls hooks/
```

## Usage

### Mode Declaration

Before any action, declare your current mode:

```markdown
**OPSIS MODE: Planning**
Mode: planning
Purpose: Creating PRD for new feature
Implementation: BLOCKED - No code generation during requirements gathering
```

### Skill Invocation

Skills auto-suggest based on context, or invoke explicitly:

```
Load skill: opsis-systematic-debugging
```

### Workflow

1. **Planning Mode** - Explore requirements, create PRDs
2. **Implementation Mode** - Write code, execute tasks
3. **Verification Mode** - Review, test, ensure quality

## Documentation

- [INSTALL.md](INSTALL.md) - Installation guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - System design and architecture
- Individual skill files in `skills/*/SKILL.md` - Detailed skill documentation

## License

Apache-2.0

## Attribution

Opsis incorporates concepts and methodologies from:
- Clavix - Conversational workflows and requirements discovery
- Superpowers - Implementation discipline and quality enforcement
- BMad CIS - Ideation techniques and creative problem-solving

## Contributing

Contributions should maintain the core philosophy of conversational discovery with optional quality discipline.
