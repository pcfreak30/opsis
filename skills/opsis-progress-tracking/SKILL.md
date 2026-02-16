---
name: opsis-progress-tracking
version: 1.0.0
location: global
description: Progress tracking and standardized reporting using TODO list integration.
license: Apache-2.0
---

# Opsis Progress Tracking

Track and report task progress using TODO list integration with standardized progress reports.

## Core Principle

**Consistent progress tracking + standardized reporting = clear project visibility and reliable completion claims**

## Activation Logging

When activating this skill, always announce:

```text
Using opsis-progress-tracking to track task progress and generate standardized reports
```

## Mode Declaration

**OPSIS MODE: Implementation**
Mode: implementation
Purpose: Tracking task progress and generating standardized progress reports
Implementation: AUTHORIZED - TODO list updates and progress reporting

## When to Use

**Use opsis-progress-tracking when:**
- Executing implementation tasks from tasks.md
- Managing TODO lists for multi-task workflows
- Generating progress reports for task completion
- Reporting verification results in standardized format
- Tracking completion percentages and task counts

**Use alternative approaches when:**
- Single quick task without need for tracking → Use direct execution (no TODO tools)
- Non-implementation work (documentation, research) → Use opsis-start or opsis-summarize
- Simple verification without structured reporting → Use opsis-verify directly

## Tool Selection

This skill uses the TODO management tools:

| Tool | Purpose | When to Use | Mode |
|------|---------|-------------|------|
| `todo---get_items` | Check current TODO state | Before any action, when resuming work | Any |
| `todo---set_items` | Create new TODO list | Starting new work, initializing task tracking | Planning/Implementation |
| `todo---update_item_completion` | Mark tasks complete | After completing each task | Implementation |

**Tool Usage Pattern:**

```
1. Start: todo---get_items (check if existing work)
2. Initialize: todo---set_items (create new list with initialUserPrompt)
3. Progress: todo---update_item_completion (mark tasks complete)
4. Monitor: todo---get_items (review remaining tasks)
```

## Preconditions

- TODO management tools are available (`todo---get_items`, `todo---set_items`, `todo---update_item_completion`)
- Task list or PRD is available for reference
- Working directory is accessible

## Postconditions

- TODO list accurately reflects current project state
- All completed tasks are marked as completed
- Progress reports are generated in standardized format
- Verification results are documented with Review Board tables

## Success Metrics

- All tasks marked complete in TODO list
- Progress percentage reaches 100%
- Verification reports contain zero critical issues
- Standardized report formats used consistently

---

## TODO List Integration Patterns

### Initial Setup Pattern

**When starting new work:**

```json
todo---set_items({
    "items": [
        {"name": "Task 1: Description", "completed": false},
        {"name": "Task 2: Description", "completed": false},
        {"name": "Task 3: Description", "completed": false}
    ],
    "initialUserPrompt": "Original user request context"
})
```

### Resume Check Pattern

**When continuing work:**

```json
// Always check first
todo---get_items()

// If items found:
// - Read tasks.md to understand current position
// - Identify next incomplete task
// - Continue from that point

// If no items:
// - New work or completed work
// - Ask user or check for tasks.md
```

### Task Completion Pattern

**After each task completes:**

```json
// Mark specific task as complete
todo---update_item_completion({
    "name": "Task 1: Description",
    "completed": true
})

// Then check remaining
todo---get_items()
```

### Progress Monitoring Pattern

**After updating completion:**

```json
// Review the returned list
// - Count completed vs total
// - Calculate percentage
// - Identify next task to work on
```

---

## Standardized Progress Report Format

### Task Completion Report

**After each task completes:**

```
✅ Task Complete: "{task_title}"
Progress: [completed]/[total] tasks ([percentage]%)
```

**Example:**

```
✅ Task Complete: "Create API endpoint for user authentication"
Progress: 3/10 tasks (30%)
```

### Phase Completion Report

**After all tasks in a phase complete:**

```
✅ Phase Complete: "{phase_name}"
Tasks: [completed]/[total] complete ([percentage]%)
Next Phase: "{next_phase_name}"
```

**Example:**

```
✅ Phase Complete: "Backend API Development"
Tasks: 15/15 complete (100%)
Next Phase: "Frontend Integration"
```

### Final Completion Report

**After all tasks complete:**

```
🎉 All Tasks Complete
Total Tasks: [total]
Duration: [time_period]
Status: Ready for verification
```

**Example:**

```
🎉 All Tasks Complete
Total Tasks: 42
Duration: 3 hours 15 minutes
Status: Ready for verification
```

---

## Verification Report Format

### Review Board Table

**When reporting verification results:**

```
| ID | Severity | Location | Issue |
|:--:|:--------:|:---------|:------|
| 1  | Critical | file.ts:42 | Security vulnerability |
| 2  | High     | api.js:15  | Missing error handling |
| 3  | Medium   | utils.go:8 | Inefficient algorithm |
```

### Severity Levels

| Severity | Description | When to Use |
|----------|-------------|-------------|
| Critical | Blocks deployment, security issue, data loss risk | Security vulnerabilities, crashes |
| High     | Major functionality broken, significant bug | Broken features, serious bugs |
| Medium   | Minor functionality issue, performance concern | Non-optimal code, edge cases |
| Low      | Style, documentation, minor improvements | Code style, typos, formatting |

### Verification Summary

**After verification complete:**

```
Verification Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Issues: [count]
  Critical: [count]
  High: [count]
  Medium: [count]
  Low: [count]
Status: [PASS | FAIL | REVIEW NEEDED]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Example:**

```
Verification Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Issues: 3
  Critical: 0
  High: 1
  Medium: 2
  Low: 0
Status: FAIL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## report_task_complete() Function Template

### Function Signature

```javascript
/**
 * Report task completion with standard progress tracking
 * @param {string} taskName - The name/title of the completed task
 * @param {number} completedCount - Number of completed tasks
 * @param {number} totalCount - Total number of tasks
 * @param {Object} options - Optional parameters
 * @param {string} options.phase - Phase name if applicable
 * @param {string} options.notes - Additional notes or context
 * @returns {string} Standardized progress report
 */
function report_task_complete(taskName, completedCount, totalCount, options = {}) {
    const percentage = Math.round((completedCount / totalCount) * 100);
    
    let report = `✅ Task Complete: "${taskName}"\n`;
    report += `Progress: ${completedCount}/${totalCount} tasks (${percentage}%)\n`;
    
    if (options.phase) {
        report += `Phase: ${options.phase}\n`;
    }
    
    if (options.notes) {
        report += `Notes: ${options.notes}\n`;
    }
    
    return report;
}
```

### Usage Examples

**Basic usage:**

```javascript
report_task_complete(
    "Create API endpoint for user authentication",
    3,
    10
);
// Output:
// ✅ Task Complete: "Create API endpoint for user authentication"
// Progress: 3/10 tasks (30%)
```

**With phase and notes:**

```javascript
report_task_complete(
    "Implement user registration flow",
    5,
    15,
    {
        phase: "Backend API Development",
        notes: "Includes email verification and password hashing"
    }
);
// Output:
// ✅ Task Complete: "Implement user registration flow"
// Progress: 5/15 tasks (33%)
// Phase: Backend API Development
// Notes: Includes email verification and password hashing
```

---

## TODO Update Patterns After Task Completion

### Standard Update Pattern

**After completing each task:**

```json
// 1. Mark task complete
todo---update_item_completion({
    "name": "Task Name: Description",
    "completed": true
})

// 2. Get updated list
todo---get_items()

// 3. Calculate progress
completed = count items where item["completed"] == true
total = count items
percentage = (completed / total) * 100

// 4. Generate report
report: "✅ Task Complete: \"Task Name: Description\""
report: "Progress: {completed}/{total} tasks ({percentage}%)"
```

### Batch Update Pattern

**When multiple tasks complete together:**

```json
tasks_to_complete = [
    "Task 1: Description",
    "Task 2: Description",
    "Task 3: Description"
]

for each task_name in tasks_to_complete:
    todo---update_item_completion({
        "name": task_name,
        "completed": true
    })

// Get final state
todo---get_items()
```

### Progressive Update Pattern

**During continuous execution (e.g., opsis-two-stage-review-execution):**

```json
for each_task in task_list:
    // Execute task
    execute_task(each_task)
    
    // Update immediately after completion
    todo---update_item_completion({
        "name": each_task["name"],
        "completed": true
    })
    
    // Get updated list for progress calculation
    items = todo---get_items()
    completed = count items where item["completed"] == true
    total = count items
    
    // Report progress
    report: "✅ Task Complete: \"{each_task['name']}\""
    report: "Progress: {completed}/{total} tasks ({round(completed/total*100)}%)"
    
    // Continue immediately (no pause)
```

---

## Integration with Opsis Workflows

### With opsis-implement

**Standard execution flow in opsis-implement:**

```json
// 1. Check TODO state
todo---get_items()

// 2. Read tasks.md
// (implementation plan content)

// 3. For each task:
for each task in tasks:
    // Execute task
    implement(task)
    
    // Verify task
    verify(task)
    
    // Mark complete
    todo---update_item_completion({
        "name": task["name"],
        "completed": true
    })
    
    // Report progress
    report_task_complete(task["name"], completed, total)
```

### With opsis-two-stage-review-execution

**Continuous execution with progress tracking:**

```json
// 1. Initialize TODO list
todo---set_items({
    "items": task_list,
    "initialUserPrompt": original_prompt
})

// 2. Continuous execution loop
for i, task in enumerate(task_list):
    // Create and execute subtask
    tasks---create_task({
        "prompt": implementer_prompt(task),
        "parentTaskId": current_task_id,
        "execute": true,
        "executeInBackground": false
    })
    
    // Wait for completion, then update TODO
    todo---update_item_completion({
        "name": task["name"],
        "completed": true
    })
    
    // Report progress and continue immediately
    completed = i + 1
    total = count task_list
    report: "✅ Task Complete: \"{task['name']}\""
    report: "Progress: {completed}/{total} tasks ({round(completed/total*100)}%)"
    
    // DO NOT pause or wait for user input
    // Continue to next task immediately
```

### With opsis-verify

**Verification reporting with Review Board table:**

```json
// Run verification
results = run_verification()

// Generate Review Board table
report: "| ID | Severity | Location | Issue |"
report: "|:--:|:--------:|:---------|:------|"

for i, issue in enumerate(results["issues"], 1):
    report: "| {i} | {issue['severity']} | {issue['location']} | {issue['description']} |"

// Generate summary
report: "\nVerification Summary"
report: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
report: "Total Issues: {count results['issues']}"
report: "  Critical: {results['summary']['critical']}"
report: "  High: {results['summary']['high']}"
report: "  Medium: {results['summary']['medium']}"
report: "  Low: {results['summary']['low']}"
report: "Status: {results['status']}"
report: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
```

---

## Best Practices

### DO ✅

- Always check TODO state with `todo---get_items` before starting work
- Update TODO immediately after each task completes
- Use standardized progress report formats
- Include verification results in Review Board table format
- Calculate percentages accurately (rounded to whole numbers)
- Report progress after each task in continuous execution

### DO NOT ❌

- Skip TODO updates for "small" tasks
- Use inconsistent report formats
- Pause for user confirmation between tasks (unless required by workflow)
- Forget to mark tasks as complete in TODO list
- Claim completion without verification evidence
- Use vague progress descriptions (e.g., "almost done", "working on it")

### Progress Calculation

```json
// Correct calculation
percentage = round((completed / total) * 100)

// Edge cases
if total == 0:
    percentage = 0  // Avoid division by zero
elif completed > total:
    percentage = 100  // Cap at 100%
```

---

## References

- **using-opsis** - Meta-skill establishing workflow rules and Iron Laws
- **opsis-two-stage-review-execution** - Sequential task execution with two-stage review
- **opsis-implement** - General execution with optional quality skills
- **opsis-verify** - Spec-driven technical audit
- **opsis-verification-before-completion** - Evidence before claims

---

## License

Apache-2.0
