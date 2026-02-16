/**
 * AiderDesk Hook: Decision Point Gate
 * 
 * Purpose: Enforce the Decision Point Gate requirement before implementation.
 * Ensures agents complete the decision template and choose the correct workflow.
 * 
 * Integrates with opsis-decision-point-gate skill.
 * 
 * Events:
 * - onToolCalled: Detect implementation attempts without completing Decision Point Gate
 * - onPromptSubmitted: Detect mode declarations and verify gate completion
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  logsDir: path.join(process.cwd(), 'logs'),
  enableLogging: true,
  strictMode: true
};

// Implementation tools that require Decision Point Gate completion
const IMPLEMENTATION_TOOLS = [
  'file_write',
  'file_edit',
  'bash'
];

// Decision Point Gate template markers
const GATE_MARKERS = {
  decisionPoint: /decision\s*point\s*gate/i,
  taskCount: /task\s*count:\s*\d+/i,
  userScope: /user\s*scope:\s*(all|specific|batch)/i,
  workflowDecision: /workflow\s*decision:\s*(opsis-implement|opsis-two-stage-review-execution|other)/i,
  modeDeclaration: /opsis\s*mode:\s*(planning|implementation|verification)/i,
  skillInvocation: /invoking:\s*(opsis-implement|opsis-two-stage-review-execution)/i
};

// Per-task gate state
const taskGateStates = new Map();

/**
 * Initialize gate state for a task
 * @param {string} taskId - Task identifier
 */
function initializeTaskState(taskId) {
  taskGateStates.set(taskId, {
    gateCompleted: false,
    gateContent: null,
    gateTimestamp: null,
    chosenWorkflow: null,
    declaredMode: null,
    implementationAttempts: 0,
    lastAttemptTime: null
  });
}

/**
 * Get or create task gate state
 * @param {string} taskId - Task identifier
 * @returns {Object} - Task gate state
 */
function getTaskState(taskId) {
  if (!taskGateStates.has(taskId)) {
    initializeTaskState(taskId);
  }
  return taskGateStates.get(taskId);
}

/**
 * Check if tool is an implementation operation
 * @param {string} toolName - Tool name
 * @param {Object} args - Tool arguments
 * @returns {boolean} - True if implementation operation
 */
function isImplementationTool(toolName, args) {
  if (!IMPLEMENTATION_TOOLS.includes(toolName)) {
    return false;
  }
  
  // Special handling: bash commands that are read-only
  if (toolName === 'bash' && args && args.command) {
    const readOnlyCommands = ['cat', 'grep', 'find', 'ls', 'echo', 'head', 'tail', 'wc'];
    const firstWord = args.command.split(' ')[0];
    return !readOnlyCommands.includes(firstWord);
  }
  
  return true;
}

/**
 * Check if tasks.md exists and read it
 * @param {string} taskId - Task identifier
 * @returns {Object|null} - Tasks content or null
 */
function checkTasksFile(taskId) {
  const opsisDir = path.join(process.cwd(), '.aider-desk', 'opsis', 'outputs');
  
  if (!fs.existsSync(opsisDir)) {
    return null;
  }
  
  const outputDirs = fs.readdirSync(opsisDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  for (const dir of outputDirs) {
    const tasksPath = path.join(opsisDir, dir, 'tasks.md');
    
    if (fs.existsSync(tasksPath)) {
      const content = fs.readFileSync(tasksPath, 'utf8');
      return {
        path: tasksPath,
        content: content,
        taskCount: (content.match(/^-\s+\[/gm) || []).length
      };
    }
  }
  
  return null;
}

/**
 * Validate Decision Point Gate completion
 * @param {string} content - Content to validate
 * @returns {Object} - Validation result
 */
function validateGateCompletion(content) {
  const validation = {
    complete: false,
    markers: {},
    issues: []
  };
  
  // Check for each required marker
  for (const [markerName, pattern] of Object.entries(GATE_MARKERS)) {
    const found = pattern.test(content);
    validation.markers[markerName] = found;
    
    if (!found) {
      validation.issues.push(`Missing required marker: ${markerName}`);
    }
  }
  
  // Gate is complete if all markers are present
  validation.complete = Object.values(validation.markers).every(found => found);
  
  return validation;
}

/**
 * Extract workflow decision from gate content
 * @param {string} content - Gate content
 * @returns {string|null} - Chosen workflow or null
 */
function extractWorkflowDecision(content) {
  const match = content.match(/workflow\s*decision:\s*(\S+)/i);
  return match ? match[1] : null;
}

/**
 * Extract mode declaration from gate content
 * @param {string} content - Gate content
 * @returns {string|null} - Declared mode or null
 */
function extractModeDeclaration(content) {
  const match = content.match(/opsis\s*mode:\s*(\w+)/i);
  return match ? match[1] : null;
}

/**
 * Generate gate violation message
 * @param {string} reason - Reason for violation
 * @param {Object} state - Task gate state
 * @returns {string} - Formatted violation message
 */
function generateGateViolationMessage(reason, state) {
  return (
    '🚨 Decision Point Gate Violation\n\n' +
    'You cannot start implementation without completing the Decision Point Gate.\n\n' +
    'Reason: ' + reason + '\n\n' +
    'Required Steps:\n' +
    '1. Read tasks.md to understand the implementation scope\n' +
    '2. Complete the Decision Point Gate template:\n' +
    '   ```\n' +
    '   ## Decision Point Gate\n' +
    '   - Task Count: [X tasks]\n' +
    '   - User Scope: [all/specific/batch]\n' +
    '   - Workflow Decision: [opsis-implement | opsis-two-stage-review-execution]\n' +
    '   - OPSIS MODE: [implementation]\n' +
    '   - Invoking: [chosen workflow skill]\n' +
    '   ```\n' +
    '3. Invoke the chosen workflow skill\n' +
    '4. Then proceed with implementation\n\n' +
    'Reference: opsis-decision-point-gate skill'
  );
}

/**
 * Log gate event
 * @param {string} taskId - Task identifier
 * @param {string} eventType - Event type
 * @param {Object} details - Event details
 */
function logGateEvent(taskId, eventType, details) {
  if (!CONFIG.enableLogging) {
    return;
  }
  
  try {
    if (!fs.existsSync(CONFIG.logsDir)) {
      fs.mkdirSync(CONFIG.logsDir, { recursive: true });
    }
    
    const logFile = path.join(CONFIG.logsDir, 'decision-point-gate.log');
    const logEntry = {
      timestamp: new Date().toISOString(),
      taskId,
      eventType,
      ...details
    };
    
    const logLine = JSON.stringify(logEntry) + '\n';
    fs.appendFileSync(logFile, logLine, 'utf8');
  } catch (error) {
    console.error('Error logging gate event:', error);
  }
}

// ============================================================================
// AiderDesk Hook Event Handlers
// ============================================================================

/**
 * Called when a tool is invoked
 * @param {Object} context - AiderDesk context object
 * @param {Object} event - Event data containing tool information
 * @returns {boolean|undefined} - Return false to block in strict mode
 */
async function onToolCalled(event, context) {
  try {
    const toolName = event.toolName || '';
    const args = event.args || {};
    const taskId = event.task?.id || 'default';
    
    // Only check implementation tools
    if (!isImplementationTool(toolName, args)) {
      return undefined;
    }
    
    const state = getTaskState(taskId);
    
    // Skip if gate is already completed
    if (state.gateCompleted) {
      return undefined;
    }
    
    // Track implementation attempt
    state.implementationAttempts++;
    state.lastAttemptTime = Date.now();
    
    // Check if tasks.md exists
    const tasksInfo = checkTasksFile(taskId);
    
    if (!tasksInfo) {
      logGateEvent(taskId, 'implementation_without_tasks', {
        toolName,
        attemptNumber: state.implementationAttempts
      });
      
      context.addErrorMessage(generateGateViolationMessage(
        'No tasks.md file found. Please ensure a PRD and tasks.md have been created.',
        state
      ));
      
      if (CONFIG.strictMode) {
        return false;
      }
      return undefined;
    }
    
    // Check if gate was completed in recent conversation
    // This is a simplified check; full implementation would need conversation analysis
    // For now, we'll check if the agent has read tasks.md recently (tracked via file_read)
    
    logGateEvent(taskId, 'implementation_before_gate', {
      toolName,
      taskCount: tasksInfo.taskCount,
      attemptNumber: state.implementationAttempts
    });
    
    context.addErrorMessage(generateGateViolationMessage(
      `Found ${tasksInfo.taskCount} tasks in tasks.md but Decision Point Gate not completed.`,
      state
    ));
    
    if (CONFIG.strictMode) {
      return false;
    }
    
    return undefined;
  } catch (error) {
    console.error('Decision Point Gate Error in onToolCalled:', error);
    return undefined;
  }
}

/**
 * Called when user submits a prompt
 * @param {Object} context - AiderDesk context object
 * @param {Object} event - Event data containing prompt information
 */
async function onPromptSubmitted(event, context) {
  try {
    const prompt = event.prompt || '';
    const taskId = event.taskId || 'default';
    const state = getTaskState(taskId);
    
    // Check if prompt contains Decision Point Gate completion
    const validation = validateGateCompletion(prompt);
    
    if (validation.complete) {
      state.gateCompleted = true;
      state.gateContent = prompt;
      state.gateTimestamp = Date.now();
      state.chosenWorkflow = extractWorkflowDecision(prompt);
      state.declaredMode = extractModeDeclaration(prompt);
      
      logGateEvent(taskId, 'gate_completed', {
        chosenWorkflow: state.chosenWorkflow,
        declaredMode: state.declaredMode
      });
      
      context.addInfoMessage(
        '✅ Decision Point Gate completed\n' +
        'Workflow: ' + (state.chosenWorkflow || 'unknown') + '\n' +
        'Mode: ' + (state.declaredMode || 'unknown')
      );
      
      // Validate workflow choice based on task count
      const tasksInfo = checkTasksFile(taskId);
      if (tasksInfo) {
        const taskCount = tasksInfo.taskCount;
        const recommendedWorkflow = taskCount > 10 
          ? 'opsis-two-stage-review-execution' 
          : 'opsis-implement';
        
        if (state.chosenWorkflow !== recommendedWorkflow) {
          context.addWarningMessage(
            '⚠️ Workflow Recommendation:\n' +
            'Task count: ' + taskCount + '\n' +
            'Recommended workflow: ' + recommendedWorkflow + '\n' +
            'Chosen workflow: ' + (state.chosenWorkflow || 'unknown') + '\n' +
            'Consider using the recommended workflow for better quality assurance.'
          );
        }
      }
    }
  } catch (error) {
    console.error('Decision Point Gate Error in onPromptSubmitted:', error);
  }
}

// ============================================================================
// Export Hook Interface
// ============================================================================

module.exports = {
  name: 'decision-point-gate',
  version: '1.0.0',
  description: 'Enforces Decision Point Gate completion before implementation',
  
  // Event handlers
  onToolCalled,
  onPromptSubmitted,
  
  // Configuration
  config: CONFIG,
  
  // Utility functions (exposed for testing)
  utils: {
    isImplementationTool,
    checkTasksFile,
    validateGateCompletion,
    extractWorkflowDecision,
    extractModeDeclaration,
    generateGateViolationMessage
  }
};
