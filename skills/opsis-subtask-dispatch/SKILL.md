---
name: opsis-subtask-dispatch
description: Layer 1 primitive utility for subtask dispatch with dependency injection. Extracts, fetches, and attaches dependencies to subtask prompts, creating manifest tracking and cleanup support.
license: Apache-2.0
---

## When to Use

**Use opsis-subtask-dispatch when:**
- Creating subtasks that need external dependencies (URLs, files, samples)
- Implementing tasks where reference materials must be attached
- Dispatching review tasks with external reference documentation
- Any subtask creation where context files should be auto-injected

**Do NOT use when:**
- Simple subtasks without dependencies (use tasks---create_task directly)
- Dependencies are already available in the current session context
- Manual context attachment is preferred

## Tool Selection

For the authoritative rule on subagent vs subtask usage, see **using-opsis**:
- **Rule of Thumb:** Use subagents for research and decisions. Use subtasks for executing work.

**This skill uses `tasks---create_task`** because:
- Dependency files must be tracked with the subtask lifecycle
- Manifest tracking requires parent-child task relationships
- Cleanup automation needs task completion events
- Subtask may be retried with preserved dependencies

## Core Principle

**AUTOMATIC DEPENDENCY INJECTION WITH CLEANUP GUARANTEE**

Extract dependencies from prompts, fetch/read them, attach to subtask, and automatically clean up after completion. The system degrades gracefully when dependencies fail.

# Opsis Subtask Dispatch

Primitive utility function for dispatching subtasks with automatic dependency injection, manifest tracking, and cleanup support.

## Function Signature

```python
dispatch_subtask(
    task_description: str,
    parent_task_id: str,
    role: str,
    dependencies: dict = None,
    execution_mode: str = "sequential"
) -> dict
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `task_description` | string | Yes | - | Full task text to execute in the subtask |
| `parent_task_id` | string | Yes | - | Parent task ID for hierarchy tracking |
| `role` | string | Yes | - | Subtask role: `"implementer"` \| `"reviewer"` \| `"investigator"` \| custom |
| `dependencies` | dict | No | `{}` | Dependency specification with optional `urls`, `files`, `samples` keys |
| `execution_mode` | string | No | `"sequential"` | Execution mode: `"sequential"` \| `"parallel"` |

### Returns

```python
{
    "subtask_id": str,           # Created subtask ID
    "manifest_path": str,        # Path to created manifest
    "dependency_files": list,    # List of fetched/stored dependency file paths
    "status": "created" | "failed",
    "errors": list               # Any errors encountered during dispatch
}
```

## Dependency Extraction Logic

### Automatic URL Parsing

Scans `task_description` for URL references:

```python
url_pattern = r'https?://[^\s<>"]+|www\.[^\s<>"]+'
```

**Example:**
```python
task_description = """
Review the API design from https://example.com/api/specs/v2
and implement according to http://docs.internal.com/auth-flow
"""

# Extracted URLs:
# - https://example.com/api/specs/v2
# - http://docs.internal.com/auth-flow
```

### Automatic File Reference Parsing

Scans `task_description` for file path references:

```python
file_pattern = r'[\w\-./]+\.(ts|js|py|go|rs|md|json|yaml|yml|txt)'
```

**Example:**
```python
task_description = """
Implement the interface defined in src/types/user.ts
following the pattern in src/services/auth-service.ts
"""

# Extracted files:
# - src/types/user.ts
# - src/services/auth-service.ts
```

### Sample Code Block Detection

Identifies code blocks marked as examples:

```python
sample_pattern = r'```(?:ts|js|python|go|rust)[\s\S]*?```'
sample_keywords = ["example", "sample", "reference", "pattern"]
```

**Example:**
```python
task_description = """
Implement following this example:

```ts
// example: User authentication flow
async function authenticateUser(credentials: Credentials) {
  const token = await authService.login(credentials);
  return token;
}
```
"""

# Detected: sample code block (will be extracted to temporary file)
```

## URL Fetching

### Fetch Process

1. **Extract URLs** from `task_description` or `dependencies.urls`
2. **Fetch content** using `power---fetch` tool
3. **Generate hash** from URL for unique filename
4. **Save to temporary location**: `.aider-desk/opsis/dependencies/{hash}.md`
5. **Record mapping** in manifest

### Fetch Example

```python
# URL: https://example.com/api/specs
# Hash: a1b2c3d4e5f6...

# Saved to:
.aider-desk/opsis/dependencies/a1b2c3d4e5f6.md
```

### Fetch Error Handling

- Missing URL: Log warning, continue execution
- Fetch failure: Log error to manifest, continue with warning
- Timeout: Log error, consider retry (if subtask fails)

## File Reading

### Read Process

1. **Extract file paths** from `task_description` or `dependencies.files`
2. **Read content** using `power---file_read` tool
3. **Generate hash** from file path for unique filename
4. **Save to temporary location** (if not already in project)
5. **Record mapping** in manifest

### Read Example

```python
# File: src/types/user.ts
# Read content and save to:
.aider-desk/opsis/dependencies/src-types-user-ts.md
```

### Read Error Handling

- Missing file: Log warning, continue execution
- Permission denied: Log error to manifest
- Binary file: Skip with warning (text dependencies only)

## Enhanced Prompt Generation

### Dependency Section Addition

Appends "DEPENDENCIES PROVIDED" section to task description:

```markdown
{original_task_description}

---

## DEPENDENCIES PROVIDED

You have access to all dependency files listed above. **Read them before starting work.**

### URL References
- [https://example.com/spec](.aider-desk/opsis/dependencies/a1b2c3d4.md) - API specification
- [http://docs.internal.com/guide](.aider-desk/opsis/dependencies/e5f6g7h8.md) - Implementation guide

### File References
- [src/types/user.ts](.aider-desk/opsis/dependencies/src-types-user-ts.md) - Type definitions
- [src/services/auth.ts](.aider-desk/opsis/dependencies/src-services-auth-ts.md) - Service implementation

### Sample Code
- [sample-auth-flow.ts](.aider-desk/opsis/dependencies/sample-auth-flow.md) - Reference implementation
```

### Context File Attachment

Attaches all dependency files to `tasks---create_task` call:

```python
tasks---create_task(
    prompt=enhanced_prompt,
    parentTaskId=parent_task_id,
    execute=True,
    contextFiles=[
        ".aider-desk/opsis/dependencies/a1b2c3d4.md",
        ".aider-desk/opsis/dependencies/src-types-user-ts.md",
        # ... all dependency files
    ]
)
```

## Manifest Creation

### Manifest Structure

Creates `.aider-desk/opsis/dependencies/manifest-{subtask-id}.json`:

```json
{
  "subtask_id": "abc123-def456",
  "parent_task_id": "parent-789",
  "role": "implementer",
  "created_at": "2026-02-10T12:00:00Z",
  "dependencies": [
    {
      "type": "url",
      "source": "https://example.com/api/specs",
      "local_path": ".aider-desk/opsis/dependencies/a1b2c3d4.md",
      "hash": "a1b2c3d4e5f6",
      "description": "API specification",
      "status": "fetched"
    },
    {
      "type": "file",
      "source": "src/types/user.ts",
      "local_path": ".aider-desk/opsis/dependencies/src-types-user-ts.md",
      "hash": "src-types-user-ts",
      "description": "Type definitions",
      "status": "read"
    },
    {
      "type": "sample",
      "source": "inline_code_block",
      "local_path": ".aider-desk/opsis/dependencies/sample-auth-flow.md",
      "hash": "sample-auth-flow",
      "description": "Reference implementation example",
      "status": "extracted"
    }
  ],
  "errors": []
}
```

### Manifest Error Logging

Records any errors encountered:

```json
{
  "errors": [
    {
      "type": "fetch_failed",
      "source": "https://unreachable.com/spec",
      "message": "Connection timeout after 30s",
      "timestamp": "2026-02-10T12:00:05Z"
    },
    {
      "type": "file_not_found",
      "source": "src/missing/file.ts",
      "message": "File does not exist",
      "timestamp": "2026-02-10T12:00:06Z"
    }
  ]
}
```

## Cleanup Logic

### Cleanup Triggers

- **Automatic cleanup**: After subtask completes successfully
- **Manual cleanup**: Call cleanup function with `force=True`
- **Failure retention**: Keep dependencies if subtask failed (for retry)

### Cleanup Process

1. **Check subtask status** via `tasks---get_task`
2. **If status = DONE**: Remove all temporary dependency files
3. **Remove manifest file**
4. **If status = FAILED**: Keep dependencies and manifest for retry

### Cleanup Example

```python
cleanup_subtask_dependencies(
    subtask_id="abc123-def456",
    force=False  # Only cleanup if task is DONE
)

# Force cleanup regardless of status:
cleanup_subtask_dependencies(
    subtask_id="abc123-def456",
    force=True
)
```

## Error Handling

### Graceful Degradation

The system continues execution even when dependencies fail:

```python
# Example: URL fetch fails
{
  "status": "created",  # Still creates subtask
  "errors": [
    {
      "type": "fetch_failed",
      "source": "https://unreachable.com/spec",
      "message": "Connection timeout"
    }
  ],
  "dependency_files": [
    # Other successfully fetched files still included
    ".aider-desk/opsis/dependencies/other-file.md"
  ]
}
```

### Warning Propagation

Warnings are included in enhanced prompt:

```markdown
## DEPENDENCIES PROVIDED

⚠️ **Warning**: Failed to fetch https://unreachable.com/spec (Connection timeout)

### URL References
- [https://working.com/spec](.aider-desk/opsis/dependencies/working.md) - Working spec
```

### Retry on Failure

If subtask fails, dependencies are preserved for retry:

```python
# Subtask fails with status = FAILED
# Dependencies remain in .aider-desk/opsis/dependencies/
# Manifest remains for inspection

# User can retry:
retry_subtask(
    subtask_id="abc123-def456",
    use_existing_dependencies=True  # Reuse fetched dependencies
)
```

## Integration

### Reference: opsis-worktree-utils

Use opsis-worktree-utils for path resolution:

```python
# Resolve dependency base path
base_path = resolve_opsis_outputs_path()
# Returns: /home/user/project/.aider-desk/opsis/dependencies/
```

### Reference: opsis-file-protocol

Dependency files follow the opsis-file-protocol:

1. **Location**: `.aider-desk/opsis/dependencies/{hash}.md`
2. **Format**: Markdown with metadata header
3. **Header**:
   ```markdown
   ---
   source: {original_source}
   type: {url|file|sample}
   fetched_at: {timestamp}
   ---
   ```
4. **Content**: Original content (fetched or read)

### Reference: opsis-two-stage-review-execution

This utility is used by opsis-two-stage-review-execution for creating subtasks:

```python
# In opsis-two-stage-review-execution:
for task in tasks:
    result = dispatch_subtask(
        task_description=task.description,
        parent_task_id=current_task_id,
        role="implementer",
        dependencies=task.dependencies,
        execution_mode="sequential"
    )
    # Monitor and collect results
```

## Usage Examples

### Example 1: Simple Subtask with URL Dependency

```python
result = dispatch_subtask(
    task_description="Implement authentication following the API spec at https://example.com/auth-spec",
    parent_task_id="parent-123",
    role="implementer"
)

# Result:
{
    "subtask_id": "subtask-456",
    "manifest_path": ".aider-desk/opsis/dependencies/manifest-subtask-456.json",
    "dependency_files": [
        ".aider-desk/opsis/dependencies/a1b2c3d4.md"
    ],
    "status": "created",
    "errors": []
}
```

### Example 2: Subtask with Multiple Dependencies

```python
result = dispatch_subtask(
    task_description="""
    Implement user management feature:
    - Follow the pattern in src/services/auth-service.ts
    - Use types from src/types/user.ts
    - Reference example: https://example.com/user-management-guide
    """,
    parent_task_id="parent-123",
    role="implementer",
    dependencies={
        "files": [
            "src/services/auth-service.ts",
            "src/types/user.ts"
        ],
        "urls": [
            "https://example.com/user-management-guide"
        ]
    }
)
```

### Example 3: Reviewer Role with Sample Code

```python
result = dispatch_subtask(
    task_description="""
    Review this implementation against the reference:

    ```ts
    // sample: Expected authentication flow
    async function authenticate(credentials: Credentials): Promise<Token> {
      const user = await validateUser(credentials);
      return generateToken(user);
    }
    ```

    Check for security issues and performance problems.
    """,
    parent_task_id="parent-123",
    role="reviewer"
)
```

### Example 4: Parallel Execution

```python
result = dispatch_subtask(
    task_description="Fix failing tests in test/unit/auth.test.ts",
    parent_task_id="parent-123",
    role="investigator",
    dependencies={
        "files": ["test/unit/auth.test.ts"]
    },
    execution_mode="parallel"
)

# Note: execution_mode is informational
# Actual parallel execution controlled by caller
# See opsis-dispatching-parallel-agents for full pattern
```

### Example 5: Error Handling

```python
result = dispatch_subtask(
    task_description="""
    Implement feature using:
    - https://reachable.com/spec (will succeed)
    - https://unreachable.com/spec (will fail)
    - src/missing/file.ts (doesn't exist)
    """,
    parent_task_id="parent-123",
    role="implementer"
)

# Result:
{
    "subtask_id": "subtask-456",
    "status": "created",  # Still created despite errors
    "dependency_files": [
        ".aider-desk/opsis/dependencies/reachable-spec.md"  # Only successful fetch
    ],
    "errors": [
        {
            "type": "fetch_failed",
            "source": "https://unreachable.com/spec",
            "message": "Connection timeout"
        },
        {
            "type": "file_not_found",
            "source": "src/missing/file.ts",
            "message": "File does not exist"
        }
    ]
}
```

### Example 6: Cleanup After Completion

```python
# Create subtask
result = dispatch_subtask(
    task_description="Implement feature X",
    parent_task_id="parent-123",
    role="implementer"
)

# ... wait for subtask to complete ...

# Check status and cleanup if done
task_info = tasks---get_task(result["subtask_id"])
if task_info["state"] == "DONE":
    cleanup_subtask_dependencies(result["subtask_id"])
    # Dependency files and manifest removed
```

## Activation Logging

When this skill is activated, log:

```
🔧 SKILL ACTIVATED: opsis-subtask-dispatch
Timestamp: 2026-02-10T12:00:00Z
Trigger: User requested subtask dispatch with dependency injection
Context: Creating subtask with role="{role}", execution_mode="{mode}"
```

## Preconditions

### Required Artifacts
- None (creates its own directory structure)

### Tools Available
- `power---fetch` - For URL fetching
- `power---file_read` - For file reading
- `tasks---create_task` - For subtask creation
- `tasks---get_task` - For status checking

### Permissions
- Write access to `.aider-desk/opsis/dependencies/`
- Read access to project files
- Network access for URL fetching

## Postconditions

### Required Artifacts Created
- `.aider-desk/opsis/dependencies/{hash}.md` - Dependency files
- `.aider-desk/opsis/dependencies/manifest-{subtask-id}.json` - Manifest
- Subtask created via `tasks---create_task`

### Content Verification
- All successfully fetched URLs present in manifest
- All successfully read files present in manifest
- Manifest contains complete dependency metadata
- Enhanced prompt includes dependency references

## Success Metrics

### Completion Metrics
- **Files Created**: Number of dependency files stored
- **Time to Complete**: < 5 seconds for typical dispatch
- **Errors Encountered**: Logged in manifest, doesn't block execution
- **Fetch Success Rate**: >90% for valid URLs
- **File Read Success Rate**: >95% for valid file paths

### Quality Metrics
- **Manifest Accuracy**: All dependencies correctly recorded
- **Prompt Enhancement**: All dependencies referenced in enhanced prompt
- **Cleanup Reliability**: 100% cleanup on successful completion
- **Error Handling**: Graceful degradation on failures

## Common Patterns

### Pattern 1: Spec-Driven Implementation

```python
# When implementing from external specification
dispatch_subtask(
    task_description="Implement OAuth2 flow per OpenID spec",
    dependencies={
        "urls": ["https://openid.net/specs/openid-connect-core-1_0.html"]
    },
    role="implementer"
)
```

### Pattern 2: Pattern-Based Implementation

```python
# When following existing code patterns
dispatch_subtask(
    task_description="Implement payment processing",
    dependencies={
        "files": [
            "src/services/shipping-service.ts",  # Reference pattern
            "src/types/payment.ts"  # Type definitions
        ]
    },
    role="implementer"
)
```

### Pattern 3: Review with Reference

```python
# When reviewing code against reference
dispatch_subtask(
    task_description="Review PR #123 for security issues",
    dependencies={
        "files": ["src/auth/login.ts"],
        "urls": ["https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures"]
    },
    role="reviewer"
)
```

## Related Skills

- **opsis-worktree-utils** - Path resolution for dependency storage
- **opsis-two-stage-review-execution** - Uses this utility for subtask dispatch
- **opsis-dispatching-parallel-agents** - Parallel execution pattern using this utility
- **using-opsis** - Meta-skill for workflow orchestration

## Design Principles

1. **Automatic Dependency Detection**: Extract dependencies from prompt without manual specification
2. **Graceful Degradation**: Continue execution even when dependencies fail to fetch
3. **Manifest Tracking**: Complete audit trail of all dependencies
4. **Cleanup Automation**: Remove temporary files after completion
5. **Retry Support**: Preserve dependencies for retry on failure
6. **Role Flexibility**: Support any role type (implementer, reviewer, investigator, custom)
