---
name: opsis-coordinator
description: "Agent coordination decision framework for Opsis workflow. Use when determining whether to delegate tasks to subagents or execute directly. Provides complete decision tree, complexity assessment, delegation vs direct execution matrix, prompt templates, and after-delegation workflow."
license: Apache-2.0
---

# Opsis Coordinator

Agent coordination decision framework that assesses task complexity and determines the optimal execution strategy: direct execution, subagent delegation, or specialized skill invocation.

## When to Use

Use this skill when:

- Uncertain whether to delegate a task or execute directly
- Need to assess task complexity before execution
- Planning multi-step workflows that involve delegation
- Determining optimal execution strategy

Do not use when:

- Task is clearly simple (1-2 files, known paths)
- Task is clearly complex (10+ files, unknown scope)
- Workflow-specific skill already invoked

## Rules

### Rule: Assess complexity before action

**When:** Starting any task

**Then:** Assess complexity using criteria below

**If:** Simple operation (1-2 files, known paths)
**Then:** Execute directly

**If:** Complex operation (10+ files, unknown scope)
**Then:** Delegate to subagent

**If:** Specialized workflow needed
**Then:** Invoke appropriate Opsis skill

### Rule: Use delegation checklist

**When:** Delegating to subagent

**Then:** Include all required elements

**Required elements:**
- Clear, specific task description
- Relevant files and directories
- Constraints and scope boundaries
- Output format requirements

**Never:** Hardcode agent names

### Rule: Execute simple tasks directly

**When:** Task meets all simple criteria

**Then:** Execute without delegation

**Simple criteria:**
- 1-2 files involved
- Exact file paths known
- Applying known patterns
- Files are independent
- Architecture understood

### Rule: Delegate complex analysis

**When:** Task meets any complex criterion

**Then:** Delegate to subagent

**Complex criteria:**
- 10+ files involved
- Paths unknown or partial
- Discovering patterns
- Files interconnected
- Architecture unknown

### Rule: Verify delegation results

**When:** Delegation completes

**Then:**
- Analyze output from subagent
- Verify completeness of information
- Extract relevant insights
- Continue workflow with gathered context

## Process

1. Assess task complexity
2. Check file count and known paths
3. Determine pattern discovery vs application
4. Evaluate file relationships and context requirements
5. Choose execution strategy
6. If delegating: create subagent with complete prompt
7. If executing directly: proceed with operation
8. Verify results
9. Continue workflow

## Preconditions

Before using this skill, verify:

- Task or operation has been identified
- Scope or complexity is uncertain
- Decision needed between delegation and direct execution

## Postconditions

After completing this skill, verify:

- Clear decision made: delegate OR execute directly
- If delegating: subagent invoked with clear task description
- If executing directly: operation proceeds with known scope
- Workflow continues with next step

## Success Metrics

This skill is successful when:

- Complexity assessment correctly identifies simple vs complex operations
- Delegation decisions match task characteristics
- Executed operations complete without mid-task delegation
- Delegated tasks return complete, actionable results
- Workflow continues smoothly after delegation checkpoint

## Common Situations

**Situation:** Understanding project structure

**Pattern:**
- When: Multi-file discovery needed
- Then: Delegate to subagent

**Situation:** Reading specific config file

**Pattern:**
- When: Known path, single file
- Then: Execute directly

**Situation:** Analyzing existing feature

**Pattern:**
- When: Complex, interconnected components
- Then: Delegate to subagent

**Situation:** Fixing simple bug in known file

**Pattern:**
- When: Known location, isolated issue
- Then: Execute directly

**Situation:** Identify dependencies

**Pattern:**
- When: Multi-file, relationship analysis
- Then: Delegate to subagent

**Situation:** Generate test for component

**Pattern:**
- When: Single file, clear task
- Then: Execute directly

**Situation:** Scan directory for patterns

**Pattern:**
- When: Pattern discovery, unknown scope
- Then: Delegate to subagent
