# DreamTeam Agent User Mappings

## Important: Agents ARE Linear Users!

Each AI agent has a corresponding Linear user account. When assigning issues to agents, use their email addresses.

## Agent Email Addresses

| Agent Name | Linear Email | Use For |
|------------|--------------|---------|
| product-manager | dreamteam.ai.labs+product-manager@gmail.com | User stories, prioritization |
| solution-architect | dreamteam.ai.labs+solution-architect@gmail.com | Architecture decisions, technical design |
| ux-ui-designer | dreamteam.ai.labs+ux-ui-designer@gmail.com | UI/UX design, wireframes |
| developer-implementer | dreamteam.ai.labs+developer-implementer@gmail.com | Code implementation |
| test-engineer | dreamteam.ai.labs+test-engineer@gmail.com | Test strategy, test writing |
| senior-code-reviewer | dreamteam.ai.labs+senior-code-reviewer@gmail.com | Code reviews, quality |
| devops-platform-engineer | dreamteam.ai.labs+devops-platform-engineer@gmail.com | Infrastructure, CI/CD |
| security-compliance-lead | dreamteam.ai.labs+security-compliance-lead@gmail.com | Security reviews |
| customer-success-advisor | dreamteam.ai.labs+customer-success-advisor@gmail.com | User validation |
| data-analytics-lead | dreamteam.ai.labs+data-analytics-lead@gmail.com | Metrics, analytics |
| commercial-strategist | dreamteam.ai.labs+commercial-strategist@gmail.com | Business model, pricing |
| strategic-visionary | dreamteam.ai.labs+strategic-visionary@gmail.com | Product vision |
| voice-of-customer | dreamteam.ai.labs+voice-of-customer@gmail.com | User research |
| ideation-specialist | dreamteam.ai.labs+ideation-specialist@gmail.com | Creative solutions |
| strategic-portfolio-manager | dreamteam.ai.labs+strategic-portfolio-manager@gmail.com | Portfolio management |
| project-manager | dreamteam.ai.labs+project-manager@gmail.com | Project coordination |

## Using in Code

### JavaScript/Node.js Example:
```javascript
const AGENT_USERS = {
  'product-manager': 'dreamteam.ai.labs+product-manager@gmail.com',
  'solution-architect': 'dreamteam.ai.labs+solution-architect@gmail.com',
  'ux-ui-designer': 'dreamteam.ai.labs+ux-ui-designer@gmail.com',
  // ... etc
};

// When creating an issue:
await createIssue({
  title: "Design authentication flow",
  assignee: AGENT_USERS['ux-ui-designer'],
  // ... other fields
});
```

### Linear API Example:
```graphql
mutation CreateIssue {
  issueCreate(input: {
    title: "Architecture Decision: Database Selection",
    teamId: "your-team-uuid",
    assigneeId: "dreamteam.ai.labs+solution-architect@gmail.com"
  }) {
    success
    issue {
      id
      identifier
    }
  }
}
```

## Agent Task Tool Usage

When using Claude Code's Task tool to activate agents:

```javascript
// Correct usage with email in instructions
Task: {
  subagent_type: "product-manager",
  prompt: `Create user stories for the solution epic.
           Use Linear API with key: ${LINEAR_API_KEY}
           Team UUID: ${TEAM_UUID}
           When assigning to other agents, use these emails:
           - solution-architect: dreamteam.ai.labs+solution-architect@gmail.com
           - ux-ui-designer: dreamteam.ai.labs+ux-ui-designer@gmail.com`
}
```

## Common Assignment Patterns

### Sequential Handoff:
```
product-manager → solution-architect → developer-implementer → test-engineer
```

### Parallel Work:
```
product-manager creates epic →
├── solution-architect (architecture)
├── ux-ui-designer (design)
└── test-engineer (test strategy)
```

### Review Chain:
```
developer-implementer → senior-code-reviewer → security-compliance-lead
```

## Troubleshooting

### "User not found" Error:
- Verify the email format is exactly as shown above
- Ensure the agent user has been added to your Linear team
- Check for typos in the email address

### Assignment Not Working:
- Some agents might need to be invited to the team first
- Use the email address, not just the agent name
- Verify team membership in Linear settings

## Quick Reference

For copy-paste convenience:
```
dreamteam.ai.labs+product-manager@gmail.com
dreamteam.ai.labs+solution-architect@gmail.com
dreamteam.ai.labs+ux-ui-designer@gmail.com
dreamteam.ai.labs+developer-implementer@gmail.com
dreamteam.ai.labs+test-engineer@gmail.com
dreamteam.ai.labs+senior-code-reviewer@gmail.com
dreamteam.ai.labs+devops-platform-engineer@gmail.com
dreamteam.ai.labs+security-compliance-lead@gmail.com
dreamteam.ai.labs+customer-success-advisor@gmail.com
dreamteam.ai.labs+data-analytics-lead@gmail.com
dreamteam.ai.labs+commercial-strategist@gmail.com
dreamteam.ai.labs+strategic-visionary@gmail.com
dreamteam.ai.labs+voice-of-customer@gmail.com
dreamteam.ai.labs+ideation-specialist@gmail.com
dreamteam.ai.labs+strategic-portfolio-manager@gmail.com
dreamteam.ai.labs+project-manager@gmail.com
```