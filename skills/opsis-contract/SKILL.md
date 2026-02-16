---
name: opsis-contract
description: Contract pattern for Opsis skills. Standard preconditions, postconditions, and success metrics templates for skill authors.
license: Apache-2.0
---

# opsis-contract

Contract pattern for Opsis skills. Provides standard preconditions, postconditions, and success metrics templates.

## When to Use

**Reference this skill when:**
- Creating a new Opsis skill
- Adding preconditions/postconditions to existing skills
- Defining success criteria for a skill

## Standard Preconditions

**Every skill MUST include:**

| Category | Check | Example |
|----------|-------|---------|
| Artifacts | Required files exist | `tasks.md` exists with unchecked items |
| Tools | Tools available | `skills---activate_skill` available |
| Steps | Previous complete | PRD creation via `opsis-prd` complete |
| TODO | Correct state | Current task unchecked, no conflicts |

### Failure Handling

When preconditions fail:

```
❌ PRECONDITION FAILED
├─ Failed: [which condition]
├─ Current: [actual state]
├─ Required: [expected state]
├─ Action: [what to do]
├─ Help: [offer fixing skill]
└─ Status: HALTED
```

## Standard Postconditions

**Every skill MUST include:**

| Category | Check | Example |
|----------|-------|---------|
| Artifacts | Files created | `tasks.md` with N tasks |
| Content | Quality verified | All tasks have descriptions |
| TODO | State updated | Task marked complete via `todo---update_item_completion` |
| Next | Action clear | "Proceed with Task 2" |

### Verification Steps

Before claiming completion:

1. **Verify artifacts** - Use `power---file_read`, `power---glob`
2. **Verify content** - Run tests, check structure
3. **Verify TODO** - Use `todo---get_items`
4. **Display results** - Show evidence to user

### Completion Template

```
✅ POSTCONDITIONS VERIFIED
├─ Artifacts: [list created]
├─ Content: [what checked + result]
├─ TODO: [current state]
├─ Next: [next action]
└─ Evidence: [verification output]
```

## Standard Success Metrics

**Every skill MUST define:**

1. **Completion** - When is skill done? (e.g., "All tasks checked")
2. **Quality** - What defines quality? (e.g., "All tests pass")
3. **Satisfaction** - How to know user satisfied? (e.g., "No corrections requested")
4. **Integrity** - Was workflow followed? (e.g., "No protocol violations")

## Integration

All Opsis skills reference this contract pattern:
- `opsis-prd` - Preconditions: none; Postconditions: PRD created
- `opsis-plan` - Preconditions: PRD exists; Postconditions: tasks.md created
- `opsis-implement` - Preconditions: tasks.md exists; Postconditions: code implemented
- `opsis-verify` - Preconditions: implementation complete; Postconditions: verification report

## Need More Detail?

**Invoke `opsis-contract-examples` for:**
- Extensive precondition/postcondition templates
- Failure handling examples
- Verification step patterns
- Success metrics examples

## Quick Template

```markdown
## Preconditions
- [ ] [artifact/tool/step/todo] - [specific requirement]

## Postconditions
- [ ] [artifact] - [created/verified]
- [ ] [TODO] - [updated]

## Success Metrics
- [ ] [criterion] - [how measured]
```