---
name: opsis-contract-examples
description: Comprehensive examples for preconditions, postconditions, and success metrics. Reference when implementing skill contracts or handling edge cases.
license: Apache-2.0
---

# opsis-contract-examples

Comprehensive contract examples for skill authors.

## When to Use

**Reference when:**
- Writing preconditions for a new skill
- Handling precondition failures
- Defining postcondition verification steps
- Creating success metrics

## Preconditions Examples

### Artifacts Check

```markdown
## Preconditions
- [ ] PRD exists at `{SAVE_BASE}/{project}/full-prd.md`
- [ ] tasks.md exists with unchecked items
- [ ] Configuration file readable
```

### Tools Check

```markdown
## Preconditions
- [ ] `skills---activate_skill` tool available
- [ ] `power---file_read` access to project files
- [ ] Write permission to `.aider-desk/opsis/outputs/`
```

### Previous Steps Check

```markdown
## Preconditions
- [ ] PRD creation complete via `opsis-prd`
- [ ] Decision Point Gate completed
- [ ] Mode declared via `opsis-mode-enforcer`
```

### TODO State Check

```markdown
## Preconditions
- [ ] TODO list checked via `todo---get_items`
- [ ] No conflicting in-progress tasks
- [ ] Previous task marked complete
```

## Precondition Failure Templates

### Template Structure

```
❌ PRECONDITION FAILED
├─ Failed Condition: [which precondition]
├─ Current State: [what's actually true]
├─ Required State: [what should be true]
├─ Suggested Action: [what user should do]
├─ Can I Help: [offer fixing skill]
└─ Status: HALTED - Cannot proceed
```

### Example: Missing PRD

```
❌ PRECONDITION FAILED
├─ Failed Condition: PRD exists at .aider-desk/opsis/outputs/{project}/full-prd.md
├─ Current State: full-prd.md not found
├─ Required State: PRD must exist before task breakdown
├─ Suggested Action: Create PRD via opsis-prd first
├─ Can I Help: Shall I invoke opsis-prd to create the requirements?
└─ Status: HALTED - Cannot proceed
```

### Example: No Unchecked Tasks

```
❌ PRECONDITION FAILED
├─ Failed Condition: tasks.md exists with unchecked items
├─ Current State: All 7 tasks checked, none remaining
├─ Required State: At least one unchecked task for implementation
├─ Suggested Action: Create new tasks or verify all tasks complete
├─ Can I Help: Shall I invoke opsis-verify to confirm completion?
└─ Status: HALTED - Cannot proceed
```

## Postconditions Examples

### Artifacts Created

```markdown
## Postconditions
- [ ] tasks.md created with N tasks (verified via file_read)
- [ ] Code changes saved to repository
- [ ] Test output logged to test-results.log
```

### Content Verified

```markdown
## Postconditions
- [ ] All tasks include description and acceptance criteria
- [ ] Code compiles without errors (verified via go build)
- [ ] All tests pass (verified via go test)
```

### TODO Updated

```markdown
## Postconditions
- [ ] Current task marked complete via `todo---update_item_completion`
- [ ] Next task identified or TODO list cleared
```

## Postcondition Verification Templates

### Template Structure

```
✅ POSTCONDITIONS VERIFIED
├─ Artifacts Created: [list of created artifacts]
├─ Content Verified: [what was checked and result]
├─ TODO Updated: [state of TODO list]
├─ Next Action: [recommended next step]
└─ Evidence: [verification results]
```

### Example: Task Creation

```
✅ POSTCONDITIONS VERIFIED
├─ Artifacts Created: tasks.md (7 tasks), config/auth.yaml
├─ Content Verified: All tasks have descriptions and acceptance criteria
├─ TODO Updated: Task 1 ready, 6 unchecked
├─ Next Action: Proceed with Task 2 (implement auth service)
└─ Evidence:
   - tasks.md created with 7 tasks
   - All tasks have descriptions
   - config/auth.yaml has valid YAML structure
```

### Example: Implementation

```
✅ POSTCONDITIONS VERIFIED
├─ Artifacts Created: src/auth/service.go, src/auth/service_test.go
├─ Content Verified:
   - Code compiles: go build ./src/auth/... (PASS)
   - Tests pass: go test ./src/auth/... (7/7 PASS)
├─ TODO Updated: Task 2 marked complete
├─ Next Action: Proceed with Task 3 (add middleware)
└─ Evidence:
   - Build output: ok
   - Test output: 7 passed, 0 failed
```

## Success Metrics Examples

### PRD Creation Skill

```markdown
## Success Metrics
- [ ] PRD created with all required sections (Problem, Requirements, Out of Scope)
- [ ] Quick PRD generated for AI context
- [ ] User validated requirements (no major corrections requested)
- [ ] Artifacts saved to correct location
```

### Implementation Skill

```markdown
## Success Metrics
- [ ] All planned tasks completed
- [ ] Code compiles without errors
- [ ] Tests pass (if test-driven)
- [ ] No regressions in existing functionality
- [ ] User satisfied with implementation
```

### Verification Skill

```markdown
## Success Metrics
- [ ] All PRD requirements checked against implementation
- [ ] Issues identified and documented (if any)
- [ ] Verification report generated
- [ ] Recommendations provided for issues found
```

## Integration Checklist

When creating a skill:

- [ ] Preconditions section exists with specific checks
- [ ] Preconditions failure handling defined with template
- [ ] Postconditions section exists with verification steps
- [ ] Postconditions verification uses specific tools
- [ ] Success metrics are measurable
- [ ] All failure paths have corrective actions