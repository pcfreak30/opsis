/**
 * AiderDesk Hook: Mode Tracker (Analytics Only)
 * 
 * Purpose: Track mode transitions and usage patterns for session analytics.
 * Enforcement of mode boundaries is handled by opsis-mode-enforcer skill.
 * 
 * Events:
 * - onPromptSubmitted: Analyze prompt to determine intended mode
 * - onPromptFinished: Track mode transitions and update state
 * - onTaskCreated: Initialize mode tracking state for new tasks
 * 
 * Note: This hook does NOT enforce mode boundaries. Enforcement is delegated
 * to the opsis-mode-enforcer skill which provides agent-side discipline.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  planningThreshold: 0.6,      // Score threshold for planning mode
  implementationThreshold: 0.6, // Score threshold for implementation mode
  logsDir: path.join(process.cwd(), 'logs'),
  enableLogging: true
};

// Mode keywords with weights
const MODE_KEYWORDS = {
  planning: {
    'plan': 1.0,
    'design': 1.0,
    'analyze': 1.0,
    'discuss': 1.0,
    'explore': 1.0,
    'document': 1.0,
    'architecture': 0.9,
    'structure': 0.9,
    'requirements': 0.9,
    'prd': 0.9,
    'specification': 0.8,
    'proposal': 0.8,
    'brainstorm': 0.8,
    'outline': 0.7,
    'sketch': 0.7,
    '?': 0.5,              // Questions indicate exploration
    'how': 0.5,
    'what': 0.5,
    'why': 0.5,
    'should': 0.4,
    'could': 0.4,
    'think about': 0.6,
    'consider': 0.6,
    'evaluate': 0.7,
    'assess': 0.7
  },
  implementation: {
    'implement': 1.0,
    'create': 1.0,
    'build': 1.0,
    'write': 1.0,
    'fix': 1.0,
    'refactor': 1.0,
    'develop': 1.0,
    'code': 0.9,
    'function': 0.8,
    'class': 0.8,
    'component': 0.8,
    'file': 0.7,
    'edit': 0.9,
    'modify': 0.9,
    'change': 0.8,
    'update': 0.8,
    'add': 0.7,
    'remove': 0.7,
    'delete': 0.7,
    'do this': 0.9,
    'make this': 0.9,
    'run': 0.7,
    'execute': 0.7,
    'deploy': 0.8,
    'push': 0.7,
    'commit': 0.7,
    'test': 0.6,
    'build': 0.7,
    'compile': 0.7
  }
};

// Per-task mode state
const taskModeStates = new Map();

/**
 * Escape special regex characters in a string
 * @param {string} str - String to escape
 * @returns {string} - Escaped string safe for regex
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Calculate mode score based on keywords in text
 * @param {string} text - Text to analyze
 * @returns {Object} - Scores for planning and implementation modes
 */
function calculateModeScores(text) {
  const lowerText = text.toLowerCase();
  
  let planningScore = 0;
  let implementationScore = 0;
  
  // Check planning keywords
  for (const [keyword, weight] of Object.entries(MODE_KEYWORDS.planning)) {
    const escapedKeyword = escapeRegex(keyword);
    const regex = new RegExp('\\b' + escapedKeyword + '\\b', 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      planningScore += matches.length * weight;
    }
  }
  
  // Check implementation keywords
  for (const [keyword, weight] of Object.entries(MODE_KEYWORDS.implementation)) {
    const escapedKeyword = escapeRegex(keyword);
    const regex = new RegExp('\\b' + escapedKeyword + '\\b', 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      implementationScore += matches.length * weight;
    }
  }
  
  // Normalize scores
  const totalKeywords = Object.keys(MODE_KEYWORDS.planning).length + 
                        Object.keys(MODE_KEYWORDS.implementation).length;
  
  return {
    planning: planningScore / totalKeywords,
    implementation: implementationScore / totalKeywords
  };
}

/**
 * Detect mode from prompt text
 * @param {string} prompt - User prompt
 * @returns {string} - Detected mode: 'planning', 'implementation', or 'unknown'
 */
function detectMode(prompt) {
  const scores = calculateModeScores(prompt);
  
  // Check for manual mode override
  const overrideMatch = prompt.match(/\/\/\s*MODE:\s*(\w+)/i);
  if (overrideMatch) {
    const mode = overrideMatch[1].toLowerCase();
    if (mode === 'planning' || mode === 'implementation' || mode === 'verification') {
      return mode;
    }
  }
  
  // Automatic detection
  if (scores.planning >= CONFIG.planningThreshold && scores.planning > scores.implementation) {
    return 'planning';
  }
  
  if (scores.implementation >= CONFIG.implementationThreshold && scores.implementation > scores.planning) {
    return 'implementation';
  }
  
  // Default to planning if unclear (safer default)
  return 'planning';
}

/**
 * Initialize mode state for a task
 * @param {string} taskId - Task identifier
 * @param {string} initialMode - Initial mode
 */
function initializeTaskState(taskId, initialMode = 'planning') {
  taskModeStates.set(taskId, {
    currentMode: initialMode,
    history: [{
      mode: initialMode,
      timestamp: Date.now(),
      trigger: 'initialization'
    }]
  });
}

/**
 * Get or create task mode state
 * @param {string} taskId - Task identifier
 * @returns {Object} - Task mode state
 */
function getTaskState(taskId) {
  if (!taskModeStates.has(taskId)) {
    initializeTaskState(taskId);
  }
  return taskModeStates.get(taskId);
}

/**
 * Update task mode
 * @param {string} taskId - Task identifier
 * @param {string} newMode - New mode
 * @param {string} trigger - Reason for mode change
 */
function updateTaskMode(taskId, newMode, trigger = 'detection') {
  const state = getTaskState(taskId);
  
  if (state.currentMode !== newMode) {
    state.currentMode = newMode;
    state.history.push({
      mode: newMode,
      timestamp: Date.now(),
      trigger
    });
  }
}

/**
 * Log mode transition
 * @param {string} taskId - Task identifier
 * @param {Object} transition - Transition details
 */
function logModeTransition(taskId, transition) {
  if (!CONFIG.enableLogging) {
    return;
  }
  
  try {
    if (!fs.existsSync(CONFIG.logsDir)) {
      fs.mkdirSync(CONFIG.logsDir, { recursive: true });
    }
    
    const logFile = path.join(CONFIG.logsDir, 'mode-transitions.log');
    const logEntry = {
      timestamp: new Date().toISOString(),
      taskId,
      ...transition
    };
    
    const logLine = JSON.stringify(logEntry) + '\n';
    fs.appendFileSync(logFile, logLine, 'utf8');
  } catch (error) {
    console.error('Error logging mode transition:', error);
  }
}

// ============================================================================
// AiderDesk Hook Event Handlers
// ============================================================================

/**
 * Called when user submits a prompt
 * @param {Object} context - AiderDesk context object
 * @param {Object} event - Event data containing prompt information
 */
async function onPromptSubmitted(event, context) {
  try {
    const prompt = event.prompt || '';
    const taskId = event.task?.id || 'default';
    
    // Detect mode from prompt
    const detectedMode = detectMode(prompt);
    
    // Get current state
    const state = getTaskState(taskId);
    
    // Update mode if different
    if (state.currentMode !== detectedMode) {
      const previousMode = state.currentMode;
      updateTaskMode(taskId, detectedMode, 'prompt_analysis');
      
      // Log transition
      logModeTransition(taskId, {
        from: previousMode,
        to: detectedMode,
        trigger: 'prompt_analysis',
        promptPreview: prompt.substring(0, 100)
      });
    }
  } catch (error) {
    console.error('Mode Tracker Error in onPromptSubmitted:', error);
  }
}

/**
 * Called when prompt processing is finished
 * @param {Object} context - AiderDesk context object
 * @param {Object} event - Event data containing prompt information
 */
async function onPromptFinished(event, context) {
  try {
    const taskId = event.taskId || 'default';
    
    // Update state with completion info
    const state = getTaskState(taskId);
    state.history.push({
      mode: state.currentMode,
      timestamp: Date.now(),
      trigger: 'prompt_finished'
    });
  } catch (error) {
    console.error('Mode Tracker Error in onPromptFinished:', error);
  }
}

/**
 * Called when a new task is created
 * @param {Object} context - AiderDesk context object
 * @param {Object} event - Event data containing task information
 */
async function onTaskCreated(event, context) {
  try {
    const taskId = event.task?.id || 'default';
    const prompt = event.task?.prompt || '';
    
    // Detect initial mode from prompt
    const initialMode = detectMode(prompt);
    
    // Initialize task state
    initializeTaskState(taskId, initialMode);
    
    // Log initialization
    logModeTransition(taskId, {
      from: null,
      to: initialMode,
      trigger: 'task_created'
    });
  } catch (error) {
    console.error('Mode Tracker Error in onTaskCreated:', error);
  }
}

/**
 * Get purpose description for a mode
 * @param {string} mode - Mode name
 * @returns {string} - Purpose description
 */
function getModePurpose(mode) {
  const purposes = {
    planning: 'Requirements gathering, analysis, and document creation',
    implementation: 'Writing code, executing tasks, and implementing features',
    verification: 'Reviewing implementation, running tests, and ensuring quality'
  };
  return purposes[mode] || 'Unknown mode';
}

// ============================================================================
// Export Hook Interface
// ============================================================================

module.exports = {
  name: 'mode-tracker',
  version: '2.0.0',
  description: 'Tracks mode transitions and usage patterns for analytics (enforcement handled by opsis-mode-enforcer skill)',
  
  // Event handlers
  onPromptSubmitted,
  onPromptFinished,
  onTaskCreated,
  
  // Configuration
  config: CONFIG,
  
  // Utility functions (exposed for testing)
  utils: {
    calculateModeScores,
    detectMode,
    initializeTaskState,
    getTaskState,
    updateTaskMode,
    getModePurpose
  }
};
