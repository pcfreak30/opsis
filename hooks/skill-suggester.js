/**
 * AiderDesk Hook: Skill Suggester
 * 
 * Purpose: Automatically analyze prompt context and suggest relevant skills
 * to improve task efficiency and accuracy.
 * 
 * Events:
 * - onPromptSubmitted: Analyze prompt text for keywords and patterns
 * - onTaskCreated: Suggest commonly used skills when new task begins
 * - onToolCalled: Detect tool usage patterns to refine skill suggestions
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  skillsDir: path.join(process.cwd(), 'skills'),
  maxSuggestions: 3,
  confidenceThreshold: 0.3,
  autoLoadTopSkills: true,
  topSkillsCount: 3
};

// Keyword-to-skill mapping based on skill descriptions
const KEYWORD_SKILL_MAP = {
  // Testing keywords
  'test': ['opsis-test-driven-development', 'opsis-verification-before-completion'],
  'unit test': ['opsis-test-driven-development'],
  'tdd': ['opsis-test-driven-development'],
  'spec': ['opsis-test-driven-development'],
  'assert': ['opsis-test-driven-development'],
  'verify': ['opsis-verification-before-completion', 'opsis-verify'],
  'verification': ['opsis-verification-before-completion', 'opsis-verify'],
  'check': ['opsis-verification-before-completion'],
  'validate': ['opsis-verification-before-completion'],
  'review': ['opsis-verification-before-completion', 'opsis-review'],
  
  // Debugging keywords
  'error': ['opsis-systematic-debugging'],
  'bug': ['opsis-systematic-debugging'],
  'fix': ['opsis-systematic-debugging'],
  'crash': ['opsis-systematic-debugging'],
  'fail': ['opsis-systematic-debugging'],
  'exception': ['opsis-systematic-debugging'],
  'debug': ['opsis-systematic-debugging'],
  'troubleshoot': ['opsis-systematic-debugging'],
  'trace': ['opsis-systematic-debugging'],
  'investigate': ['opsis-systematic-debugging'],
  'diagnose': ['opsis-systematic-debugging'],
  'issue': ['opsis-systematic-debugging'],
  'problem': ['opsis-systematic-debugging'],
  'broken': ['opsis-systematic-debugging'],
  'not working': ['opsis-systematic-debugging'],
  
  // Planning keywords
  'plan': ['opsis-prd', 'opsis-plan'],
  'design': ['opsis-prd'],
  'architecture': ['opsis-prd'],
  'structure': ['opsis-prd'],
  'requirements': ['opsis-prd'],
  'prd': ['opsis-prd'],
  'document': ['opsis-prd', 'tech-writer'],
  'brainstorm': ['opsis-brainstorming', 'opsis-start'],
  'explore': ['opsis-start', 'opsis-prd'],
  'discover': ['opsis-start', 'opsis-prd'],
  'discuss': ['opsis-start'],
  
  // Implementation keywords
  'implement': ['opsis-implement'],
  'create': ['opsis-implement'],
  'build': ['opsis-implement'],
  'write': ['opsis-implement'],
  'refactor': ['opsis-implement'],
  'develop': ['opsis-implement'],
  
  // Documentation keywords
  'doc': ['tech-writer'],
  'readme': ['tech-writer'],
  'guide': ['tech-writer'],
  'tutorial': ['tech-writer'],
  'documentation': ['tech-writer'],
  'api doc': ['tech-writer'],
  'help': ['tech-writer'],
  
  // Mode enforcement
  'mode': ['opsis-mode-enforcer'],
  'enforce': ['opsis-mode-enforcer'],
  'discipline': ['opsis-mode-enforcer'],
  'workflow': ['opsis-mode-enforcer'],
  
  // Parallel/subagent work
  'parallel': ['opsis-dispatching-parallel-agents'],
  'concurrent': ['opsis-dispatching-parallel-agents'],
  'subagent': ['opsis-coordinator', 'opsis-dispatching-parallel-agents'],
  'delegate': ['opsis-coordinator', 'opsis-delegation-checkpoint'],
  'agent': ['opsis-coordinator', 'opsis-dispatching-parallel-agents'],
  'coordinate': ['opsis-coordinator'],
  
  // Verification/Audit keywords
  'audit': ['opsis-verify', 'opsis-review'],
  'inspect': ['opsis-verify', 'opsis-review'],
  'quality': ['opsis-verify', 'opsis-review'],
  
  // Ideation/Creative keywords
  'creative': ['opsis-brainstorming', 'opsis-storytelling'],
  'idea': ['opsis-brainstorming', 'opsis-innovation-strategy'],
  'innovate': ['opsis-innovation-strategy'],
  'story': ['opsis-storytelling'],
  'narrative': ['opsis-storytelling'],
  
  // Workflow/Process keywords
  'workflow': ['opsis-mode-enforcer', 'opsis-workflow-classifier'],
  'process': ['opsis-mode-enforcer'],
  'discipline': ['opsis-mode-enforcer'],
  
  // TODO/Progress keywords
  'todo': ['opsis-progress-tracking'],
  'progress': ['opsis-progress-tracking'],
  'track': ['opsis-progress-tracking'],
  
  // Memory keywords
  'remember': ['opsis-memory-storage'],
  'store': ['opsis-memory-storage'],
  'recall': ['opsis-memory-storage'],
  'preference': ['opsis-memory-storage'],
  
  // Subtask keywords
  'subtask': ['opsis-subtask-dispatch'],
  'dependency': ['opsis-subtask-dispatch'],
  'manifest': ['opsis-subtask-dispatch'],
  
  // Recovery keywords
  'recover': ['opsis-compact-recovery'],
  'restore': ['opsis-compact-recovery'],
  'compact': ['opsis-compact-recovery'],
  
  // Decision keywords
  'decision': ['opsis-decision-point-gate', 'opsis-coordinator'],
  'choose': ['opsis-decision-point-gate'],
  'route': ['opsis-router'],
  'classify': ['opsis-workflow-classifier'],
  
  // Improvement keywords
  'improve': ['opsis-improve'],
  'optimize': ['opsis-improve'],
  'refine': ['opsis-refine'],
  
  // Archive keywords
  'archive': ['opsis-archive'],
  'complete': ['opsis-archive', 'opsis-finishing-a-development-branch'],
  'finish': ['opsis-finishing-a-development-branch'],
  'merge': ['opsis-finishing-a-development-branch'],
  
  // Contract/Agreement keywords
  'contract': ['opsis-contract'],
  'agreement': ['opsis-contract'],
  'precondition': ['opsis-contract'],
  'postcondition': ['opsis-contract'],
  
  // Iron Law keywords
  'iron law': ['opsis-iron-laws'],
  'law': ['opsis-iron-laws'],
  'violation': ['opsis-iron-laws', 'opsis-mode-enforcer']
};

// Skill usage tracking (in-memory, resets on restart)
const skillUsageStats = new Map();

/**
 * Extract keywords from prompt text
 * @param {string} text - The prompt text to analyze
 * @returns {string[]} - Array of keywords found
 */
function extractKeywords(text) {
  const lowerText = text.toLowerCase();
  const keywords = [];
  
  // Check each keyword mapping
  for (const keyword of Object.keys(KEYWORD_SKILL_MAP)) {
    // Use word boundary matching
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    if (regex.test(lowerText)) {
      keywords.push(keyword);
    }
  }
  
  return keywords;
}

/**
 * Calculate confidence score for skill suggestions
 * @param {string[]} keywords - Keywords found in prompt
 * @returns {Map<string, number>} - Skill names mapped to confidence scores
 */
function calculateConfidence(keywords) {
  const scores = new Map();
  
  keywords.forEach(keyword => {
    const skills = KEYWORD_SKILL_MAP[keyword] || [];
    skills.forEach(skill => {
      const currentScore = scores.get(skill) || 0;
      // More specific keywords get higher scores
      const specificity = keyword.split(' ').length;
      scores.set(skill, currentScore + (1 / specificity));
    });
  });
  
  // Normalize scores to 0-1 range
  const maxScore = Math.max(...scores.values(), 1);
  scores.forEach((score, skill) => {
    scores.set(skill, score / maxScore);
  });
  
  return scores;
}

/**
 * Get available skills from skills directory
 * @returns {Object[]} - Array of skill metadata
 */
function getAvailableSkills() {
  try {
    if (!fs.existsSync(CONFIG.skillsDir)) {
      return [];
    }
    
    const skillDirs = fs.readdirSync(CONFIG.skillsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    const skills = [];
    
    for (const skillDir of skillDirs) {
      const skillFile = path.join(CONFIG.skillsDir, skillDir, 'SKILL.md');
      if (fs.existsSync(skillFile)) {
        const content = fs.readFileSync(skillFile, 'utf-8');
        
        // Parse frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          try {
            const metadata = parseYAML(frontmatterMatch[1]);
            skills.push({
              name: metadata.name || skillDir,
              description: metadata.description || '',
              license: metadata.license || 'Unknown',
              path: skillFile
            });
          } catch (e) {
            // Skip invalid frontmatter
          }
        }
      }
    }
    
    return skills;
  } catch (error) {
    console.error('Error reading skills directory:', error);
    return [];
  }
}

/**
 * Simple YAML parser for frontmatter (handles basic cases)
 * @param {string} yamlString - YAML string to parse
 * @returns {Object} - Parsed object
 */
function parseYAML(yamlString) {
  const result = {};
  const lines = yamlString.split('\n');
  
  lines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      result[key] = value;
    }
  });
  
  return result;
}

/**
 * Update skill usage statistics
 * @param {string} skillName - Name of skill used
 */
function trackSkillUsage(skillName) {
  const current = skillUsageStats.get(skillName) || 0;
  skillUsageStats.set(skillName, current + 1);
}

/**
 * Get top N most used skills
 * @param {number} count - Number of top skills to return
 * @returns {string[]} - Array of skill names
 */
function getTopSkills(count) {
  return Array.from(skillUsageStats.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(entry => entry[0]);
}

/**
 * Generate skill suggestions based on prompt analysis
 * @param {string} prompt - The user prompt
 * @returns {Object[]} - Array of suggestions with confidence scores
 */
function generateSuggestions(prompt) {
  const keywords = extractKeywords(prompt);
  
  if (keywords.length === 0) {
    return [];
  }
  
  const scores = calculateConfidence(keywords);
  const availableSkills = getAvailableSkills();
  const availableSkillNames = new Set(availableSkills.map(s => s.name));
  
  // Filter to only available skills and sort by confidence
  const suggestions = Array.from(scores.entries())
    .filter(([skillName]) => availableSkillNames.has(skillName))
    .map(([skillName, confidence]) => {
      const skill = availableSkills.find(s => s.name === skillName);
      return {
        skillName,
        confidence,
        reason: `Matched keywords: ${keywords.join(', ')}`
      };
    })
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, CONFIG.maxSuggestions);
  
  return suggestions.filter(s => s.confidence >= CONFIG.confidenceThreshold);
}

/**
 * Format suggestions as user-friendly message
 * @param {Object[]} suggestions - Array of suggestions
 * @returns {string} - Formatted message
 */
function formatSuggestions(suggestions) {
  if (suggestions.length === 0) {
    return '';
  }
  
  const lines = ['💡 Suggested Skills:'];
  suggestions.forEach((s, i) => {
    const confidencePercent = Math.round(s.confidence * 100);
    lines.push(`  ${i + 1}. ${s.skillName} (${confidencePercent}% confidence)`);
    lines.push(`     ${s.reason}`);
  });
  
  return lines.join('\n');
}

/**
 * Format auto-load suggestions for new tasks
 * @param {string[]} skillNames - Array of skill names
 * @returns {string} - Formatted message
 */
function formatAutoLoadSuggestions(skillNames) {
  if (skillNames.length === 0) {
    return '';
  }
  
  return `📊 Frequently Used Skills: ${skillNames.map(s => `\`${s}\``).join(', ')}`;
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
    
    // Generate suggestions
    const suggestions = generateSuggestions(prompt);
    
    if (suggestions.length > 0) {
      const message = formatSuggestions(suggestions);
      context.addInfoMessage(message);
    }
  } catch (error) {
    console.error('Skill Suggester Error in onPromptSubmitted:', error);
  }
}

/**
 * Called when a new task is created
 * @param {Object} context - AiderDesk context object
 * @param {Object} event - Event data containing task information
 */
async function onTaskCreated(event, context) {
  try {
    // Auto-suggest top used skills if enabled
    if (CONFIG.autoLoadTopSkills) {
      const topSkills = getTopSkills(CONFIG.topSkillsCount);
      
      if (topSkills.length > 0) {
        const message = formatAutoLoadSuggestions(topSkills);
        context.addInfoMessage(message);
      }
    }
  } catch (error) {
    console.error('Skill Suggester Error in onTaskCreated:', error);
  }
}

/**
 * Called when a tool is invoked
 * @param {Object} context - AiderDesk context object
 * @param {Object} event - Event data containing tool information
 */
async function onToolCalled(event, context) {
  try {
    // Track skill usage if a skill was activated
    // This would require detecting skill activation from tool calls
    // For now, we'll implement a basic tracking mechanism
    
    const toolName = event.toolName || '';
    
    // If tool call indicates skill activation, track it
    // This is a placeholder - actual implementation depends on AiderDesk API
    if (toolName === 'skills_activate' && event.args && event.args.skill) {
      trackSkillUsage(event.args.skill);
    }
  } catch (error) {
    console.error('Skill Suggester Error in onToolCalled:', error);
  }
}

// ============================================================================
// Export Hook Interface
// ============================================================================

module.exports = {
  name: 'skill-suggester',
  version: '1.0.0',
  description: 'Automatically suggests relevant skills based on prompt context',
  
  // Event handlers
  onPromptSubmitted,
  onTaskCreated,
  onToolCalled,
  
  // Configuration
  config: CONFIG,
  
  // Utility functions (exposed for testing)
  utils: {
    extractKeywords,
    calculateConfidence,
    getAvailableSkills,
    generateSuggestions,
    trackSkillUsage,
    getTopSkills
  }
};
