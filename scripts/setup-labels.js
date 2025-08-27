#!/usr/bin/env node

/**
 * Setup script to create common labels in Linear
 * Run this after project creation to ensure all required labels exist
 */

require('dotenv').config();
const fetch = require('node-fetch');

const LINEAR_API_URL = 'https://api.linear.app/graphql';

// Common labels needed across phases
const REQUIRED_LABELS = [
  // Story types
  { name: 'user-story', color: '#4B92DB', description: 'User story issue' },
  { name: 'mvp', color: '#FF6B6B', description: 'Minimum viable product scope' },
  { name: 'epic', color: '#1E90FF', description: 'Epic containing multiple stories' },
  
  // Technical areas
  { name: 'architecture', color: '#9B59B6', description: 'Architecture decision or design' },
  { name: 'api', color: '#3498DB', description: 'API design or implementation' },
  { name: 'backend', color: '#34495E', description: 'Backend development' },
  { name: 'frontend', color: '#E67E22', description: 'Frontend development' },
  { name: 'database', color: '#16A085', description: 'Database related' },
  { name: 'infrastructure', color: '#7F8C8D', description: 'Infrastructure and DevOps' },
  
  // Process labels
  { name: 'development', color: '#3498DB', description: 'Development work' },
  { name: 'testing', color: '#95A5A6', description: 'Testing related' },
  { name: 'performance', color: '#F39C12', description: 'Performance optimization' },
  { name: 'security', color: '#E74C3C', description: 'Security related' },
  { name: 'compliance', color: '#8E44AD', description: 'Compliance requirements' },
  { name: 'documentation', color: '#52BE80', description: 'Documentation work' },
  
  // Priority/Status
  { name: 'blocking', color: '#E74C3C', description: 'Blocking other work' },
  { name: 'critical', color: '#C0392B', description: 'Critical priority' },
  { name: 'test', color: '#95A5A6', description: 'Testing related' },
  
  // Phase labels
  { name: 'phase-0', color: '#2ECC71', description: 'Phase 0 validation' },
  { name: 'phase-1', color: '#3498DB', description: 'Phase 1 work' },
  { name: 'phase-2', color: '#9B59B6', description: 'Phase 2 work' },
  { name: 'phase-3', color: '#F39C12', description: 'Phase 3 work' },
  { name: 'phase-4', color: '#E67E22', description: 'Phase 4 work' },
  { name: 'connectivity-verified', color: '#27AE60', description: 'API connectivity confirmed' },
// Phase 3 specific labels  { name: 'components', color: '#FF6B6B', description: 'Component development' },  { name: 'status-report', color: '#4ECDC4', description: 'Status report' },  { name: 'project-management', color: '#45B7D1', description: 'Project management' },  { name: 'convergence', color: '#96E6B3', description: 'Convergence point' },  { name: 'parallel-work', color: '#F7DC6F', description: 'Parallel work stream' },  { name: 'dependency', color: '#BB8FCE', description: 'Has dependencies' },  { name: 'integration', color: '#85C1E2', description: 'Integration work' },  { name: 'design-system', color: '#F8C471', description: 'Design system' },  { name: 'sprint-planning', color: '#82E0AA', description: 'Sprint planning' },  { name: 'retrospective', color: '#F1948A', description: 'Sprint retrospective' },
];

async function queryLinear(query, variables = {}) {
  const response = await fetch(LINEAR_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.LINEAR_API_KEY
    },
    body: JSON.stringify({ query, variables })
  });
  
  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }
  return data.data;
}

async function checkExistingLabel(name, teamId) {
  const query = `
    query CheckLabel($name: String!, $teamId: String) {
      issueLabels(filter: { name: { eq: $name }, team: { id: { eq: $teamId } } }) {
        nodes {
          id
          name
          color
        }
      }
    }
  `;
  
  try {
    const result = await queryLinear(query, { name, teamId });
    return result.issueLabels.nodes.length > 0 ? result.issueLabels.nodes[0] : null;
  } catch (error) {
    console.error(`Error checking label ${name}:`, error.message);
    return null;
  }
}

async function createLabel(label, teamId) {
  const mutation = `
    mutation CreateLabel($name: String!, $color: String, $description: String, $teamId: String) {
      issueLabelCreate(input: { 
        name: $name, 
        color: $color, 
        description: $description,
        teamId: $teamId
      }) {
        success
        issueLabel {
          id
          name
        }
      }
    }
  `;
  
  try {
    const result = await queryLinear(mutation, {
      name: label.name,
      color: label.color,
      description: label.description,
      teamId: teamId || null
    });
    
    if (result.issueLabelCreate.success) {
      return result.issueLabelCreate.issueLabel;
    }
    return null;
  } catch (error) {
    console.error(`Error creating label ${label.name}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🏷️  DreamTeam Label Setup');
  console.log('========================\n');
  
  if (!process.env.LINEAR_API_KEY) {
    console.error('❌ LINEAR_API_KEY not found in .env');
    process.exit(1);
  }
  
  const teamId = process.env.LINEAR_TEAM_UUID;
  const scope = teamId ? 'team' : 'workspace';
  
  console.log(`Creating labels in ${scope} scope${teamId ? ` (${process.env.LINEAR_TEAM_KEY})` : ''}...\n`);
  
  let created = 0;
  let existing = 0;
  let failed = 0;
  
  for (const label of REQUIRED_LABELS) {
    // Check if label already exists
    const existingLabel = await checkExistingLabel(label.name, teamId);
    
    if (existingLabel) {
      console.log(`✅ Label already exists: ${label.name}`);
      existing++;
    } else {
      // Create the label
      const newLabel = await createLabel(label, teamId);
      if (newLabel) {
        console.log(`➕ Created label: ${label.name}`);
        created++;
      } else {
        console.log(`❌ Failed to create: ${label.name}`);
        failed++;
      }
    }
  }
  
  console.log('\n========================');
  console.log('📊 Summary:');
  console.log(`  ✅ Already existed: ${existing}`);
  console.log(`  ➕ Newly created: ${created}`);
  if (failed > 0) {
    console.log(`  ❌ Failed: ${failed}`);
  }
  console.log('========================\n');
  
  if (failed === 0) {
    console.log('✅ All required labels are now available!');
  } else {
    console.log('⚠️  Some labels could not be created. Check permissions.');
  }
}

main().catch(console.error);