# Opsis Skills Catalog

Reference catalog of all Opsis skills with usage guidelines and examples.

## Skills Overview

| Skill | Purpose | Mode | Category |
|-------|---------|------|----------|
| using-Opsis | Meta-skill establishing workflow rules | All | Meta |
| opsis-start | Conversational discovery for vague ideas | Planning | Discovery |
| opsis-prd | Requirements discovery through strategic questioning | Planning | Discovery |
| opsis-summarize | Conversation analysis and mini-PRD extraction | Planning | Discovery |
| opsis-improve | Prompt optimization with auto-depth selection | Planning | Discovery |
| opsis-refine | PRD iteration and updates | Planning | Discovery |
| opsis-plan | Task breakdown from PRD | Planning | Implementation |
| opsis-implement | Execution with optional quality discipline skill invocation | Implementation | Implementation |
| opsis-verify | PRD verification against requirements | Verification | Verification |
| opsis-review | Code review with criteria-driven analysis | Verification | Verification |
| opsis-archive | Project management and archiving | Management | Utility |
| opsis-systematic-debugging | 4-phase root cause investigation + TRIZ + Theory of Constraints | Implementation | Quality |
| opsis-subagent-driven-development | Fresh subagent per task + two-stage review | Implementation | Quality |
| opsis-test-driven-development | RED-GREEN-REFACTOR TDD cycle | Implementation | Quality |
| opsis-verification-before-completion | Evidence before claims | Verification | Quality |
| opsis-dispatching-parallel-agents | Concurrent workflows | Implementation | Superpowers |
| opsis-mode-enforcer | Mode boundaries and self-correction | All | Superpowers |
| opsis-brainstorming | "Yes, and..." ideation with 60+ techniques across 10 categories | Planning | Superpowers |
| opsis-design-thinking | Human-centered design (Empathize → Define → Ideate → Prototype → Test) | Planning | Superpowers |
| opsis-innovation-strategy | Strategic frameworks (JTBD, Blue Ocean, Value Chain, Five Forces) | Planning | Superpowers |
| opsis-storytelling | Compelling narratives with 25+ story frameworks | Planning | Quality |

---

## Discovery Layer (Conversational Requirements)

### using-Opsis

**Purpose:** Meta-skill establishing workflow rules, Iron Laws, and skill invocation order.

**When to Use:**
- Load BEFORE any Opsis workflow (1% chance = must load)
- Establishes skill invocation rules
- Defines required skill chains (prd → plan → implement → verify)
- Sets Iron Laws for verification

**Key Features:**
- Skill invocation rules (check skills BEFORE any response)
- Required skill chains
- Iron Laws for verification
- Workflow orchestration and fix loops

**Data Storage:** `.aider-desk/opsis/` directory structure

**See Also:** using-opsis

---

### opsis-start

**Purpose:** Conversational discovery for vague ideas through iterative discussion.

**When to Use:**
- When ideas are vague and need refinement
- For complex requirements (15+ exchanges, 5+ features expected)
- When user wants to explore naturally, not fill out forms

**Approach:**
- Ask clarifying questions one at a time
- Track requirements silently (problem, users, features, constraints, success criteria)
- "Yes, and..." methodology
- Stay conversational, not interrogative

**Complexity Management:**
- Multi-topic detection (3+ topics → suggest focusing)
- Scope creep detection and handling
- Complexity threshold triggers summarization suggestion

**See Also:** opsis-start

---

### opsis-prd

**Purpose:** Requirements discovery through strategic questioning to create comprehensive PRDs.

**When to Use:**
- When ready to create structured PRD from idea
- After conversational exploration with opsis-start
- For formal requirements documentation

**Strategic Questions (One at a Time):**
1. What are we building and why? (Problem + goal)
2. Must-have core features? (3-5 critical features)
3. Tech stack and requirements?
4. Architecture and design choices? (Optional)
5. Explicitly OUT of scope? (What are we NOT building?)
6. Additional context? (Optional)

**Output:**
- `full-prd.md` - Comprehensive team-facing document
- `quick-prd.md` - AI-optimized 2-3 paragraph version

**Data Storage:** `.aider-desk/opsis/outputs/{project-name}/`

**See Also:** opsis-prd

---

### opsis-summarize

**Purpose:** Extract and optimize requirements from conversation into structured documentation.

**When to Use:**
- After conversational exploration with opsis-start
- Turn chat into requirements without starting from scratch
- Generate mini-PRD and optimized prompts

**Output Files (Required):**
1. `mini-prd.md` - Structured PRD with requirements prioritized
2. `original-prompt.md` - Raw extraction (2-4 paragraphs)
3. `optimized-prompt.md` - Enhanced version with pattern-based optimization

**Confidence Indicators:**
- [HIGH] - Explicitly stated multiple times with details
- [MEDIUM] - Mentioned once or inferred from context
- [LOW] - Assumed based on limited information

**See Also:** opsis-summarize

---

### opsis-improve

**Purpose:** Prompt optimization with auto-detected depth.

**When to Use:**
- Optimize existing prompts for AI consumption
- Improve prompt quality before implementation

**Smart Depth Selection:**
- Quality ≥ 75%: Comprehensive depth (add polish)
- Quality 60-74%: User choice (borderline)
- Quality < 60%: Standard depth (basic fixes)

**Quality Assessment (6 Dimensions):**
- Clarity, Efficiency, Structure, Completeness, Actionability, Specificity

**Output:**
- Intent Analysis
- Quality Assessment
- Optimized Prompt
- Improvements Applied (labeled with quality dimensions)
- Patterns Applied

**Data Storage:** `.aider-desk/opsis/outputs/prompts/{id}.md`

**See Also:** opsis-improve

---

### opsis-refine

**Purpose:** PRD iteration and updates through continued discussion.

**When to Use:**
- Update existing PRD or prompt
- Add new features, change requirements, adjust scope
- Tweak what exists without starting from scratch

**Workflow:**
1. Find existing PRDs and prompts
2. Ask what to update
3. Load existing content
4. Discuss changes
5. Save updated version with change markers

**Change Markers:**
- [ADDED] - New content
- [MODIFIED] - Changed content
- [REMOVED] - Deleted content
- [UNCHANGED] - Preserved content

**See Also:** opsis-refine

---

## Implementation Layer (Code Execution)

### opsis-plan

**Purpose:** Task breakdown from PRD with technical implementation details.

**When to Use:**
- After PRD creation
- Before starting implementation
- To generate low-level engineering tasks

**Task Generation Rules:**
- Specific file paths (not "create component" but "create src/components/X.tsx")
- Technical constraints (not "add validation" but "use zod schema in src/schemas/user.ts")
- Respect existing architecture
- Granularity: each task = single logical unit (~20-40 mins)

**Context Analysis (Before PRD):**
1. Scan directory structure
2. Read configuration (package.json, tsconfig.json)
3. Identify patterns (state management, styling, API patterns)
4. Output summary of detected stack

**Output:** `tasks.md` in `.aider-desk/opsis/outputs/{project-name}/`

**See Also:** opsis-plan

---

### opsis-implement

**Purpose:** Execute tasks from tasks.md with optional quality discipline skill invocation.

**When to Use:**
- After task creation with opsis-plan
- Execute implementation tasks
- Optionally invoke quality discipline skills for enhanced execution

**Detection Priority:**
1. Check `.aider-desk/opsis/outputs/{project}/tasks.md` → Task Implementation Mode
2. Check `.aider-desk/opsis/outputs/prompts/*.md` → Prompt Execution Mode
3. If neither → Ask what to build

**Quality Discipline Skill Invocation:**
- Multiple independent failures? → Suggest: opsis-dispatching-parallel-agents
- Implementation plan with clear tasks? → Suggest: opsis-subagent-driven-development
- Bug or unexpected behavior? → Suggest: opsis-systematic-debugging
- Writing new code? → Suggest: opsis-test-driven-development (optional)
- About to claim completion? → Require: opsis-verification-before-completion

**Task Execution Cycle:**
1. Read task (title, description, implementation details)
2. Check PRD for requirements context
3. Implement (write production-quality code)
4. Verification gate (tests, build, lint)
5. Fix loop if verification fails
6. Mark complete (edit tasks.md: `- [ ]` → `- [x]`)
7. Next task

**AiderDesk Integration:**
- Task system: tasks---create_task, tasks---get_task, tasks---get_task_message
- Subagent dispatching: subagents---run_task
- Three-tier feedback loops

**See Also:** opsis-implement

---

## Verification Layer (Quality Assurance)

### opsis-verify

**Purpose:** Spec-driven technical audit comparing implementation against PRD and tasks.md.

**When to Use:**
- After implementation completion
- Audit built code against requirements
- Verify implementation matches plan

**Verification Process:**
1. Identify completed work from tasks.md (checked `[x]` items)
2. Load requirements from full-prd.md
3. Read source files from completed tasks
4. Perform gap analysis (Plan vs Code, PRD vs Code, Code vs Standards)
5. Generate structured Review Board

**Review Comment Categories:**
- 🔴 CRITICAL - Architectural violation, security risk, feature broken/missing
- 🟠 MAJOR - Logic error, missing edge case, deviation from PRD
- 🟡 MINOR - Code style, naming, comments, optimization
- ⚪ OUTDATED - Code correct but Plan/PRD wrong

**Output:** Structured Review Board with specific, actionable comments

**Memory Store Integration:** Store architectural decisions and anti-patterns

**See Also:** opsis-verify

---

### opsis-review

**Purpose:** Code review with criteria-driven analysis (Security, Architecture, Standards, Performance).

**When to Use:**
- Review pull requests
- Analyze code changes against criteria
- Generate structured review comments

**Context Gathering:**
1. PR identification (branch name or PR description)
2. Review criteria selection:
   - Security (auth, validation, secrets, XSS/CSRF, injection)
   - Architecture (design patterns, SOLID, separation of concerns)
   - Standards (code style, naming, documentation, testing)
   - Performance (efficiency, caching, query optimization)
   - All-Around (balanced review)
3. Additional context (team conventions, specific concerns)

**Diff Analysis:** Retrieve and analyze git diff against selected criteria

**Review Output:** Structured review report with severity levels and specific file:line issues

**Data Storage:** `.aider-desk/opsis/outputs/reviews/{id}.md`

**See Also:** opsis-review

---

## Utility Layer (Project Management)

### opsis-archive

**Purpose:** Project management and archiving. Move completed work to `.aider-desk/opsis/archive/`.

**When to Use:**
- Archive completed projects
- Clean up workspace
- Organize completed work

**Archive Operations:**
- Interactive Archive - List projects, check completion, user selects
- Archive Specific Project - Check tasks, warn if incomplete
- Force Archive (Incomplete Tasks) - When scope changed
- Delete Project (Permanent Removal) - Only for failed experiments, duplicates

**Completion Summary:**
- Project name
- Tasks completed (X/Y)
- Key features implemented
- Date archived
- Notes for future reference

**See Also:** opsis-archive

---

## Quality Discipline Skills (Optional Enhancement)

### opsis-systematic-debugging

**Purpose:** 4-phase systematic debugging replacing random fixes with root cause investigation, enhanced with TRIZ and Theory of Constraints.

**When to Use:**
- ANY bug, test failure, crash, or unexpected behavior
- Especially under time pressure
- When multiple fixes have already failed
- Technical conflicts requiring inventive solutions
- System bottlenecks and throughput issues

**Iron Law:** NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST

**The Four Phases:**
1. Root Cause Investigation - Read errors, reproduce, check changes, gather evidence, trace data flow
2. Pattern Analysis - Find working examples, compare against references, identify differences
3. Hypothesis and Testing - Form single hypothesis, test minimally, verify
4. Implementation - Create failing test case, implement single fix, verify
   - If 3+ fixes failed: question architecture

**Advanced Methods:**

**TRIZ (40 Inventive Principles)**
- For technical conflicts: Segmentation, Extraction, Asymmetry, Inversion, etc.
- Contradiction Matrix for conflicting parameters
- Systematic inventive problem-solving

**Theory of Constraints**
- Five Focusing Steps: Identify, Exploit, Subordinate, Elevate, Repeat
- Thinking Processes: Current Reality Tree, Evaporating Cloud, Future Reality Tree
- For system bottlenecks and throughput issues

**Systems Thinking**
- Causal Loop Diagrams for feedback loops
- Stock and Flow for system dynamics
- Leverage Points for intervention

**See Also:** opsis-systematic-debugging

---

### opsis-subagent-driven-development

**Purpose:** Fresh subagent per task + two-stage review for parallel development.

**When to Use:**
- Complex tasks requiring specialized focus
- When main agent context is overloaded
- Parallel development scenarios

**Pattern:**
1. Main agent delegates task to fresh subagent
2. Subagent implements + self-review
3. Spec reviewer verifies compliance (loop until passes)
4. Quality reviewer verifies quality (loop until passes)

**AiderDesk Integration:** Uses task system (tasks---create_task, tasks---get_task, tasks---get_task_message)

**See Also:** opsis-subagent-driven-development

---

### opsis-test-driven-development

**Purpose:** RED-GREEN-REFACTOR TDD cycle.

**When to Use:**
- Writing new code
- Ensuring test coverage
- Refactoring with safety

**Cycle:**
1. RED - Write failing test
2. GREEN - Write minimal code to pass
3. REFACTOR - Improve code while tests pass

**See Also:** opsis-test-driven-development

---

### opsis-verification-before-completion

**Purpose:** Evidence before claims.

**When to Use:**
- Before claiming any task or feature is complete
- Required by opsis-implement before completion

**Iron Law:** NO COMPLETION CLAIMS WITHOUT VERIFICATION EVIDENCE

**Verification Evidence:**
- Tests pass
- Build succeeds
- Lint passes
- Requirements satisfied

**See Also:** opsis-verification-before-completion

---

### opsis-dispatching-parallel-agents

**Purpose:** Concurrent workflows for independent failures.

**When to Use:**
- Multiple independent failures detected
- Parallel investigation needed

**Pattern:**
- Dispatch multiple subagents for independent issues
- Each subagent investigates one failure
- Aggregate results

**See Also:** opsis-dispatching-parallel-agents

---

### opsis-mode-enforcer

**Purpose:** Mode boundaries and self-correction.

**When to Use:**
- Before ANY agent action
- When mode boundaries are unclear
- For self-correction protocol guidance

**Mode Boundaries:**
- Planning Mode - Analyze, document, ask questions. NO CODE.
- Implementation Mode - Write code. Only after explicit transition.
- Verification Mode - Quality assessment and validation.

**Iron Laws:**
1. No Completion Without Verification
2. No Implementation During Planning
3. No Skipping Fix Loops

**See Also:** opsis-mode-enforcer

---

### opsis-brainstorming

**Purpose:** "Yes, and..." ideation methodology with 60+ techniques across 10 categories.

**When to Use:**
- Creative problem solving
- Ideation sessions
- Generating alternatives
- Breaking through mental blocks
- Feature exploration

**Categories:**
- Collaborative
- Creative
- Deep
- Introspective
- Structured
- Theatrical
- Wild
- Biomimetic (nature-inspired)
- Quantum (physics-inspired)
- Cultural (anthropological)

**See Also:** opsis-brainstorming

---

### opsis-design-thinking

**Purpose:** Human-centered design through five phases: Empathize → Define → Ideate → Prototype → Test.

**When to Use:**
- Product design and UX projects
- User research and insight gathering
- Creative problem-solving with human focus
- Feature ideation and user experience design
- Service design and process improvement

**Five Phases:**
1. **Empathize** - Build deep understanding of users through research
2. **Define** - Transform insights into clear problem statements
3. **Ideate** - Generate diverse solutions through structured brainstorming
4. **Prototype** - Make ideas tangible quickly
5. **Test** - Validate with real users

**Key Methods:**
- User interviews, observation, empathy mapping (Empathize)
- Point of View statements, "How Might We" questions (Define)
- Brainstorming, SCAMPER, mind mapping (Ideate)
- Sketches, wireframes, paper prototypes (Prototype)
- Usability testing, A/B testing, feedback sessions (Test)

**See Also:** opsis-design-thinking

---

### opsis-innovation-strategy

**Purpose:** Strategic frameworks for identifying disruption opportunities and business model innovation.

**When to Use:**
- Strategic planning
- Business model innovation
- Competitive analysis
- Product strategy
- Market positioning
- Disruption opportunity identification

**Frameworks:**

**Jobs-to-be-Done (JTBD)**
- What job are customers hiring your product to do?
- Map hiring criteria and improvement opportunities
- Design around outcomes, not features

**Blue Ocean Strategy**
- Create uncontested market space
- ERRC Grid: Eliminate, Reduce, Raise, Create
- Value Curve Analysis and Strategy Canvas

**Value Chain Analysis**
- Primary activities: Inbound, Operations, Outbound, Marketing, Service
- Support activities: Infrastructure, HR, Technology, Procurement
- Find differentiation opportunities

**Porter's Five Forces**
- Competitive rivalry, supplier power, buyer power
- Threat of substitution, threat of new entry
- Assess industry attractiveness

**See Also:** opsis-innovation-strategy

---

### opsis-storytelling

**Purpose:** Craft compelling narratives using 25+ proven story frameworks.

**When to Use:**
- Brand narratives and messaging
- User stories and case studies
- Marketing and communication
- Presentations and pitches
- Change management communications
- Product announcements
- Documentation and tutorials

**Story Frameworks:**

**Transformation Narratives**
- Hero's Journey, Pixar Story Spine, Customer Journey, Challenge-Overcome

**Strategic Narratives**
- Brand Story, Pitch Narrative, Vision Narrative, Origin Story

**Specialized Narratives**
- Data Storytelling, Emotional Hooks, Three-Act Structure, Story Brand

**Technical Narratives**
- Problem-Solution, Feature Story, Migration Story

**Essential Elements:**
- Character, Conflict, Change, Emotion, Theme

**See Also:** opsis-storytelling

---

## Skill Invocation Patterns

### Standard Workflow Chain

```
using-Opsis (load first)
    ↓
opsis-start (conversational discovery)
    ↓
opsis-prd OR opsis-summarize (requirements)
    ↓
opsis-plan (task breakdown)
    ↓
opsis-implement (execution + optional quality discipline)
    ↓
opsis-verify (audit)
    ↓
opsis-archive (completion)
```

### Opportunity Workflows

```
opsis-improve (prompt optimization)
opsis-refine (PRD iteration)
opsis-review (code review)
```

### Quality Discipline Invocation

**opsis-implement** automatically suggests quality discipline skills based on task context. User confirms before activation.

---

## Data Storage

All outputs stored in `.aider-desk/opsis/`:

```
.aider-desk/opsis/
├── outputs/
│   ├── {project-name}/
│   │   ├── full-prd.md
│   │   ├── quick-prd.md
│   │   └── tasks.md
│   ├── prompts/
│   │   └── {id}.md
│   └── reviews/
│       └── {id}.md
├── instructions/
│   ├── workflows/
│   └── core/
└── archive/
    └── {project-name}/
```

---

## Installation

See [INSTALL.md](INSTALL.md) for installation instructions.

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
```

**New Skills (CIS Integration):**
- `opsis-brainstorming` - Enhanced with 60+ techniques across 10 categories
- `opsis-design-thinking` - Human-centered design with 5 phases
- `opsis-innovation-strategy` - Strategic frameworks (JTBD, Blue Ocean, etc.)
- `opsis-storytelling` - 25+ story frameworks for compelling narratives
- `opsis-systematic-debugging` - Enhanced with TRIZ and Theory of Constraints

```bash
# Copy skills to AiderDesk skills directory
cp -r skills/* ~/.aider-desk/skills/

# Copy hooks to project hooks directory
cp -r hooks/* ./

# Create data directory structure
mkdir -p .aider-desk/opsis/{outputs,instructions/{workflows,core},archive}

# Verify installation
ls ~/.aider-desk/skills/opsis-*
```

---

*Generated with Opsis*
*Last updated: 2026-02-16*
