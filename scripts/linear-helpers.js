/**
 * Linear API Helper Utilities
 */

require('dotenv').config();

// Format multi-line text for Linear comments
function formatComment(lines) {
  if (Array.isArray(lines)) {
    return lines.join(' • ');
  }
  return lines.replace(/\n/g, ' • ');
}

// Agent email directory
const AGENT_EMAILS = {
  'product-manager': 'dreamteam.ai.labs+product-manager@gmail.com',
  'solution-architect': 'dreamteam.ai.labs+solution-architect@gmail.com',
  'ux-ui-designer': 'dreamteam.ai.labs+ux-ui-designer@gmail.com',
  'developer-implementer': 'dreamteam.ai.labs+developer-implementer@gmail.com',
  'test-engineer': 'dreamteam.ai.labs+test-engineer@gmail.com',
  'senior-code-reviewer': 'dreamteam.ai.labs+senior-code-reviewer@gmail.com',
  'devops-platform-engineer': 'dreamteam.ai.labs+devops-platform-engineer@gmail.com',
  'security-compliance-lead': 'dreamteam.ai.labs+security-compliance-lead@gmail.com',
  'customer-success-advisor': 'dreamteam.ai.labs+customer-success-advisor@gmail.com',
  'data-analytics-lead': 'dreamteam.ai.labs+data-analytics-lead@gmail.com',
  'commercial-strategist': 'dreamteam.ai.labs+commercial-strategist@gmail.com',
  'strategic-visionary': 'dreamteam.ai.labs+strategic-visionary@gmail.com',
  'voice-of-customer': 'dreamteam.ai.labs+voice-of-customer@gmail.com',
  'ideation-specialist': 'dreamteam.ai.labs+ideation-specialist@gmail.com',
  'strategic-portfolio-manager': 'dreamteam.ai.labs+strategic-portfolio-manager@gmail.com',
  'project-manager': 'dreamteam.ai.labs+project-manager@gmail.com'
};

module.exports = {
  formatComment,
  AGENT_EMAILS
};
