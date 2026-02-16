---
name: opsis-delegation-checkpoint
description: Delegation checkpoint framework for Opsis Layer 3 Phase Patterns. Provides complete decision tree, complexity assessment, delegation vs direct execution matrix, prompt templates, and after-delegation workflow.
license: Apache-2.0
---

# Opsis Delegation Checkpoint

Delegation checkpoint framework for Opsis Layer 3 Phase Patterns. Provides complete decision tree, complexity assessment, delegation vs direct execution matrix, prompt templates, and after-delegation workflow.

## When to Use

**Invoke opsis-delegation-checkpoint when:**
- Determining whether to delegate a task to subagents or execute directly
- Assessing task complexity before execution
- A Layer 3 Phase Pattern skill requires a delegation decision
- Need to select appropriate tools for task execution
- Planning multi-step workflows that involve delegation

**Note:** This skill is automatically applied by other Opsis skills through their delegation checkpoints. You typically invoke it directly only when making a standalone delegation decision.

## Mode Declaration

**OPSIS MODE: Coordination**
Mode: coordination
Purpose: Assessing task complexity and determining optimal execution strategy (delegate vs direct)
Implementation: ROUTING - I will delegate or execute based on task complexity assessment

## Core Principle

**ASSESS BEFORE ACT: Every task requires a complexity assessment before execution.**

Before executing any task, determine:
1. Is this a simple, single-file operation? → Execute directly
2. Is this a complex analysis or multi-file operation? → Delegate to subagent
3. Does this require specialized workflow? → Invoke appropriate Opsis skill

## Integration

This skill provides the delegation framework used by:
- **using-opsis** - Meta-skill establishing workflow rules and skill invocation order
- **opsis-coordinator** - Agent coordination decision framework
- **opsis-prd** - Pre-flight delegation assessment for requirements discovery
- **opsis-plan** - Delegation checkpoint for codebase analysis before task breakdown
- **opsis-implement** - Delegation decisions during implementation execution
- **opsis-two-stage-review-execution** - Delegation for task-based execution with two-stage review
- **opsis-dispatching-parallel-agents** - Parallel agent coordination decisions

**References:**
- **using-opsis** - Complete workflow rules, Iron Laws, and skill invocation order
- **opsis-coordinator** - Agent coordination decision framework with complete decision tree

## Activation Logging

When this skill is activated, log:

```
ACTIVATED: opsis-delegation-checkpoint
Purpose: Assessing delegation requirements for [task description]
Assessment criteria: [file count, known paths, pattern discovery, relationships, context]
```

## Preconditions

Before invoking this skill:
1. A task or operation has been identified that needs execution
2. The scope or complexity of the task is uncertain
3. A decision is needed between delegation and direct execution

## Postconditions

After completing this skill:
1. A clear decision is made: delegate to subagent OR execute directly
2. If delegating: subagent is invoked with clear task description and context
3. If executing directly: operation proceeds with known file paths and clear scope
4. Workflow continues with the next step after delegation/execution

## Success Metrics

This skill is successful when:
- Complexity assessment correctly identifies simple vs complex operations
- Delegation decisions match task characteristics
- Executed operations complete without requiring mid-task delegation
- Delegated tasks return complete, actionable results
- Workflow continues smoothly after the delegation checkpoint

## Delegation Decision Tree

Complete decision tree for determining execution strategy:

```
Task Received
      │
      ▼
Is this a simple operation?
      │
      ├─→ Yes (1-2 files, known paths, single action)
      │   └─→ EXECUTE DIRECTLY
      │
      └─→ No (complex, multi-file, unknown scope)
          │
          ▼
Does this require research/analysis?
      │
      ├─→ Yes (codebase analysis, pattern identification, dependencies)
      │   └─→ DELEGATE to subagent
      │       - Task description: Clear, specific, scoped
      │       - Context: Relevant files, directories, constraints
      │       - Agent selection: Runtime system chooses
      │
          └─→ No (implementation, verification, workflow)
              │
              ▼
Invoke appropriate Opsis skill
```

## Complexity Assessment Criteria

Before ANY task, assess complexity using these criteria:

### 1. File Count

**How many files/directories are involved?**
- 1-2 files → Simple → Execute directly
- 3-10 files → Moderate → Consider delegation
- 10+ files → Complex → Delegate to subagent

**Examples:**
```
Simple:  Read src/config.ts
Simple:  Update src/components/Button.tsx
Moderate: Analyze src/lib/utils.ts and src/lib/api.ts
Complex:  Scan all files in src/components/ directory (15+ files)
```

### 2. Known Paths

**Do I know the exact file paths?**
- Yes → Simple → Execute directly
- No/Partial → Complex → Delegate to subagent

**Examples:**
```
Known:   src/api/user.ts (explicit path)
Unknown: Find all API client files (requires pattern discovery)
Partial: Check authentication-related files (requires search)
```

### 3. Pattern Discovery

**Am I discovering patterns or applying known patterns?**
- Discovering → Complex → Delegate to subagent
- Applying → Simple → Execute directly

**Examples:**
```
Discovering: Identify state management patterns across the codebase
Applying:    Add a new component following existing pattern
Discovering: Find all error handling patterns in services
Applying:    Add error handling to a specific service
```

### 4. File Relationships

**Are files interconnected?**
- Independent → Simple → Execute directly
- Interconnected → Complex → Delegate to subagent

**Examples:**
```
Independent: Update a standalone utility function
Interconnected: Understand authentication flow across multiple modules
Independent: Add a new page component
Interconnected: Refactor shared state management across components
```

### 5. Context Requirements

**Do I need to understand architecture first?**
- Yes → Complex → Delegate to subagent
- No → Simple → Execute directly

**Examples:**
```
Context needed:   Analyze the payment system architecture
Context not needed: Add a new endpoint to existing API
Context needed:   Understand data flow between services
Context not needed: Update a configuration value
```

## Delegate vs Direct Execution Decision Matrix

| Criteria | Execute Directly | Delegate to Subagent |
|----------|------------------|----------------------|
| **File Count** | 1-2 files | 3+ files |
| **Known Paths** | Exact paths known | Paths unknown or partial |
| **Pattern Discovery** | Applying known patterns | Discovering new patterns |
| **File Relationships** | Independent files | Interconnected files |
| **Context** | Architecture understood | Architecture unknown |
| **Task Type** | Simple operations | Complex analysis |
| **Research** | None required | Analysis needed |

### Decision Logic

```
IF (file_count ≤ 2 AND known_paths = true AND pattern_discovery = false AND relationships = independent AND context = understood):
    → EXECUTE DIRECTLY

ELSE:
    → DELEGATE to subagent
```

## Delegate Prompt Templates for Codebase Analysis

When delegating to subagents, use these prompt templates based on task type:

### Template 1: Architecture Analysis

```markdown
Using subagent for architecture analysis

Task: Analyze the [system/feature] architecture in this codebase

Context:
- Primary directory: [directory-path]
- Related directories: [related-directories]

Scope:
- Identify architectural patterns and structure
- Map component relationships and dependencies
- Document data flow and key abstractions
- Note any design patterns or architectural decisions

Output: Provide a clear summary of the architecture with relevant file paths and patterns.
```

### Template 2: Pattern Identification

```markdown
Using subagent for pattern identification

Task: Identify [pattern-type] patterns in this codebase

Context:
- Search scope: [directories/glob-pattern]
- Pattern type: [state-management, error-handling, API-calls, etc.]

Scope:
- Scan relevant files to identify patterns
- Document how patterns are implemented
- Note variations or inconsistencies
- Identify any custom implementations

Output: List identified patterns with file locations and brief descriptions.
```

### Template 3: Dependency Analysis

```markdown
Using subagent for dependency analysis

Task: Analyze dependencies for [component/feature]

Context:
- Primary file/module: [file-path]
- Related code: [related-directories]

Scope:
- Identify all dependencies (imports, requires, etc.)
- Map upstream and downstream relationships
- Note any circular dependencies or coupling issues
- Document external dependencies (libraries, services)

Output: Provide a dependency map with file paths and relationship descriptions.
```

### Template 4: Codebase Context Gathering

```markdown
Using subagent for codebase context gathering

Task: Gather context for [feature/requirement] implementation

Context:
- Project directories: [directories-to-analyze]
- Feature focus: [feature-description]

Scope:
- Understand existing implementations
- Identify relevant files and patterns
- Note technical constraints or conventions
- Document any architectural considerations

Output: Provide context summary with relevant file paths, patterns, and implementation notes.
```

### Template 5: Specific Feature Analysis

```markdown
Using subagent for feature analysis

Task: Analyze the [feature-name] feature implementation

Context:
- Feature location: [directory-path]
- Related files: [related-files]

Scope:
- Understand how the feature works
- Identify key components and their roles
- Map data flow and control flow
- Note any integration points

Output: Provide a comprehensive analysis of the feature with component details and interactions.
```

## Tool Selection

For the authoritative rule on subagent vs subtask usage, see **using-opsis**:
- **Rule of Thumb:** Use subagents for research and decisions. Use subtasks for executing work.

**This skill uses:**
- `subagents---run_task` - For delegation to subagents (research, analysis, codebase understanding)
- `tasks---create_task` - For creating subtasks that execute implementation work (NOT used by this skill)

**Tool Selection Guide:**

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `subagents---run_task` | Research, analysis, decisions | Codebase analysis, pattern identification, dependency analysis, context gathering |
| `tasks---create_task` | Execute work, coordination | Implementation work, task execution, workflow coordination |

**Key Principle:** This skill (opsis-delegation-checkpoint) uses `subagents---run_task` for delegation. Implementation work using `tasks---create_task` is handled by other skills (opsis-implement, opsis-two-stage-review-execution).

## After-Delegation Workflow Steps

When delegation is required, follow these steps:

### Step 1: Declare Delegation

```markdown
Using subagent for [task description]
```

### Step 2: Invoke Subagent

Use `subagents---run_task` with:
- **Task description**: Clear, specific, scoped description of what needs to be done
- **Context**: Relevant files, directories, constraints, and scope information
- **Agent selection**: Runtime system will choose appropriate agent based on task description (do NOT hardcode agent names)

### Step 3: Review Results

After delegation completes:
1. **Analyze output** - Review the subagent's results
2. **Verify completeness** - Check if all requested information is provided
3. **Identify gaps** - Note any missing or unclear information
4. **Extract insights** - Gather key findings relevant to the workflow

### Step 4: Continue Workflow

With the delegation results:
1. **Incorporate insights** - Use the gathered information in the next workflow step
2. **Update context** - Ensure relevant files and patterns are documented
3. **Proceed to next step** - Continue with the workflow based on the delegated analysis
4. **Store relevant patterns** - If appropriate, store architectural decisions or patterns to memory

### Step 5: Verification

After continuing the workflow:
1. **Verify task completion** - Ensure the delegated task met requirements
2. **Check workflow integration** - Confirm results integrate smoothly with subsequent steps
3. **Identify next delegation needs** - Assess if additional delegation is required

## Quick Reference Table for Common Scenarios

| Scenario | Action | Reason | Tool |
|----------|--------|--------|------|
| Understand project structure | Delegate | Multi-file, pattern discovery | `subagents---run_task` |
| Read specific config file | Execute directly | Known path, single file | Power tools directly |
| Analyze existing feature | Delegate | Complex, interconnected | `subagents---run_task` |
| Fix simple bug in known file | Execute directly | Known location, isolated | Power tools directly |
| Identify dependencies | Delegate | Multi-file, relationships | `subagents---run_task` |
| Generate test for component | Execute directly | Single file, clear task | Power tools directly |
| Refactor across multiple files | Delegate | Multi-file, interdependent | `subagents---run_task` |
| Create new component | Execute directly | Single file, clear spec | Power tools directly |
| Scan directory for patterns | Delegate | Pattern discovery, unknown scope | `subagents---run_task` |
| Update documentation file | Execute directly | Known path, single file | Power tools directly |
| Analyze API architecture | Delegate | Multi-file, relationships | `subagents---run_task` |
| Add error handling to known file | Execute directly | Known location, clear task | Power tools directly |
| Identify state management patterns | Delegate | Pattern discovery, multi-file | `subagents---run_task` |
| Update configuration value | Execute directly | Single file, known path | Power tools directly |
| Understand data flow across services | Delegate | Interconnected, architecture | `subagents---run_task` |

## Anti-Patterns

### ❌ Hardcoding agent names

**Wrong:**
```markdown
Using power-agent for analysis
```

**Correct:**
```markdown
Using subagent for codebase analysis
```

**Reason:** Runtime system selects appropriate agent based on task description. Hardcoding reduces flexibility.

### ❌ Delegating simple tasks

**Wrong:**
```markdown
Using subagent to read src/config.ts
```

**Correct:**
```markdown
Read file at src/config.ts
```

**Reason:** Simple, single-file operations should be executed directly. Delegation adds overhead without benefit.

### ❌ Executing complex tasks directly

**Wrong:**
```markdown
Let me scan the entire codebase to understand the architecture...
```

**Correct:**
```markdown
Using subagent for codebase architecture analysis
```

**Reason:** Complex analysis requires pattern discovery and multi-file context. Delegation ensures comprehensive analysis.

### ❌ Skipping complexity assessment

**Wrong:**
```markdown
I'll just delegate this to be safe...
```

**Correct:**
```markdown
Assessing complexity: 1 file, known path, applying known pattern → Execute directly
```

**Reason:** Always assess complexity before making delegation decisions. Simple tasks should be executed directly.

### ❌ Providing vague delegation prompts

**Wrong:**
```markdown
Using subagent for analysis
```

**Correct:**
```markdown
Using subagent for codebase analysis

Task: Analyze the authentication system architecture
Context: src/auth/, src/middleware/, src/routes/
Scope: Identify patterns, dependencies, data flow
```

**Reason:** Clear, specific prompts ensure subagents understand the task and return relevant results.

## Integration with Opsis Skills

The Delegation Checkpoint is invoked automatically by:

### Planning Skills
- **opsis-prd** - Pre-flight delegation assessment for codebase analysis before requirements discovery
- **opsis-plan** - Delegation checkpoint for codebase analysis before task breakdown

### Implementation Skills
- **opsis-implement** - Delegation decisions for complex analysis during implementation
- **opsis-two-stage-review-execution** - Optional delegation for research before task execution
- **opsis-dispatching-parallel-agents** - Delegation decisions for parallel problem investigation

### Verification Skills
- **opsis-verify** - Delegation for complex verification scenarios requiring multi-file analysis
- **opsis-review** - Optional delegation for comprehensive code review

### Debugging Skills
- **opsis-systematic-debugging** - Delegation for root cause investigation across multiple files

### Utility Skills
- **opsis-mode-enforcer** - Mode-specific delegation permissions
- **opsis-coordinator** - Agent coordination decision framework (uses this checkpoint)

It can also be invoked directly when:
- Uncertain about task complexity
- Need to determine optimal execution strategy
- Planning multi-step workflows

## Simple Operations (Execute Directly)

Execute directly when:
- Reading 1-2 specific files with known paths
- Simple directory listing (`ls`, `find` with basic patterns)
- Single file write/edit operation
- Simple grep search in known file
- Known command execution with clear parameters

**Examples:**
```bash
# Simple file read
Read file at src/components/Button.tsx

# Simple directory list
List files in src/lib/

# Single file edit
Update line 42 in src/config.ts

# Simple grep search
Search for "export function" in src/utils.ts
```

## Complex Operations (Delegate to Subagent)

Delegate to subagent when:
- Scanning multiple directories (>3)
- Reading 10+ files to understand patterns
- Analyzing code architecture across packages
- Identifying dependencies and imports
- Complex file pattern matching
- Multi-file context gathering
- Understanding existing implementations
- Analyzing project structure

**Examples:**
```markdown
Using subagent for codebase analysis

Task: Analyze the authentication system architecture
Context: src/auth/, src/middleware/, src/routes/
Scope: Identify patterns, dependencies, data flow
```

## Specialized Workflows (Invoke Opsis Skill)

Invoke Opsis skills when:
- Requirements discovery needed → opsis-prd
- Task breakdown needed → opsis-plan
- Implementation execution → opsis-implement or opsis-two-stage-review-execution
- Code verification → opsis-verify
- Bug investigation → opsis-systematic-debugging
- Parallel problem solving → opsis-dispatching-parallel-agents

## Common Delegation Scenarios

| Scenario | Action | Reason |
|----------|--------|--------|
| Understand project structure | Delegate | Multi-file, pattern discovery |
| Read specific config file | Execute directly | Known path, single file |
| Analyze existing feature | Delegate | Complex, interconnected |
| Fix simple bug in known file | Execute directly | Known location, isolated |
| Identify dependencies | Delegate | Multi-file, relationships |
| Generate test for component | Execute directly | Single file, clear task |
| Refactor across multiple files | Delegate | Multi-file, interdependent |
| Create new component | Execute directly | Single file, clear spec |

## Verification

After delegation or direct execution, verify:
1. Task was completed accurately
2. Results meet requirements
3. Proceed to next workflow step
4. Update TODO list if applicable

## Quick Reference

| Complexity | Operation | Strategy |
|------------|-----------|----------|
| Simple | 1-2 files, known paths | Execute directly |
| Moderate | 3-10 files, partial context | Consider delegation |
| Complex | 10+ files, unknown scope | Delegate to subagent |
| Research | Pattern discovery | Delegate to subagent |
| Implementation | Known spec, clear task | Execute directly or use skill |
| Verification | Simple check | Execute directly |
| Verification | Complex analysis | Delegate or use opsis-verify |

## Remember

- Assess complexity before every task
- Delegate when uncertain about scope
- Execute directly for simple, known operations
- Never hardcode agent names
- Let runtime system select appropriate agent
- Describe tasks clearly with context
- Verify results after execution
- Use appropriate prompt templates for delegation
- Follow after-delegation workflow steps
