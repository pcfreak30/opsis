/**
 * AiderDesk Hook: Iron Law Enforcer
 * 
 * Purpose: Enforce the three Iron Laws at the system level:
 * 1. No completion without verification
 * 2. No implementation without planning
 * 3. No skipping fix loops
 * 
 * Integrates with opsis-iron-laws and opsis-iron-laws-guide skills.
 * 
 * Events:
 * - onPromptFinished: Detect completion claims without verification
 * - onToolCalled: Detect implementation without approved planning
 * - onResponseMessageProcessed: Detect fix loop violations
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  logsDir: path.join(process.cwd(), 'logs'),
  enableLogging: true,
  strictMode: true
};

// Iron Law definitions
const IRON_LAWS = {
  NO_COMPLETION_WITHOUT_VERIFICATION: {
    id: 'iron-law-1',
    name: 'No Completion Without Verification',
    description: 'Cannot claim task completion without providing fresh verification evidence',
    skillReference: 'opsis-verification-before-completion'
  },
  NO_IMPLEMENTATION_WITHOUT_PLANNING: {
    id: 'iron-law-2',
    name: 'No Implementation Without Planning',
    description: 'Cannot generate code without approved PRD or task specification',
    skillReference: 'opsis-mode-enforcer'
  },
  NO_SKIPPING_FIX_LOOPS: {
    id: 'iron-law-3',
    name: 'No Skipping Fix Loops',
    description: 'Issues found during verification must be fixed and re-verified',
    skillReference: 'opsis-systematic-debugging'
  }
};

// Completion claim patterns
const COMPLETION_PATTERNS = [
  /\b(done|completed|finished|ready|implemented|built|created|developed)\b/i,
  /\b(all done|task is done|feature is complete|successfully implemented)\b/i,
  /\b(ready to use|ready for review|good to go|all requirements met)\b/i
];

// Implementation patterns (write operations)
const IMPLEMENTATION_TOOLS = [
  'file_write',
  'file_edit',
  'bash'
];

// Per-task Iron Law state
const taskIronLawStates = new Map();

/**
 * Initialize Iron Law state for a task
 * @param {string} taskId - Task identifier
 */
function initializeTaskState(taskId) {
  taskIronLawStates.set(taskId, {
    verificationEvidence: false,
    lastVerificationTime: null,
    hasPlanningDocument: false,
    planningDocumentPath: null,
    issuesFound: [],
    issuesFixed: [],
    fixLoopActive: false,
    violations: []
  });
}

/**
 * Get or create task Iron Law state
 * @param {string} taskId - Task identifier
 * @returns {Object} - Task Iron Law state
 */
function getTaskState(taskId) {
  if (!taskIronLawStates.has(taskId)) {
    initializeTaskState(taskId);
  }
  return taskIronLawStates.get(taskId);
}

/**
 * Detect completion claims in text
 * @param {string} text - Text to analyze
 * @returns {boolean} - True if completion claim detected
 */
function detectCompletionClaim(text) {
  if (typeof text !== 'string') {
    return false;
  }
  
  return COMPLETION_PATTERNS.some(pattern => pattern.test(text));
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
 * Check for planning document existence
 * @param {string} taskId - Task identifier
 * @returns {boolean} - True if planning document exists
 */
function hasPlanningDocument(taskId) {
  const opsisDir = path.join(process.cwd(), '.aider-desk', 'opsis', 'outputs');
  
  if (!fs.existsSync(opsisDir)) {
    return false;
  }
  
  // Check for PRD or tasks.md files
  const outputDirs = fs.readdirSync(opsisDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  for (const dir of outputDirs) {
    const prdPath = path.join(opsisDir, dir, 'prd.md');
    const tasksPath = path.join(opsisDir, dir, 'tasks.md');
    
    if (fs.existsSync(prdPath) || fs.existsSync(tasksPath)) {
      const state = getTaskState(taskId);
      state.hasPlanningDocument = true;
      state.planningDocumentPath = fs.existsSync(prdPath) ? prdPath : tasksPath;
      return true;
    }
  }
  
  return false;
}

/**
 * Record Iron Law violation
 * @param {string} taskId - Task identifier
 * @param {string} lawId - Iron Law ID
 * @param {Object} details - Violation details
 */
function recordViolation(taskId, lawId, details) {
  const state = getTaskState(taskId);
  
  const violation = {
    timestamp: Date.now(),
    lawId,
    lawName: IRON_LAWS[lawId]?.name || 'Unknown',
    ...details
  };
  
  state.violations.push(violation);
  
  // Log violation
  logIronLawEvent(taskId, 'violation', violation);
}

/**
 * Log Iron Law event
 * @param {string} taskId - Task identifier
 * @param {string} eventType - Event type
 * @param {Object} details - Event details
 */
function logIronLawEvent(taskId, eventType, details) {
  if (!CONFIG.enableLogging) {
    return;
  }
  
  try {
    if (!fs.existsSync(CONFIG.logsDir)) {
      fs.mkdirSync(CONFIG.logsDir, { recursive: true });
    }
    
    const logFile = path.join(CONFIG.logsDir, 'iron-law-enforcer.log');
    const logEntry = {
      timestamp: new Date().toISOString(),
      taskId,
      eventType,
      ...details
    };
    
    const logLine = JSON.stringify(logEntry) + '\n';
    fs.appendFileSync(logFile, logLine, 'utf8');
  } catch (error) {
    console.error('Error logging Iron Law event:', error);
  }
}

/**
 * Generate violation message
 * @param {Object} law - Iron Law definition
 * @param {Object} details - Violation details
 * @returns {string} - Formatted violation message
 */
function generateViolationMessage(law, details) {
  return (
    '⚠️ Iron Law Violation: ' + law.name + '\n\n' +
    'Description: ' + law.description + '\n' +
    'Reference Skill: ' + law.skillReference + '\n\n' +
    (details.context || '') + '\n' +
    'Action Required: Please invoke the referenced skill to correct this violation.'
  );
}

// ============================================================================
// AiderDesk Hook Event Handlers
// ============================================================================

/**
 * Called when prompt processing is finished
 * @param {Object} context - AiderDesk context object
 * @param {Object} event - Event data containing prompt information
 */
async function onPromptFinished(event, context) {
  try {
    const responses = event.responses || [];
    const response = responses.length > 0 ? JSON.stringify(responses[0]) : '';
    const taskId = event.task?.id || 'default';
    
    // Check for Iron Law 1: No completion without verification
    if (detectCompletionClaim(response)) {
      const state = getTaskState(taskId);
      
      if (!state.verificationEvidence) {
        const law = IRON_LAWS.NO_COMPLETION_WITHOUT_VERIFICATION;
        
        recordViolation(taskId, law.id, {
          context: 'Completion claim detected without verification evidence'
        });
        
        context.addErrorMessage(generateViolationMessage(law, {
          context: 'You claimed completion but no verification evidence was provided in this session.'
        }));
      }
    }
  } catch (error) {
    console.error('Iron Law Enforcer Error in onPromptFinished:', error);
  }
}

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
    
    // Check for Iron Law 2: No implementation without planning
    if (isImplementationTool(toolName, args)) {
      const state = getTaskState(taskId);
      
      // Check if planning document exists
      if (!state.hasPlanningDocument && !hasPlanningDocument(taskId)) {
        const law = IRON_LAWS.NO_IMPLEMENTATION_WITHOUT_PLANNING;
        
        recordViolation(taskId, law.id, {
          toolName,
          args: Object.keys(args)
        });
        
        const message = generateViolationMessage(law, {
          context: `You attempted to use \`${toolName}\` without an approved planning document (PRD or tasks.md).`
        });
        
        context.addErrorMessage(message);
        
        // Block in strict mode
        if (CONFIG.strictMode) {
          return false;
        }
      }
    }
    
    // Track verification evidence (for Iron Law 1)
    if (toolName === 'bash' && args && args.command) {
      const command = args.command.toLowerCase();
      const verificationCommands = ['test', 'verify', 'check', 'lint', 'build', 'compile'];
      
      if (verificationCommands.some(cmd => command.includes(cmd))) {
        const state = getTaskState(taskId);
        state.verificationEvidence = true;
        state.lastVerificationTime = Date.now();
        logIronLawEvent(taskId, 'verification_evidence', {
          command: command.substring(0, 100)
        });
      }
    }
    
    return undefined;
  } catch (error) {
    console.error('Iron Law Enforcer Error in onToolCalled:', error);
    return undefined;
  }
}

/**
 * Called when response message is processed
 * @param {Object} context - AiderDesk context object
 * @param {Object} event - Event data containing response information
 */
async function onResponseMessageProcessed(event, context) {
  try {
    const message = event.message || '';
    const taskId = event.taskId || 'default';
    const state = getTaskState(taskId);
    
    // Check for Iron Law 3: No skipping fix loops
    // Look for patterns that indicate skipping verification after fixes
    const skipPatterns = [
      /(?:fixed|resolved|corrected).+(?:skip|skip|skip|skip)\s+(?:verif|re-verif|test|check)/i,
      /(?:now\s+(?:works|good|done)).+(?:without|skip)\s+(?:verif|test|check)/i
    ];
    
    if (skipPatterns.some(pattern => pattern.test(message))) {
      const law = IRON_LAWS.NO_SKIPPING_FIX_LOOPS;
      
      recordViolation(taskId, law.id, {
        messagePreview: message.substring(0, 100)
      });
      
      context.addErrorMessage(generateViolationMessage(law, {
        context: 'You indicated a fix was made but skipped the required re-verification step.'
      }));
    }
    
    // Track issues found during verification
    const issueFoundPatterns = [
      /(?:found|detected|discovered).+(?:issue|error|bug|problem|failure)/i,
      /(?:failed|error|issue|bug|problem).+(?:found|detected)/i
    ];
    
    if (issueFoundPatterns.some(pattern => pattern.test(message))) {
      state.issuesFound.push({
        timestamp: Date.now(),
        message: message.substring(0, 200)
      });
      state.fixLoopActive = true;
    }
    
    // Track issues fixed
    const issueFixedPatterns = [
      /(?:fixed|resolved|corrected|repaired).+(?:issue|error|bug|problem|failure)/i,
      /(?:issue|error|bug|problem|failure).+(?:fixed|resolved|corrected)/i
    ];
    
    if (issueFixedPatterns.some(pattern => pattern.test(message))) {
      state.issuesFixed.push({
        timestamp: Date.now(),
        message: message.substring(0, 200)
      });
      
      // If fix loop is active and a fix was made, verify re-verification happens
      if (state.fixLoopActive && state.issuesFixed.length > state.issuesFound.filter(i => i.reverified).length) {
        // Check if re-verification is mentioned in next messages
        // This is a simplified check; full implementation would need state tracking across messages
      }
    }
  } catch (error) {
    console.error('Iron Law Enforcer Error in onResponseMessageProcessed:', error);
  }
}

// ============================================================================
// Export Hook Interface
// ============================================================================

module.exports = {
  name: 'iron-law-enforcer',
  version: '1.0.0',
  description: 'Enforces the three Iron Laws at the system level',
  
  // Event handlers
  onPromptFinished,
  onToolCalled,
  onResponseMessageProcessed,
  
  // Configuration
  config: CONFIG,
  
  // Iron Law definitions (exposed for reference)
  ironLaws: IRON_LAWS,
  
  // Utility functions (exposed for testing)
  utils: {
    detectCompletionClaim,
    isImplementationTool,
    hasPlanningDocument,
    recordViolation,
    generateViolationMessage
  }
};
