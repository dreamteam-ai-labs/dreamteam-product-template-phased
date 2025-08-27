#!/usr/bin/env node
/**
 * Get Linear team information including UUID
 * Usage: node scripts/get-team-info.js
 */

require('dotenv').config();
const https = require('https');

async function getTeamInfo() {
  const teamKey = process.env.LINEAR_TEAM_KEY;
  
  if (!teamKey) {
    console.error('❌ LINEAR_TEAM_KEY not set in .env');
    process.exit(1);
  }
  
  const query = `
    query GetTeam($key: String!) {
      team(key: $key) {
        id
        key
        name
        description
        issueCount
        members {
          nodes {
            name
            email
          }
        }
      }
    }
  `;
  
  const options = {
    hostname: 'api.linear.app',
    path: '/graphql',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.LINEAR_API_KEY
    }
  };
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.data && result.data.team) {
            console.log('✅ Team Information:');
            console.log(`   Key: ${result.data.team.key}`);
            console.log(`   UUID: ${result.data.team.id}`);
            console.log(`   Name: ${result.data.team.name}`);
            console.log(`   Issues: ${result.data.team.issueCount}`);
            console.log(`   Members: ${result.data.team.members.nodes.length}`);
            console.log('\n💡 Add this to your .env file:');
            console.log(`LINEAR_TEAM_UUID=${result.data.team.id}`);
            resolve(result.data.team);
          } else {
            console.error('❌ Team not found or error:', result.errors);
            reject(new Error('Team not found'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', reject);
    req.write(JSON.stringify({
      query: query,
      variables: { key: teamKey }
    }));
    req.end();
  });
}

getTeamInfo().catch(console.error);