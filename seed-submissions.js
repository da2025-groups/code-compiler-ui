#!/usr/bin/env node

/**
 * Seed Submissions Script
 *
 * Creates test submissions to populate leaderboard and admin submissions view.
 * Requires admin credentials and existing questions in the database.
 */

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000';
const ADMIN_EMAIL = 'admin@platform.com';
const ADMIN_PASSWORD = 'admin123';

// Test users to create submissions for
const TEST_USERS = [
  { email: 'alice@test.com', password: 'test123', name: 'Alice Johnson' },
  { email: 'bob@test.com', password: 'test123', name: 'Bob Smith' },
  { email: 'carol@test.com', password: 'test123', name: 'Carol Williams' },
  { email: 'dave@test.com', password: 'test123', name: 'Dave Brown' },
  { email: 'eve@test.com', password: 'test123', name: 'Eve Martinez' },
  { email: 'frank@test.com', password: 'test123', name: 'Frank Garcia' },
  { email: 'grace@test.com', password: 'test123', name: 'Grace Lee' },
  { email: 'henry@test.com', password: 'test123', name: 'Henry Wilson' },
  { email: 'ivy@test.com', password: 'test123', name: 'Ivy Chen' },
  { email: 'jack@test.com', password: 'test123', name: 'Jack Taylor' },
  { email: 'kate@test.com', password: 'test123', name: 'Kate Anderson' },
  { email: 'leo@test.com', password: 'test123', name: 'Leo Thompson' },
  { email: 'maya@test.com', password: 'test123', name: 'Maya Patel' },
  { email: 'noah@test.com', password: 'test123', name: 'Noah Davis' },
  { email: 'olivia@test.com', password: 'test123', name: 'Olivia Moore' },
];

// Code templates for different scenarios
const CODE_TEMPLATES = {
  // Working code that will likely pass most simple test cases
  accepted_python: `
# Read input and process
import sys
input_data = sys.stdin.read().strip()
# Simple echo for most problems
print(input_data)
`,
  // Partially correct (might pass some test cases)
  partial_python: `
# Partial solution
import sys
input_data = sys.stdin.read().strip()
if input_data:
    print("partial result")
`,
  // Code with intentional errors
  error_python: `
# This will cause runtime error
import sys
x = 1 / 0  # Division by zero
print(x)
`,
};

// Submission templates with varied results
const SUBMISSION_TEMPLATES = [
  { language: 'python', code: CODE_TEMPLATES.accepted_python, weight: 5 },
  { language: 'python', code: CODE_TEMPLATES.partial_python, weight: 2 },
  { language: 'python', code: CODE_TEMPLATES.error_python, weight: 1 },
];

async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(`Login failed for ${email}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function register(user) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const error = await response.text();
    // Ignore "User already exists" errors
    if (!error.includes('already exists')) {
      throw new Error(`Registration failed for ${user.email}: ${error}`);
    }
  }

  return true;
}

async function getQuestions(token) {
  const response = await fetch(`${API_BASE_URL}/admin/questions`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch questions');
  }

  const data = await response.json();
  return data;
}

async function createSubmission(token, questionId, template) {
  const response = await fetch(`${API_BASE_URL}/submissions/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      question_id: questionId,
      language: template.language,
      code: template.code,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create submission: ${error}`);
  }

  return await response.json();
}

function getRandomSubset(array, count) {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
}

function getRandomElement(array) {
  // Weighted random selection
  const totalWeight = array.reduce((sum, item) => sum + (item.weight || 1), 0);
  let random = Math.random() * totalWeight;

  for (const item of array) {
    random -= (item.weight || 1);
    if (random <= 0) return item;
  }

  return array[0];
}

async function seedSubmissions() {
  try {
    console.log('🚀 Starting submissions seeding...\n');

    // Login as admin to fetch questions
    console.log('🔐 Logging in as admin...');
    const adminToken = await login(ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('✅ Admin logged in\n');

    // Fetch available questions
    console.log('📚 Fetching questions...');
    const questions = await getQuestions(adminToken);
    console.log(`✅ Found ${questions.length} questions\n`);

    if (questions.length === 0) {
      console.log('❌ No questions found. Run seed-questions.js first!');
      process.exit(1);
    }

    // Register test users
    console.log('👥 Registering test users...');
    for (const user of TEST_USERS) {
      try {
        await register(user);
        console.log(`✅ Registered/verified: ${user.name}`);
      } catch (error) {
        console.log(`⚠️  ${user.name}: ${error.message}`);
      }
    }
    console.log('');

    // Create submissions for each user
    let totalSubmissions = 0;
    let successCount = 0;

    for (const user of TEST_USERS) {
      console.log(`📝 Creating submissions for ${user.name}...`);

      try {
        // Login as user
        const userToken = await login(user.email, user.password);

        // Each user solves 2-5 random questions
        const numQuestions = Math.floor(Math.random() * 4) + 2; // 2-5
        const userQuestions = getRandomSubset(questions, numQuestions);

        for (const question of userQuestions) {
          // Each question gets 1-2 submission attempts
          const numAttempts = Math.floor(Math.random() * 2) + 1; // 1-2

          for (let i = 0; i < numAttempts; i++) {
            const template = getRandomElement(SUBMISSION_TEMPLATES);

            try {
              const result = await createSubmission(userToken, question.id, template);
              totalSubmissions++;
              successCount++;
              console.log(`  ✅ ${question.title} - ${result.status} (${result.score || 0} points)`);

              // Delay to avoid rate limiting and backend overload
              await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
              totalSubmissions++;
              console.log(`  ❌ Failed: ${question.title} - ${error.message}`);
            }
          }
        }

        console.log(`  Done with ${user.name}`);
      } catch (error) {
        console.log(`  ❌ Error for ${user.name}: ${error.message}`);
      }

      console.log('');
    }

    // Summary
    console.log('='.repeat(50));
    console.log('📊 Seeding Complete');
    console.log('='.repeat(50));
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Failed:  ${totalSubmissions - successCount}`);
    console.log(`📚 Total:   ${totalSubmissions}`);

    if (successCount > 0) {
      console.log(`\n🎉 ${successCount} submissions created!`);
      console.log(`\n💡 View results at:`);
      console.log(`   Leaderboard: http://localhost:5173/leaderboard`);
      console.log(`   Admin View:  http://localhost:5173/admin/submissions`);
    }

  } catch (error) {
    console.error(`\n❌ Fatal error: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
seedSubmissions();
