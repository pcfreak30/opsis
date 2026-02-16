/**
 * AiderDesk Hook: Verification Gate
 * 
 * Purpose: Prevent agents from claiming task completion without running
 * verification steps, ensuring quality standards are met.
 * 
 * Events:
 * - onPromptFinished: Analyze responses for completion claims
 * - onCommandExecuted: Track verification command execution
 * - onToolCalled: Monitor verification-related tool usage
 * - onResponseMessageProcessed: Intercept completion assertions
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  completionThreshold: 0.75,      // Confidence threshold for completion detection
  logsDir: path.join(process.cwd(), 'logs'),
  enableLogging: true,
  evidenceRequired: true
};

// Completion indicator phrases with confidence weights
const COMPLETION_PHRASES = {
  // High confidence (definite completion)
  'done': 1.0,
  'completed': 1.0,
  'finished': 1.0,
  'is complete': 1.0,
  'is ready': 0.9,
  'all done': 1.0,
  'task is done': 1.0,
  'implementation complete': 1.0,
  'feature is complete': 1.0,
  'successfully implemented': 1.0,
  'successfully completed': 1.0,
  
  // Medium-high confidence
  'implemented': 0.9,
  'created': 0.8,
  'built': 0.8,
  'developed': 0.8,
  'ready to use': 0.85,
  'ready for review': 0.85,
  'all requirements met': 0.9,
  'requirements satisfied': 0.9,
  'ready to go': 0.8,
  'good to go': 0.8,
  
  // Medium confidence (may need verification)
  'should work': 0.6,
  'appears to work': 0.6,
  'seems to be working': 0.6,
  'looks good': 0.5,
  'looks complete': 0.7,
  'functionality added': 0.7,
  'code written': 0.6,
  'files created': 0.6,
  
  // Low confidence (not definitive completion)
  'i think it\'s done': 0.4,
  'probably complete': 0.4,
  'mostly done': 0.5,
  'basically complete': 0.5
};

// Verification commands and tools
const VERIFICATION_COMMANDS = [
  '/clavix:verify',
  'test',
  'npm test',
  'pytest',
  'go test',
  'cargo test',
  'jest',
  'vitest',
  'mocha',
  'lint',
  'eslint',
  'flake8',
  'golint',
  'type-check',
  'tsc',
  'mypy',
  'build',
  'compile'
];

const VERIFICATION_TOOLS = [
  'bash',  // For running test/lint commands
  'tasks_search_task',  // For verification checks
  'tasks_get_task'  // For task verification
];

// Per-task verification state
const taskVerificationStates = new Map();

/**
 * Initialize verification state for a task
 * @param {string} taskId - Task identifier
 */
function initializeTaskState(taskId) {
  taskVerificationStates.set(taskId, {
    verified: false,
    lastVerification: null,
    verificationResults: [],
    completionClaims: 0,
    blockedClaims: 0,
    verificationHistory: []
  });
}

/**
 * Get or create task verification state
 * @param {string} taskId - Task identifier
 * @returns {Object} - Task verification state
 */
function getTaskState(taskId) {
  if (!taskVerificationStates.has(taskId)) {
    initializeTaskState(taskId);
  }
  return taskVerificationStates.get(taskId);
}

/**
 * Detect completion claims in response text
 * @param {string} text - Response text to analyze
 * @returns {Object} - Detection result with confidence and phrases
 */
function detectCompletionClaims(text) {
  // Ensure text is a string
  if (typeof text !== 'string') {
    return { foundPhrases: [], confidence: 0, isCompletion: false, negated: false };
  }
  
  const lowerText = text.toLowerCase();
  const foundPhrases = [];
  let totalConfidence = 0;
  
  // Check each completion phrase
  for (const [phrase, weight] of Object.entries(COMPLETION_PHRASES)) {
    if (lowerText.includes(phrase)) {
      foundPhrases.push({ phrase, weight });
      totalConfidence += weight;
    }
  }
  
  // Calculate average confidence
  const avgConfidence = foundPhrases.length > 0 
    ? totalConfidence / foundPhrases.length 
    : 0;
  
  // Check for negation (e.g., "not done", "not complete")
  const negationPatterns = [
    /not\s+(done|complete|finished|ready)/i,
    /not\s+(fully|completely)\s+(done|complete|finished)/i,
    /don'?t\s+think\s+(it'?s|is)\s+done/i
  ];
  
  const hasNegation = negationPatterns.some(pattern => pattern.test(text));
  
  return {
    isCompletion: avgConfidence >= CONFIG.completionThreshold && !hasNegation,
    confidence: avgConfidence,
    phrases: foundPhrases,
    negated: hasNegation
  };
}

/**
 * Check if command is a verification command
 * @param {string} command - Command to check
 * @returns {boolean} - True if verification command
 */
function isVerificationCommand(command) {
  const lowerCommand = command.toLowerCase();
  return VERIFICATION_COMMANDS.some(vc => lowerCommand.includes(vc));
}

/**
 * Check if tool is used for verification
 * @param {string} toolName - Tool name
 * @param {Object} args - Tool arguments
 * @returns {boolean} - True if verification tool usage
 */
function isVerificationTool(toolName, args) {
  if (!VERIFICATION_TOOLS.includes(toolName)) {
    return false;
  }
  
  // Special handling for bash - check if running verification command
  if (toolName === 'bash' && args && args.command) {
    return isVerificationCommand(args.command);
  }
  
  return true;
}

/**
 * Record verification execution
 * @param {string} taskId - Task identifier
 * @param {string} type - Verification type (command or tool)
 * @param {string} name - Command or tool name
 * @param {Object} result - Verification result
 */
function recordVerification(taskId, type, name, result) {
  const state = getTaskState(taskId);
  
  const verificationRecord = {
    timestamp: Date.now(),
    type,
    name,
    success: result.success !== false,
    output: result.output || '',
    error: result.error || null
  };
  
  state.verificationHistory.push(verificationRecord);
  state.lastVerification = Date.now();
  
  // Update verified status based on latest verification
  state.verified = verificationRecord.success;
  state.verificationResults = [verificationRecord];
}

/**
 * Generate evidence request message
 * @param {string} taskType - Type of task (code, docs, config, etc.)
 * @returns {string} - Evidence request message
 */
function generateEvidenceRequest(taskType = 'code') {
  const evidenceTypes = {
    code: 'test results, lint output, or type checking results',
    docs: 'link validation results, spell check output, or documentation review',
    config: 'syntax validation, schema validation, or configuration testing',
    general: 'verification output showing the task requirements are met'
  };
  
  const requested = evidenceTypes[taskType] || evidenceTypes.general;
  
  return (
    '🔍 Verification Required\n\n' +
    'You\'ve indicated task completion, but no verification evidence has been provided.\n\n' +
    'Please run verification commands before claiming completion:\n' +
    '- For code tasks: Run tests, linting, or type checking\n' +
    '- For documentation: Validate links, check spelling, or review content\n' +
    '- For configuration: Validate syntax, check schema compliance\n\n' +
    'Expected evidence: ' + requested + '\n\n' +
    'After running verification, provide the output as evidence of completion.'
  );
}

/**
 * Generate fix request message
 * @param {Object[]} failedVerifications - Array of failed verification records
 * @returns {string} - Fix request message
 */
function generateFixRequest(failedVerifications) {
  const failedList = failedVerifications
    .map(v => '- `' + v.name + '`: ' + (v.error || 'Failed'))
    .join('\n');
  
  return (
    '🚫 Verification Failed\n\n' +
    'The following verification checks failed:\n' + failedList + '\n\n' +
    'Please:\n' +
    '1. Fix the issues identified\n' +
    '2. Re-run verification\n' +
    '3. Provide evidence that all checks pass\n\n' +
    'Cannot claim completion until verification passes.'
  );
}

/**
 * Log verification event
 * @param {string} taskId - Task identifier
 * @param {string} eventType - Event type
 * @param {Object} details - Event details
 */
function logVerificationEvent(taskId, eventType, details) {
  if (!CONFIG.enableLogging) {
    return;
  }
  
  try {
    if (!fs.existsSync(CONFIG.logsDir)) {
      fs.mkdirSync(CONFIG.logsDir, { recursive: true });
    }
    
    const logFile = path.join(CONFIG.logsDir, 'verification-gate.log');
    const logEntry = {
      timestamp: new Date().toISOString(),
      taskId,
      eventType,
      ...details
    };
    
    const logLine = JSON.stringify(logEntry) + '\n';
    fs.appendFileSync(logFile, logLine, 'utf8');
  } catch (error) {
    console.error('Error logging verification event:', error);
  }
}

// ============================================================================
// AiderDesk Hook Event Handlers
// ============================================================================

/**
 * Called when prompt processing is finished
 * @param {Object} context - AiderDesk context object
 * @param {Object} event - Event data containing prompt information
 * @returns {Object|undefined} - Return modified response to intercept
 */
async function onPromptFinished(event, context) {
  try {
    // event.responses is an array according to hooks documentation
    const responses = event.responses || [];
    const response = responses.length > 0 ? JSON.stringify(responses[0]) : '';
    const taskId = event.task?.id || 'default';
    
    // Detect completion claims
    const detection = detectCompletionClaims(response);
    
    if (!detection.isCompletion) {
      return undefined; // Not a completion claim, allow through
    }
    
    // Get verification state
    const state = getTaskState(taskId);
    state.completionClaims++;
    
    // Check if verification was run
    if (!state.verified) {
      state.blockedClaims++;
      
      // Log blocked claim
      logVerificationEvent(taskId, 'completion_blocked', {
        confidence: detection.confidence,
        phrases: detection.phrases,
        verified: state.verified
      });
      
      // Generate evidence request
      const evidenceRequest = generateEvidenceRequest();
      
      // Add warning message to context
      context.addWarningMessage(evidenceRequest);
      
      // Return modified response that removes completion claim
      // This is a simplified approach - actual implementation may need more sophisticated handling
      return {
        ...event,
        response: response.replace(/(done|completed|finished|ready)/gi, '[completion claim blocked - verification required]')
      };
    }
    
    // Check if verification failed
    const failedVerifications = state.verificationResults.filter(v => !v.success);
    if (failedVerifications.length > 0) {
      state.blockedClaims++;
      
      // Log blocked claim due to failed verification
      logVerificationEvent(taskId, 'completion_blocked_failed_verification', {
        failedCount: failedVerifications.length,
        failures: failedVerifications.map(v => v.name)
      });
      
      // Generate fix request
      const fixRequest = generateFixRequest(failedVerifications);
      
      // Add error message to context
      context.addErrorMessage(fixRequest);
      
      return {
        ...event,
        response: response.replace(/(done|completed|finished|ready)/gi, '[completion claim blocked - verification failed]')
      };
    }
    
    // Verification passed - allow completion claim
    logVerificationEvent(taskId, 'completion_allowed', {
      confidence: detection.confidence,
      verificationCount: state.verificationHistory.length
    });
    
    // Add success marker to response
    const successMarker = '\n\n✅ Verification completed successfully.';
    return {
      ...event,
      response: response + successMarker
    };
  } catch (error) {
    console.error('Verification Gate Error in onPromptFinished:', error);
    return undefined;
  }
}

/**
 * Called when a command is executed
 * @param {Object} context - AiderDesk context object
 * @param {Object} event - Event data containing command information
 */
async function onCommandExecuted(event, context) {
  try {
    const command = event.command || '';
    const taskId = event.task?.id || 'default';
    // Note: onCommandExecuted event only provides { command: string }
    // We'll assume success unless we get error feedback elsewhere
    
    // Check if this is a verification command
    if (isVerificationCommand(command)) {
      recordVerification(taskId, 'command', command, {
        success: true, // Assume success if command executed
        output: 'Command executed',
        error: null
      });
      
      // Log verification execution
      logVerificationEvent(taskId, 'verification_executed', {
        type: 'command',
        command: command.substring(0, 100),
        success: result.exitCode === 0
      });
    }
  } catch (error) {
    console.error('Verification Gate Error in onCommandExecuted:', error);
  }
}

/**
 * Called when a tool is invoked
 * @param {Object} context - AiderDesk context object
 * @param {Object} event - Event data containing tool information
 */
async function onToolCalled(event, context) {
  try {
    const toolName = event.toolName || '';
    const args = event.args || {};
    const taskId = event.task?.id || 'default';
    
    // Check if this is a verification tool usage
    // Note: onToolCalled only provides toolName and args, not result
    // We'll track that a verification tool was called
    if (isVerificationTool(toolName, args)) {
      const name = toolName === 'bash' && args.command ? args.command : toolName;
      
      recordVerification(taskId, 'tool', name, {
        success: true, // Assume success - actual result comes in onToolFinished
        output: 'Tool called',
        error: null
      });
      
      // Log verification execution
      logVerificationEvent(taskId, 'verification_executed', {
        type: 'tool',
        toolName,
        success: result.success !== false
      });
    }
  } catch (error) {
    console.error('Verification Gate Error in onToolCalled:', error);
  }
}

/**
 * Called when response message is processed
 * @param {Object} context - AiderDesk context object
 * @param {Object} event - Event data containing response information
 * @returns {boolean|undefined} - Return false to block the response
 */
async function onResponseMessageProcessed(event, context) {
  try {
    const message = event.message || '';
    // Note: onResponseMessageProcessed doesn't include taskId in event data
    // We'll skip task-specific tracking for this event
    const taskId = 'default';
    
    // Check for completion claims in the message
    const detection = detectCompletionClaims(message);
    
    if (detection.isCompletion) {
      const state = getTaskState(taskId);
      
      if (!state.verified) {
        // Block the message
        logVerificationEvent(taskId, 'message_blocked', {
          confidence: detection.confidence,
          messagePreview: message.substring(0, 100)
        });
        
        context.addWarningMessage(
          '⚠️ Message blocked: Completion claim without verification.\n' +
          'Please run verification before claiming completion.'
        );
        
        return false;
      }
    }
    
    return undefined;
  } catch (error) {
    console.error('Verification Gate Error in onResponseMessageProcessed:', error);
    return undefined;
  }
}

// ============================================================================
// Export Hook Interface
// ============================================================================

module.exports = {
  name: 'verification-gate',
  version: '1.0.0',
  description: 'Prevents task completion claims without verification evidence',
  
  // Event handlers
  onPromptFinished,
  onCommandExecuted,
  onToolCalled,
  onResponseMessageProcessed,
  
  // Configuration
  config: CONFIG,
  
  // Utility functions (exposed for testing)
  utils: {
    detectCompletionClaims,
    isVerificationCommand,
    isVerificationTool,
    recordVerification,
    generateEvidenceRequest,
    generateFixRequest
  }
};
