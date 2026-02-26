---
name: opsis-contract
description: Contract pattern for Opsis skills. Standard preconditions, postconditions, and success metrics templates for skill authors.
license: Apache-2.0
---

# Opsis Contract

Contract pattern for Opsis skills. Provides standard preconditions, postconditions, and success metrics templates.

## When to Use

**Reference this skill when:**
- Creating a new Opsis skill
- Adding preconditions/postconditions to existing skills
- Defining success criteria for a skill

**Need examples?** See `opsis-contract-examples` for comprehensive examples and edge cases.

---

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

---

## Standard Postconditions

**Every skill MUST include:**

| Category | Check | Example |
|----------|-------|---------|
| Artifacts | Files created | `tasks.md` with N tasks |
| Content | Quality verified | All tasks have descriptions |
| TODO | State updated | Current task marked complete |

### Verification Steps

After completing a skill:

```
✅ POSTCONDITIONS VERIFIED
├─ Artifacts Created: [list]
├─ Content Verified: [what was checked]
├─ TODO Updated: [state]
├─ Next Action: [recommended step]
└─ Evidence: [verification results]
```

---

## Standard Success Metrics

**Every skill MUST include:**

| Metric Type | Example |
|-------------|---------|
| Artifact quality | PRD has all required sections |
| Task completion | All tasks in tasks.md marked complete |
| Verification | Tests pass (0 failures) |
| User satisfaction | No corrections requested |

---

## Skill Contract Template

```markdown
## Preconditions
- [ ] [Artifact check]
- [ ] [Tool check]
- [ ] [Step completion check]
- [ ] [TODO state check]

## Postconditions
- [ ] [Artifact creation verified]
- [ ] [Content quality verified]
- [ ] [TODO state updated]

## Success Metrics
- [ ] [Measurable outcome 1]
- [ ] [Measurable outcome 2]
- [ ] [Measurable outcome 3]
```

---

## Integration with Opsis Skills

All Opsis skills use this contract pattern:

**Planning Skills:**
- `opsis-prd` - Preconditions: user intent identified; Postconditions: PRD created
- `opsis-plan` - Preconditions: PRD exists; Postconditions: tasks.md created
- `opsis-start` - Preconditions: vague idea; Postconditions: requirements gathered

**Implementation Skills:**
- `opsis-implement` - Preconditions: tasks.md exists; Postconditions: tasks complete, code committed
- `opsis-two-stage-review-execution` - Preconditions: tasks.md exists; Postconditions: all tasks complete

**Verification Skills:**
- `opsis-verify` - Preconditions: implementation complete; Postconditions: verification report generated
- `opsis-review` - Preconditions: code changes exist; Postconditions: review comments generated

---

## Need More Detail?

**For comprehensive examples and edge cases, see `opsis-contract-examples`:**
- Detailed precondition examples (artifacts, tools, steps, TODO)
- Precondition failure templates with specific examples
- Postcondition verification examples with evidence
- Success metrics for different skill types
- Integration checklist for skill authors
