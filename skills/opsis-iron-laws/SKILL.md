---
name: opsis-iron-laws
description: Core principles for Opsis workflow. Three Iron Laws governing verification, planning, and fix loops.
license: Apache-2.0
---

# opsis-iron-laws

Core principles for Opsis workflow.

## The Three Iron Laws

### Iron Law 1: No Completion Without Verification

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

If you haven't run the verification command, you cannot claim it passes.

### Iron Law 2: No Implementation Without Planning

```
NO CODE CHANGES WITHOUT A PLAN OR TASK SPECIFICATION
```

If you're implementing features, there should be a PRD or task list guiding the work.

### Iron Law 3: No Skipping Fix Loops

```
ISSUES FOUND = ISSUES FIXED + RE-VERIFIED
```

If verification found issues, you must fix them AND re-verify. Proceeding without re-verification is forbidden.

## Enforcement

**Reference:** `opsis-mode-enforcer` - Mode boundaries and self-correction

## Integration

All Opsis skills operate under these laws:
- `opsis-implement` - Requires verification before completion claims
- `opsis-plan` - Blocks implementation during planning
- `opsis-verify` - Enforces fix + re-verify loops

## Need More Detail?

**Invoke `opsis-iron-laws-guide` for:**
- Detailed rationale for each law
- Enforcement patterns
- Violation examples
- Mode enforcement details
- Integration with specific skills