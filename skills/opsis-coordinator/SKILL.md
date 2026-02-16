---
name: opsis-coordinator
description: Agent coordination decision framework for Opsis workflow. Use when determining whether to delegate tasks to subagents or execute directly. Assess task complexity and route to appropriate agent.
license: Apache-2.0
---

# Opsis Coordinator

Agent coordination decision framework that assesses task complexity and determines the optimal execution strategy: direct execution, subagent delegation, or specialized skill invocation.

## When to Use

**Invoke opsis-coordinator when:**
- Uncertain whether to delegate a task or execute directly
- Need to assess task complexity before execution
- Planning multi-step workflows that involve delegation
- Determining optimal execution strategy

**Note:** This skill is automatically applied by other Opsis skills through their delegation checkpoints. You typically invoke it directly only when making a standalone delegation decision.

## Mode Declaration

**OPSIS MODE: Coordination**
Mode: coordination
Purpose: Assessing task complexity and determining optimal execution strategy
Implementation: ROUTING - I will delegate or execute based on task complexity

## Core Principle

**ASSESS BEFORE ACT: Every task requires a complexity assessment before execution.**

Before executing any task, determine:
1. Is this a simple, single-file operation? → Execute directly
2. Is this a complex analysis or multi-file operation? → Delegate to subagent
3. Does this require specialized workflow? → Invoke appropriate Opsis skill

## Integration

This skill provides the delegation framework used by:
- **using-opsis** - Entry point for all Opsis workflows
- **opsis-mode-enforcer** - Mode-specific delegation permissions
- **opsis-prd** - Pre-flight delegation assessment for requirements discovery
- **opsis-plan** - Delegation checkpoint for codebase analysis
- **opsis-two-stage-review-execution** - Task-based execution with two-stage review
- **opsis-dispatching-parallel-agents** - Parallel agent coordination

**Note:** This skill is automatically applied by other Opsis skills through their delegation checkpoints. You typically invoke it directly only when making a standalone delegation decision.

## Delegation Decision Tree

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
- Implementation execution → opsis-implement
- Code verification → opsis-verify
- Bug investigation → opsis-systematic-debugging
- Parallel problem solving → opsis-dispatching-parallel-agents

## Task Complexity Assessment

Before ANY task, ask these questions:

1. **Scope**: How many files/directories are involved?
   - 1-2 files → Simple
   - 3-10 files → Moderate (consider delegation)
   - 10+ files → Complex (delegate)

2. **Knowledge**: Do I know the exact file paths?
   - Yes → Simple
   - No/Partial → Complex (delegate)

3. **Pattern**: Am I discovering patterns or applying known patterns?
   - Discovering → Complex (delegate)
   - Applying → Simple (execute directly)

4. **Relationship**: Are files interconnected?
   - Independent → Simple
   - Interconnected → Complex (delegate)

5. **Context**: Do I need to understand architecture first?
   - Yes → Complex (delegate)
   - No → Simple (execute directly)

## Delegation Protocol

When delegation is required:

1. **Declare delegation:**
   ```markdown
   Using subagent for [task description]
   ```

2. **Invoke subagent:**
   - Use `subagents---run_task`
   - Provide clear task description
   - Include relevant context
   - Let runtime system select agent

3. **Review results:**
   - Analyze output
   - Verify completeness
   - Continue workflow with insights

4. **No agent specification:**
   - Never hardcode agent names
   - Runtime system selects based on task
   - Describe task, not agent

## Example Delegation Prompts

**Codebase Analysis:**
```markdown
Analyze the authentication flow in this codebase:
- Examine src/auth/ directory structure
- Identify authentication patterns and dependencies
- Map data flow from login to token validation
- Document any security considerations
```

**Pattern Identification:**
```markdown
Identify state management patterns in this React application:
- Scan src/components/ and src/lib/ directories
- Find state management libraries (Context, Redux, Zustand?)
- Document patterns used across components
- Note any custom hooks for state
```

**Dependency Analysis:**
```markdown
Analyze the API layer architecture:
- Examine src/api/ and src/services/ directories
- Identify API client patterns
- Map dependencies between services
- Document error handling patterns
```

## Mode Integration

The Coordinator works across all Opsis modes:

### Planning Mode
- Delegate codebase analysis for requirements discovery
- Execute directly for simple file reads during PRD creation

### Implementation Mode
- Delegate complex code analysis during implementation
- Execute directly for simple file modifications
- Use opsis-two-stage-review-execution for multi-task plans

### Verification Mode
- Delegate complex code review if needed
- Execute directly for simple verification checks
- Use opsis-verify for spec-driven audits

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

## Anti-Patterns

**❌ Hardcoding agent names:**
```markdown
Using power-agent for analysis
```
**✅ Describe task, let runtime decide:**
```markdown
Using subagent for codebase analysis
```

**❌ Delegating simple tasks:**
```markdown
Using subagent to read src/config.ts
```
**✅ Execute directly:**
```markdown
Read file at src/config.ts
```

**❌ Executing complex tasks directly:**
```markdown
Let me scan the entire codebase to understand the architecture...
```
**✅ Delegate:**
```markdown
Using subagent for codebase architecture analysis
```

## Integration with Opsis Skills

The Coordinator is invoked automatically by:
- opsis-prd (for codebase analysis before requirements)
- opsis-plan (for context analysis before task breakdown)
- opsis-implement (for complex analysis during implementation)
- opsis-systematic-debugging (for root cause investigation)
- opsis-verify (for complex verification scenarios)

It can also be invoked directly when:
- Uncertain about task complexity
- Need to determine optimal execution strategy
- Planning multi-step workflows

## Verification

After delegation or direct execution:
1. Verify the task was completed accurately
2. Check if results meet requirements
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
