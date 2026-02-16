/**
 * AiderDesk Hook: Session Tracker
 * 
 * Purpose: Track skill usage, tool calls, and task patterns throughout sessions,
 * logging data to files for post-session analysis and insights.
 * 
 * Events:
 * - onTaskCreated: Initialize session log entry
 * - onTaskClosed: Finalize session statistics
 * - onToolCalled: Log tool usage with metadata
 * - onCommandExecuted: Track command execution patterns
 * - onSubagentStarted/onSubagentFinished: Track subagent usage
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const CONFIG = {
  logsDir: path.join(process.cwd(), 'logs', 'sessions'),
  maxLogFileSize: 10 * 1024 * 1024,  // 10MB
  maxLogFiles: 5,
  enableCompression: true,
  enableLogging: true
};

// Session state
const sessions = new Map();

/**
 * Generate a unique session ID
 * @returns {string} - Session ID
 */
function generateSessionId() {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(4).toString('hex');
  return `session-${timestamp}-${random}`;
}

/**
 * Initialize a new session
 * @param {string} taskId - Task identifier
 * @param {Object} context - Initial context data
 * @returns {Object} - Session object
 */
function initializeSession(taskId, context = {}) {
  const sessionId = generateSessionId();
  
  const session = {
    sessionId,
    taskId,
    startTime: Date.now(),
    endTime: null,
    projectPath: process.cwd(),
    tasks: [],
    toolUsage: new Map(),
    skillUsage: new Map(),
    commandUsage: new Map(),
    subagentUsage: [],
    modeTransitions: [],
    todoUsage: new Map(),
    memoryUsage: new Map(),
    subtaskUsage: [],
    stats: {
      totalTasks: 0,
      completedTasks: 0,
      totalToolCalls: 0,
      failedToolCalls: 0,
      totalCommands: 0,
      failedCommands: 0,
      totalDuration: 0,
      modeDistribution: {
        planning: 0,
        implementation: 0,
        verification: 0
      },
      totalTodoCalls: 0,
      totalMemoryCalls: 0,
      totalSubtasks: 0
    },
    events: []
  };
  
  sessions.set(taskId, session);
  
  // Log session initialization
  logSessionEvent(taskId, 'session_initialized', {
    sessionId,
    projectPath: session.projectPath
  });
  
  return session;
}

/**
 * Get or create session for a task
 * @param {string} taskId - Task identifier
 * @returns {Object} - Session object
 */
function getSession(taskId) {
  if (!sessions.has(taskId)) {
    return initializeSession(taskId);
  }
  return sessions.get(taskId);
}

/**
 * Log session event
 * @param {string} taskId - Task identifier
 * @param {string} eventType - Type of event
 * @param {Object} data - Event data
 */
function logSessionEvent(taskId, eventType, data = {}) {
  if (!CONFIG.enableLogging) {
    return;
  }
  
  try {
    const session = getSession(taskId);
    
    const event = {
      timestamp: Date.now(),
      eventType,
      ...data
    };
    
    session.events.push(event);
    
    // Write to log file
    writeSessionLog(session, event);
  } catch (error) {
    console.error('Error logging session event:', error);
  }
}

/**
 * Write event to session log file
 * @param {Object} session - Session object
 * @param {Object} event - Event object
 */
function writeSessionLog(session, event) {
  try {
    if (!fs.existsSync(CONFIG.logsDir)) {
      fs.mkdirSync(CONFIG.logsDir, { recursive: true });
    }
    
    const logFile = path.join(CONFIG.logsDir, `${session.sessionId}.log`);
    
    // Check file size and rotate if needed
    if (fs.existsSync(logFile)) {
      const stats = fs.statSync(logFile);
      if (stats.size >= CONFIG.maxLogFileSize) {
        rotateLogFile(logFile);
      }
    }
    
    // Write event (append mode)
    const logLine = JSON.stringify(event) + '\n';
    fs.appendFileSync(logFile, logLine, 'utf8');
  } catch (error) {
    console.error('Error writing session log:', error);
  }
}

/**
 * Rotate log file when size limit is reached
 * @param {string} logFile - Path to log file
 */
function rotateLogFile(logFile) {
  try {
    // Move existing logs
    for (let i = CONFIG.maxLogFiles - 1; i > 0; i--) {
      const oldFile = i === 1 ? logFile : `${logFile}.${i - 1}`;
      const newFile = `${logFile}.${i}`;
      
      if (fs.existsSync(oldFile)) {
        if (fs.existsSync(newFile)) {
          fs.unlinkSync(newFile);
        }
        fs.renameSync(oldFile, newFile);
      }
    }
    
    // Compress if enabled
    if (CONFIG.enableCompression) {
      compressOldLogs();
    }
  } catch (error) {
    console.error('Error rotating log file:', error);
  }
}

/**
 * Compress old log files
 */
function compressOldLogs() {
  try {
    const zlib = require('zlib');
    const files = fs.readdirSync(CONFIG.logsDir)
      .filter(f => f.endsWith('.log') && f.includes('.'))
      .sort();
    
    for (const file of files) {
      const filePath = path.join(CONFIG.logsDir, file);
      const gzPath = `${filePath}.gz`;
      
      if (!fs.existsSync(gzPath)) {
        const content = fs.readFileSync(filePath);
        const compressed = zlib.gzipSync(content);
        fs.writeFileSync(gzPath, compressed);
        fs.unlinkSync(filePath);
      }
    }
  } catch (error) {
    console.error('Error compressing logs:', error);
  }
}

/**
 * Update session statistics
 * @param {Object} session - Session object
 */
function updateSessionStats(session) {
  // Calculate total duration
  const endTime = session.endTime || Date.now();
  session.stats.totalDuration = endTime - session.startTime;
  
  // Calculate mode distribution
  let planningDuration = 0;
  let implementationDuration = 0;
  let verificationDuration = 0;
  let lastTimestamp = session.startTime;
  let lastMode = 'planning'; // Default starting mode
  
  session.modeTransitions.forEach(transition => {
    const duration = transition.timestamp - lastTimestamp;
    
    if (lastMode === 'planning') {
      planningDuration += duration;
    } else if (lastMode === 'implementation') {
      implementationDuration += duration;
    } else if (lastMode === 'verification') {
      verificationDuration += duration;
    }
    
    lastTimestamp = transition.timestamp;
    lastMode = transition.mode;
  });
  
  // Add final segment
  const finalDuration = endTime - lastTimestamp;
  if (lastMode === 'planning') {
    planningDuration += finalDuration;
  } else if (lastMode === 'implementation') {
    implementationDuration += finalDuration;
  } else if (lastMode === 'verification') {
    verificationDuration += finalDuration;
  }
  
  const totalDuration = planningDuration + implementationDuration + verificationDuration;
  
  if (totalDuration > 0) {
    session.stats.modeDistribution.planning = Math.round(
      (planningDuration / totalDuration) * 100
    );
    session.stats.modeDistribution.implementation = Math.round(
      (implementationDuration / totalDuration) * 100
    );
    session.stats.modeDistribution.verification = Math.round(
      (verificationDuration / totalDuration) * 100
    );
  }
  
  // Calculate tool call success rate
  if (session.stats.totalToolCalls > 0) {
    session.stats.toolSuccessRate = (
      (session.stats.totalToolCalls - session.stats.failedToolCalls) / 
      session.stats.totalToolCalls * 100
    ).toFixed(2);
  }
  
  // Calculate command success rate
  if (session.stats.totalCommands > 0) {
    session.stats.commandSuccessRate = (
      (session.stats.totalCommands - session.stats.failedCommands) / 
      session.stats.totalCommands * 100
    ).toFixed(2);
  }
}

/**
 * Generate session summary
 * @param {Object} session - Session object
 * @returns {Object} - Session summary
 */
function generateSessionSummary(session) {
  updateSessionStats(session);
  
  // Get top tools
  const topTools = Array.from(session.toolUsage.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tool, count]) => ({ tool, count }));
  
  // Get top skills
  const topSkills = Array.from(session.skillUsage.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([skill, count]) => ({ skill, count }));
  
  // Get top commands
  const topCommands = Array.from(session.commandUsage.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([command, count]) => ({ command, count }));
  
  // Get TODO tool usage
  const todoTools = Array.from(session.todoUsage.entries())
    .map(([tool, count]) => ({ tool, count }));
  
  // Get memory tool usage
  const memoryTools = Array.from(session.memoryUsage.entries())
    .map(([tool, count]) => ({ tool, count }));
  
  return {
    sessionId: session.sessionId,
    taskId: session.taskId,
    startTime: new Date(session.startTime).toISOString(),
    endTime: session.endTime ? new Date(session.endTime).toISOString() : null,
    duration: session.stats.totalDuration,
    durationFormatted: formatDuration(session.stats.totalDuration),
    stats: session.stats,
    topTools,
    topSkills,
    topCommands,
    todoTools,
    memoryTools,
    subagentCount: session.subagentUsage.length,
    subtaskCount: session.subtaskUsage.length,
    eventCount: session.events.length
  };
}

/**
 * Format duration in human-readable format
 * @param {number} milliseconds - Duration in milliseconds
 * @returns {string} - Formatted duration
 */
function formatDuration(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Write session summary to file
 * @param {Object} session - Session object
 */
function writeSessionSummary(session) {
  try {
    if (!fs.existsSync(CONFIG.logsDir)) {
      fs.mkdirSync(CONFIG.logsDir, { recursive: true });
    }
    
    const summaryFile = path.join(CONFIG.logsDir, `${session.sessionId}-summary.json`);
    const summary = generateSessionSummary(session);
    
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2), 'utf8');
    
    console.log(`Session summary written to: ${summaryFile}`);
  } catch (error) {
    console.error('Error writing session summary:', error);
  }
}

/**
 * Generate recommendations based on session data
 * @param {Object} session - Session object
 * @returns {string[]} - Array of recommendations
 */
function generateRecommendations(session) {
  const recommendations = [];
  
  // Check for high error rate
  const errorRate = session.stats.totalToolCalls > 0
    ? session.stats.failedToolCalls / session.stats.totalToolCalls
    : 0;
  
  if (errorRate > 0.2) {
    recommendations.push(
      'High tool error rate detected. Consider reviewing tool usage patterns ' +
      'and ensuring proper error handling.'
    );
  }
  
  // Check mode balance
  const modeDist = session.stats.modeDistribution;
  if (modeDist.planning < 10) {
    recommendations.push(
      'Low planning time detected. Consider spending more time on requirements ' +
      'and design to reduce implementation iterations.'
    );
  }
  
  if (modeDist.verification < 10) {
    recommendations.push(
      'Low verification time detected. Ensure adequate testing and review ' +
      'to maintain code quality.'
    );
  }
  
  // Check for frequently used tools
  const topTool = Array.from(session.toolUsage.entries())
    .sort((a, b) => b[1] - a[1])[0];
  
  if (topTool && topTool[1] > 50) {
    recommendations.push(
      `High usage of \`${topTool[0]}\` tool (${topTool[1]} calls). ` +
      'Consider if there are more efficient approaches.'
    );
  }
  
  // Check subagent usage
  if (session.subagentUsage.length > 10) {
    recommendations.push(
      'High subagent usage detected. Review if tasks could be consolidated ' +
      'or if main agent could handle more directly.'
    );
  }
  
  return recommendations;
}

// ============================================================================
// AiderDesk Hook Event Handlers
// ============================================================================

/**
 * Called when a new task is created
 * @param {Object} context - AiderDesk context object
 * @param {Object} event - Event data containing task information
 */
async function onTaskCreated(event, context) {
  try {
    const taskId = event.task?.id || 'default';
    const prompt = event.task?.prompt || '';
    
    // Initialize session
    const session = initializeSession(taskId, {
      initialPrompt: prompt.substring(0, 200)
    });
    
    // Log task creation
    logSessionEvent(taskId, 'task_created', {
      promptPreview: prompt.substring(0, 100)
    });
  } catch (error) {
    console.error('Session Tracker Error in onTaskCreated:', error);
  }
}

/**
 * Called when a task is closed
 * @param {Object} context - AiderDesk context object
 * @param {Object} event - Event data containing task information
 */
async function onTaskClosed(event, context) {
  try {
    const taskId = event.task?.id || 'default';
    const status = event.task?.status || 'unknown';
    
    const session = getSession(taskId);
    session.endTime = Date.now();
    session.stats.completedTasks++;
    
    // Write session summary
    writeSessionSummary(session);
    
    // Log task closure
    logSessionEvent(taskId, 'task_closed', {
      status,
      duration: session.stats.totalDuration
    });
    
    // Generate and log recommendations
    const recommendations = generateRecommendations(session);
    if (recommendations.length > 0) {
      logSessionEvent(taskId, 'recommendations', { recommendations });
      console.log('\n📊 Session Recommendations:');
      recommendations.forEach((rec, i) => {
        console.log(`  ${i + 1}. ${rec}`);
      });
    }
  } catch (error) {
    console.error('Session Tracker Error in onTaskClosed:', error);
  }
}

/**
 * Called when a tool is invoked
 * @param {Object} context - AiderDesk context object
 * @param {Object} event - Event data containing tool information
 */
async function onToolCalled(event, context) {
  try {
    const toolName = event.toolName || 'unknown';
    const taskId = event.task?.id || 'default';
    const args = event.args || {};
    // Note: onToolCalled doesn't provide result, only toolName and args
    const result = { success: true }; // Default assumption
    
    const session = getSession(taskId);
    
    // Track tool usage
    const currentCount = session.toolUsage.get(toolName) || 0;
    session.toolUsage.set(toolName, currentCount + 1);
    
    session.stats.totalToolCalls++;
    if (result.success === false || result.error) {
      session.stats.failedToolCalls++;
    }
    
    // Track TODO tool usage (opsis-progress-tracking integration)
    if (toolName.startsWith('todo---')) {
      session.stats.totalTodoCalls++;
      const todoCount = session.todoUsage.get(toolName) || 0;
      session.todoUsage.set(toolName, todoCount + 1);
    }
    
    // Track memory tool usage (opsis-memory-storage integration)
    if (toolName.startsWith('memory---')) {
      session.stats.totalMemoryCalls++;
      const memoryCount = session.memoryUsage.get(toolName) || 0;
      session.memoryUsage.set(toolName, memoryCount + 1);
    }
    
    // Track skill activation (skills---activate_skill)
    if (toolName === 'skills---activate_skill' && args.skill) {
      const skillCount = session.skillUsage.get(args.skill) || 0;
      session.skillUsage.set(args.skill, skillCount + 1);
    }
    
    // Track subtask creation (tasks---create_task with parentTaskId)
    if (toolName === 'tasks---create_task' && args.parentTaskId) {
      session.stats.totalSubtasks++;
      // Note: We can't get the new subtaskId from onToolCalled event
      // The subtask ID would be available in onTaskCreated for the new task
      session.subtaskUsage.push({
        subtaskId: 'pending-creation',
        parentTaskId: args.parentTaskId,
        timestamp: Date.now(),
        prompt: args.prompt ? args.prompt.substring(0, 100) : ''
      });
    }
    
    // Log tool call
    logSessionEvent(taskId, 'tool_called', {
      toolName,
      success: result.success !== false,
      args: Object.keys(args),
      executionTime: event.executionTime,
      isTodoTool: toolName.startsWith('todo---'),
      isMemoryTool: toolName.startsWith('memory---'),
      isSkillActivation: toolName === 'skills---activate_skill',
      skillName: toolName === 'skills---activate_skill' ? args.skill : undefined,
      isSubtaskCreation: toolName === 'tasks---create_task' && !!args.parentTaskId
    });
  } catch (error) {
    console.error('Session Tracker Error in onToolCalled:', error);
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
    // Note: onCommandExecuted only provides { command: string }
    const result = { exitCode: 0 }; // Assume success
    
    const session = getSession(taskId);
    
    // Track command usage (by first word)
    const commandName = command.split(' ')[0] || command;
    const currentCount = session.commandUsage.get(commandName) || 0;
    session.commandUsage.set(commandName, currentCount + 1);
    
    session.stats.totalCommands++;
    if (result.exitCode !== 0) {
      session.stats.failedCommands++;
    }
    
    // Log command execution
    logSessionEvent(taskId, 'command_executed', {
      command: command.substring(0, 100),
      exitCode: result.exitCode,
      executionTime: event.executionTime
    });
  } catch (error) {
    console.error('Session Tracker Error in onCommandExecuted:', error);
  }
}

/**
 * Called when a subagent is started
 * @param {Object} context - AiderDesk context object
 * @param {Object} event - Event data containing subagent information
 */
async function onSubagentStarted(event, context) {
  try {
    const subagentId = event.subagentId || 'unknown';
    const taskId = event.task?.id || 'default';
    const prompt = event.prompt || '';
    
    const session = getSession(taskId);
    
    // Track subagent usage
    session.subagentUsage.push({
      subagentId,
      startTime: Date.now(),
      endTime: null,
      prompt: prompt.substring(0, 200)
    });
    
    // Log subagent start
    logSessionEvent(taskId, 'subagent_started', {
      subagentId,
      promptPreview: prompt.substring(0, 100)
    });
  } catch (error) {
    console.error('Session Tracker Error in onSubagentStarted:', error);
  }
}

/**
 * Called when a subagent finishes
 * @param {Object} context - AiderDesk context object
 * @param {Object} event - Event data containing subagent information
 */
async function onSubagentFinished(event, context) {
  try {
    const subagentId = event.subagentId || 'unknown';
    const taskId = event.task?.id || 'default';
    const resultMessages = event.resultMessages || [];
    
    const session = getSession(taskId);
    
    // Find and update subagent record
    const subagentRecord = session.subagentUsage.find(
      s => s.subagentId === subagentId && s.endTime === null
    );
    
    if (subagentRecord) {
      subagentRecord.endTime = Date.now();
      subagentRecord.duration = subagentRecord.endTime - subagentRecord.startTime;
      subagentRecord.success = result.success !== false;
    }
    
    // Log subagent finish
    logSessionEvent(taskId, 'subagent_finished', {
      subagentId,
      success: result.success !== false,
      duration: subagentRecord ? subagentRecord.duration : null
    });
  } catch (error) {
    console.error('Session Tracker Error in onSubagentFinished:', error);
  }
}

// ============================================================================
// Export Hook Interface
// ============================================================================

module.exports = {
  name: 'session-tracker',
  version: '2.0.0',
  description: 'Tracks skill usage, tool calls, TODO/memory operations, subtasks, and task patterns throughout sessions',
  
  // Event handlers
  onTaskCreated,
  onTaskClosed,
  onToolCalled,
  onCommandExecuted,
  onSubagentStarted,
  onSubagentFinished,
  
  // Configuration
  config: CONFIG,
  
  // Utility functions (exposed for testing)
  utils: {
    generateSessionId,
    initializeSession,
    getSession,
    generateSessionSummary,
    updateSessionStats,
    generateRecommendations,
    formatDuration
  }
};
