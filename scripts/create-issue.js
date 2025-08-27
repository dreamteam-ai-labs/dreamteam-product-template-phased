#!/usr/bin/env node
/**
 * Simple script to create a Linear issue
 * Usage: node scripts/create-issue.js "Title" "Description"
 */

require('dotenv').config();
const LinearClient = require('./linear-client');

async function main() {
  const title = process.argv[2];
  const description = process.argv[3] || '';
  
  if (!title) {
    console.error('Usage: node scripts/create-issue.js "Title" "Description"');
    process.exit(1);
  }
  
  const client = new LinearClient();
  
  try {
    console.log('Creating Linear issue...');
    const result = await client.createIssue({
      title: title,
      description: description
    });
    
    if (result.success) {
      console.log('✅ Issue created successfully!');
      console.log(`   ID: ${result.identifier}`);
      console.log(`   UUID: ${result.uuid}`);
      console.log(`   URL: ${result.url}`);
    } else {
      console.error('❌ Failed to create issue:', result.error);
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main().catch(console.error);