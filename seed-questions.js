#!/usr/bin/env node

/**
 * Seed Questions Script
 *
 * This script seeds the database with sample questions from seed-questions.json
 * Requires admin credentials to authenticate.
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000';
const ADMIN_EMAIL = 'admin@platform.com';
const ADMIN_PASSWORD = 'admin123';

async function login() {
  console.log('🔐 Logging in as admin...');

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Login failed: ${error}`);
  }

  const data = await response.json();
  console.log('✅ Logged in successfully');
  return data.access_token;
}

async function createQuestion(token, question) {
  const response = await fetch(`${API_BASE_URL}/admin/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(question),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create "${question.title}": ${error}`);
  }

  const data = await response.json();
  return data;
}

async function seedQuestions() {
  try {
    // Read questions from file
    const questionsPath = join(__dirname, 'seed-questions.json');
    const questionsData = fs.readFileSync(questionsPath, 'utf-8');
    const questions = JSON.parse(questionsData);

    console.log(`📚 Found ${questions.length} questions to seed\n`);

    // Login to get admin token
    const token = await login();

    // Create each question
    let successCount = 0;
    let failCount = 0;

    for (const question of questions) {
      try {
        console.log(`📝 Creating: "${question.title}" (${question.difficulty})...`);
        await createQuestion(token, question);
        successCount++;
        console.log(`✅ Created successfully\n`);
      } catch (error) {
        failCount++;
        console.error(`❌ Failed: ${error.message}\n`);
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Seeding Complete');
    console.log('='.repeat(50));
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Failed:  ${failCount}`);
    console.log(`📚 Total:   ${questions.length}`);

    if (successCount > 0) {
      console.log(`\n🎉 ${successCount} questions added to the database!`);
      console.log(`\n💡 View them at: http://localhost:5173/questions`);
    }

  } catch (error) {
    console.error(`\n❌ Fatal error: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
seedQuestions();
