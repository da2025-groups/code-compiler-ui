#!/usr/bin/env node

/**
 * Fix Submissions Script
 *
 * Re-submits correct solutions for all test users so the leaderboard
 * reflects real scores. The ranking service uses best score per
 * (user, question), so new correct submissions override old wrong_answer ones.
 */

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000';

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

// Correct solutions keyed by question title
const SOLUTIONS = {
  'Two Sum': `
import sys, json
input_data = sys.stdin.read().strip()
parts = input_data.rsplit(' ', 1)
array_str = parts[0].strip('[]')
target = int(parts[1])
nums = [int(x.strip()) for x in array_str.split(',')]
seen = {}
for i, num in enumerate(nums):
    complement = target - num
    if complement in seen:
        print(json.dumps([seen[complement], i], separators=(',', ':')))
        break
    seen[num] = i
`,
  'Reverse String': `
import sys, json
chars = json.loads(sys.stdin.read().strip())
chars.reverse()
print(json.dumps(chars, separators=(',', ':')))
`,
  'Valid Palindrome': `
import sys
s = sys.stdin.read().strip()
cleaned = ''.join(c.lower() for c in s if c.isalnum())
print(str(cleaned == cleaned[::-1]).lower())
`,
  'Maximum Subarray': `
import sys, json
nums = json.loads(sys.stdin.read().strip())
max_sum = current = nums[0]
for n in nums[1:]:
    current = max(n, current + n)
    max_sum = max(max_sum, current)
print(max_sum)
`,
  'Merge Two Sorted Lists': `
import sys, json
data = sys.stdin.read().strip()
parts = data.split('] [')
l1 = json.loads(parts[0] + ']')
l2 = json.loads('[' + parts[1])
result = []
i = j = 0
while i < len(l1) and j < len(l2):
    if l1[i] <= l2[j]:
        result.append(l1[i]); i += 1
    else:
        result.append(l2[j]); j += 1
result.extend(l1[i:]); result.extend(l2[j:])
print(json.dumps(result, separators=(',', ':')))
`,
  'Binary Search': `
import sys, json
data = sys.stdin.read().strip()
parts = data.rsplit(' ', 1)
nums = json.loads(parts[0])
target = int(parts[1])
left, right = 0, len(nums) - 1
while left <= right:
    mid = (left + right) // 2
    if nums[mid] == target:
        print(mid); break
    elif nums[mid] < target:
        left = mid + 1
    else:
        right = mid - 1
else:
    print(-1)
`,
  'Climbing Stairs': `
import sys
n = int(sys.stdin.read().strip())
if n <= 2:
    print(n)
else:
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    print(b)
`,
  'Longest Common Prefix': `
import sys, json
strs = json.loads(sys.stdin.read().strip())
if not strs:
    print('')
else:
    prefix = strs[0]
    for s in strs[1:]:
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix: break
    print(prefix)
`,
  'Find Peak Element': `
import sys, json
nums = json.loads(sys.stdin.read().strip())
left, right = 0, len(nums) - 1
while left < right:
    mid = (left + right) // 2
    if nums[mid] > nums[mid + 1]:
        right = mid
    else:
        left = mid + 1
print(left)
`,
  'Product of Array Except Self': `
import sys, json
nums = json.loads(sys.stdin.read().strip())
n = len(nums)
result = [1] * n
lp = 1
for i in range(n):
    result[i] = lp; lp *= nums[i]
rp = 1
for i in range(n - 1, -1, -1):
    result[i] *= rp; rp *= nums[i]
print(json.dumps(result, separators=(',', ':')))
`,
  'Rotate Array': `
import sys, json
data = sys.stdin.read().strip()
parts = data.rsplit(' ', 1)
nums = json.loads(parts[0])
k = int(parts[1]) % len(nums)
nums = nums[-k:] + nums[:-k]
print(json.dumps(nums, separators=(',', ':')))
`,
};

// How many questions each user solves (varied for realistic leaderboard)
const USER_SOLVE_COUNTS = [9, 8, 7, 7, 6, 6, 5, 5, 5, 4, 4, 3, 3, 2, 2];

async function login(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(`Login failed for ${email}`);
  return (await res.json()).access_token;
}

async function submit(token, questionId, code) {
  const res = await fetch(`${API_BASE_URL}/submissions/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ question_id: questionId, language: 'python', code }),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

async function getQuestions(token) {
  const res = await fetch(`${API_BASE_URL}/admin/questions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch questions');
  return await res.json();
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

async function main() {
  console.log('🔧 Fixing submissions with correct solutions...\n');

  // Login as admin to get full question list
  const adminToken = await login('admin@platform.com', 'admin123');
  const allQuestions = await getQuestions(adminToken);

  // Only questions we have solutions for
  const solvable = allQuestions.filter(q => SOLUTIONS[q.title]);
  console.log(`✅ Found ${solvable.length} solvable questions\n`);

  let totalPassed = 0;

  for (let i = 0; i < TEST_USERS.length; i++) {
    const user = TEST_USERS[i];
    const solveCount = USER_SOLVE_COUNTS[i];
    console.log(`👤 ${user.name} (solving ${solveCount} questions)...`);

    try {
      const token = await login(user.email, user.password);
      const selected = shuffle(solvable).slice(0, solveCount);

      for (const q of selected) {
        const code = SOLUTIONS[q.title];
        try {
          const result = await submit(token, q.id, code);
          const icon = result.status === 'accepted' ? '✅' : '❌';
          console.log(`  ${icon} ${q.title} — ${result.status} (${result.score}/100)`);
          if (result.status === 'accepted') totalPassed++;
          await new Promise(r => setTimeout(r, 300));
        } catch (err) {
          console.log(`  ⚠️  ${q.title} — ${err.message}`);
        }
      }
    } catch (err) {
      console.log(`  ❌ Login failed: ${err.message}`);
    }
    console.log('');
  }

  console.log('='.repeat(50));
  console.log(`🎉 Done! ${totalPassed} accepted submissions created.`);
  console.log('🏆 Check the leaderboard: http://localhost:5173/leaderboard');
}

main().catch(err => { console.error(err.message); process.exit(1); });
