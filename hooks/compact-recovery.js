/**
 * AiderDesk Hook: Compact Recovery
 * 
 * Purpose: Detect compact scenarios (conversation truncation, context loss) and
 * auto-recover Opsis state from artifacts.
 * 
 * Integrates with opsis-compact-recovery skill.
 * 
 * Events:
 * - onPromptSubmitted: Detect compact indicators and trigger recovery
 * - onTaskCreated: Initialize recovery state for new tasks
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  logsDir: path.join(process.cwd(), 'logs'),
  enableLogging: true,
  opsisOutputsDir: path.join(process.cwd(), '.aider-desk', 'opsis', 'outputs')
};

// Compact recovery indicators
const COMPACT_INDICATORS = {
  // Direct indicators
  direct: [
    /compact/i,
    /reload/i,
    /restore/i,
    /missing\s+context/i,
    /context\s+lost/i,
    /where.*was.*we/i,
    /what.*were.*doing/i
  ],
  
  // Conversation flow indicators
  conversation: [
    /^continue/i,
    /^next/i,
    /^proceed/i,
    /^resume/i
  ],
  
  // State confusion indicators
  confusion: [
    /what.*task/i,
    /what.*status/i,
    /where.*left.*off/i,
    /what.*phase/i
  ]
};

// Per-task recovery state
const taskRecoveryStates = new Map();

/**
 * Initialize recovery state for a task
 * @param {string} taskId - Task identifier
 */
function initializeTaskState(taskId) {
  taskRecoveryStates.set(taskId, {
    recoveryAttempted: false,
    recoveryTimestamp: null,
    detectedMode: null,
    artifactsFound: null,
    recoveryActions: []
  });
}

/**
 * Get or create task recovery state
 * @param {string} taskId - Task identifier
 * @returns {Object} - Task recovery state
 */
function getTaskState(taskId) {
  if (!taskRecoveryStates.has(taskId)) {
    initializeTaskState(taskId);
  }
  return taskRecoveryStates.get(taskId);
}

/**
 * Check for compact recovery indicators
 * @param {string} prompt - User prompt
 * @returns {Object} - Detection result
 */
function detectCompactIndicators(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  
  const detection = {
    detected: false,
    indicatorType: null,
    matchedPatterns: [],
    confidence: 0
  };
  
  // Check each indicator type
  for (const [type, patterns] of Object.entries(COMPACT_INDICATORS)) {
    for (const pattern of patterns) {
      if (pattern.test(lowerPrompt)) {
        detection.detected = true;
        detection.indicatorType = type;
        detection.matchedPatterns.push(pattern.source);
        detection.confidence += 0.3;
      }
    }
  }
  
  // Cap confidence at 1.0
  detection.confidence = Math.min(detection.confidence, 1.0);
  
  return detection;
}

/**
 * Scan Opsis outputs directory for active projects
 * @returns {Array} - Array of project artifacts
 */
function scanOpsisArtifacts() {
  const artifacts = [];
  
  if (!fs.existsSync(CONFIG.opsisOutputsDir)) {
    return artifacts;
  }
  
  const outputDirs = fs.readdirSync(CONFIG.opsisOutputsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  for (const dir of outputDirs) {
    const projectPath = path.join(CONFIG.opsisOutputsDir, dir);
    
    const artifact = {
      projectName: dir,
      path: projectPath,
      hasPRD: false,
      hasTasks: false,
      hasPrompt: false,
      prdPath: null,
      tasksPath: null,
      promptPath: null,
      taskCount: 0,
      completedTasks: 0,
      lastModified: null
    };
    
    // Check for PRD
    artifact.prdPath = path.join(projectPath, 'prd.md');
    artifact.hasPRD = fs.existsSync(artifact.prdPath);
    
    // Check for tasks
    artifact.tasksPath = path.join(projectPath, 'tasks.md');
    artifact.hasTasks = fs.existsSync(artifact.tasksPath);
    
    // Check for improved prompt
    artifact.promptPath = path.join(projectPath, 'improved-prompt.md');
    artifact.hasPrompt = fs.existsSync(artifact.promptPath);
    
    // Get task count if tasks.md exists
    if (artifact.hasTasks) {
      const tasksContent = fs.readFileSync(artifact.tasksPath, 'utf8');
      const taskMatches = tasksContent.match(/^-\s+\[([ x])\]/gm) || [];
      artifact.taskCount = taskMatches.length;
      artifact.completedTasks = taskMatches.filter(m => m.includes('[x]')).length;
    }
    
    // Get last modified time
    const stats = fs.statSync(projectPath);
    artifact.lastModified = stats.mtime;
    
    artifacts.push(artifact);
  }
  
  // Sort by last modified (most recent first)
  artifacts.sort((a, b) => b.lastModified - a.lastModified);
  
  return artifacts;
}

/**
 * Determine mode from artifact state
 * @param {Object} artifact - Project artifact
 * @returns {string} - Detected mode
 */
function determineModeFromArtifact(artifact) {
  // PRD incomplete → Planning Mode
  if (artifact.hasPRD && !artifact.hasTasks) {
    return 'planning';
  }
  
  // Tasks incomplete, has PRD → Implementation Mode
  if (artifact.hasTasks && artifact.completedTasks < artifact.taskCount) {
    return 'implementation';
  }
  
  // Tasks complete but not archived → Verification Mode
  if (artifact.hasTasks && artifact.completedTasks >= artifact.taskCount) {
    return 'verification';
  }
  
  // Default to planning
  return 'planning';
}

/**
 * Generate recovery report
 * @param {string} taskId - Task identifier
 * @param {Object} artifacts - Found artifacts
 * @returns {string} - Formatted recovery report
 */
function generateRecoveryReport(taskId, artifacts) {
  if (artifacts.length === 0) {
    return 'No Opsis artifacts found. Starting fresh session.';
  }
  
  const active = artifacts[0]; // Most recent project
  const mode = determineModeFromArtifact(active);
  const progress = active.taskCount > 0 
    ? `${active.completedTasks}/${active.taskCount} tasks completed`
    : 'No tasks defined';
  
  const report = [
    '🔄 Compact Recovery Activated',
    '',
    'Detected Opsis state:',
    `- Project: ${active.projectName}`,
    `- Mode: ${mode.toUpperCase()}`,
    `- Progress: ${progress}`,
    `- Last Modified: ${active.lastModified.toISOString()}`,
    '',
    'Available Artifacts:',
    active.hasPRD ? '  ✅ PRD (prd.md)' : '  ❌ PRD',
    active.hasTasks ? '  ✅ Tasks (tasks.md)' : '  ❌ Tasks',
    active.hasPrompt ? '  ✅ Improved Prompt (improved-prompt.md)' : '  ❌ Improved Prompt',
    '',
    'Next Actions:',
    '1. Review the recovered state above',
    '2. Use todo---get_items to check current task progress',
    '3. Continue with appropriate workflow for detected mode',
    '',
    'Reference: opsis-compact-recovery skill'
  ];
  
  return report.join('\n');
}

/**
 * Log recovery event
 * @param {string} taskId - Task identifier
 * @param {string} eventType - Event type
 * @param {Object} details - Event details
 */
function logRecoveryEvent(taskId, eventType, details) {
  if (!CONFIG.enableLogging) {
    return;
  }
  
  try {
    if (!fs.existsSync(CONFIG.logsDir)) {
      fs.mkdirSync(CONFIG.logsDir, { recursive: true });
    }
    
    const logFile = path.join(CONFIG.logsDir, 'compact-recovery.log');
    const logEntry = {
      timestamp: new Date().toISOString(),
      taskId,
      eventType,
      ...details
    };
    
    const logLine = JSON.stringify(logEntry) + '\n';
    fs.appendFileSync(logFile, logLine, 'utf8');
  } catch (error) {
    console.error('Error logging recovery event:', error);
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
    const state = getTaskState(taskId);
    
    // Skip if recovery already attempted
    if (state.recoveryAttempted) {
      return;
    }
    
    // Detect compact indicators
    const detection = detectCompactIndicators(prompt);
    
    if (!detection.detected && detection.confidence < 0.5) {
      return; // No clear indicators, skip recovery
    }
    
    // Scan for Opsis artifacts
    const artifacts = scanOpsisArtifacts();
    
    if (artifacts.length === 0) {
      logRecoveryEvent(taskId, 'no_artifacts_found', {
        detection
      });
      return; // No artifacts to recover
    }
    
    // Determine mode from artifact
    const activeArtifact = artifacts[0];
    const detectedMode = determineModeFromArtifact(activeArtifact);
    
    // Update recovery state
    state.recoveryAttempted = true;
    state.recoveryTimestamp = Date.now();
    state.detectedMode = detectedMode;
    state.artifactsFound = artifacts;
    
    // Log recovery
    logRecoveryEvent(taskId, 'recovery_triggered', {
      detection,
      detectedMode,
      artifactCount: artifacts.length,
      activeProject: activeArtifact.projectName
    });
    
    // Generate and display recovery report
    const report = generateRecoveryReport(taskId, artifacts);
    context.addInfoMessage(report);
    
    // Add mode declaration hint
    context.addInfoMessage(
      '\n💡 Mode Declaration Hint:\n' +
      'Based on recovered state, declare your mode as:\n' +
      '```\n' +
      '**OPSIS MODE: ' + detectedMode.toUpperCase() + '**\n' +
      'Mode: ' + detectedMode + '\n' +
      'Purpose: [describe current activity based on recovered state]\n' +
      'Implementation: ' + (detectedMode === 'implementation' ? 'AUTHORIZED' : 'BLOCKED') + ' - [additional context]\n' +
      '```'
    );
  } catch (error) {
    console.error('Compact Recovery Error in onPromptSubmitted:', error);
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
    
    // Initialize recovery state
    initializeTaskState(taskId);
    
    // Check if this is a continuation (compact scenario)
    const detection = detectCompactIndicators(prompt);
    
    if (detection.detected) {
      const artifacts = scanOpsisArtifacts();
      
      if (artifacts.length > 0) {
        logRecoveryEvent(taskId, 'task_created_with_compact_indicators', {
          detection,
          artifactCount: artifacts.length
        });
      }
    }
  } catch (error) {
    console.error('Compact Recovery Error in onTaskCreated:', error);
  }
}

// ============================================================================
// Export Hook Interface
// ============================================================================

module.exports = {
  name: 'compact-recovery',
  version: '1.0.0',
  description: 'Detects compact scenarios and auto-recovers Opsis state from artifacts',
  
  // Event handlers
  onPromptSubmitted,
  onTaskCreated,
  
  // Configuration
  config: CONFIG,
  
  // Utility functions (exposed for testing)
  utils: {
    detectCompactIndicators,
    scanOpsisArtifacts,
    determineModeFromArtifact,
    generateRecoveryReport
  }
};
