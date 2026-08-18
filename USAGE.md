# Usage Guide — Code Compiler Platform

Step-by-step guide for students, admins, and developers.

---

## Table of Contents

1. [Student Workflow](#1-student-workflow)
2. [Admin Workflow](#2-admin-workflow)
3. [Playground](#3-playground)
4. [Submitting Solutions](#4-submitting-solutions)
5. [Leaderboard](#5-leaderboard)
6. [Demo Credentials](#6-demo-credentials)
7. [Seeding Data for Demo](#7-seeding-data-for-demo)

---

## 1. Student Workflow

### Register

1. Open `http://localhost:5173`
2. Click **Don't have an account? Register**
3. Fill in Name, Email, Password → **Register**
4. You are logged in and redirected to the Problems page

### Solve a Problem

1. Click **Problems** in the navbar
2. Browse the list — each row shows title, difficulty badge, and whether you've already solved it
3. Click a problem title to open it
4. Read the **Description**, **Constraints**, **Sample Input / Output**
5. Write or paste your solution in the Monaco code editor on the right
6. Select your language from the dropdown (default: Python)
7. Click **Run Code** to test against the sample input — output appears below
8. When ready, click **Submit Solution** to judge against all hidden test cases
9. The verdict panel shows pass/fail per test case and your total score

### Check Your Standing

- Click **Leaderboard** to see global rankings ordered by total score
- Your name appears after your first accepted submission

---

## 2. Admin Workflow

Log in with `admin@platform.com` / `admin123`. Admin users see extra nav items.

### Manage Questions

**View all questions (including unpublished drafts)**
- Navigate to `/admin/questions`
- The table shows Title, Difficulty, Published status, Created/Updated timestamps
- Unpublished questions are invisible to students but visible here

**Create a new question**
1. Click **Create New Question** (top-right of the questions table)
2. Fill in all fields:

   | Field | Notes |
   |---|---|
   | Title | Short, descriptive |
   | Description | Full problem statement — supports plain text |
   | Difficulty | Easy / Medium / Hard |
   | Constraints | Input size limits (e.g. `1 ≤ n ≤ 10⁴`) |
   | Sample Input | Single example shown to students |
   | Sample Output | Expected output for the sample |
   | Test Cases | JSON array — see format below |
   | Published | Toggle on to make visible to students |

3. **Test Cases JSON format:**
   ```json
   [
     { "input": "[2,7,11,15] 9", "expected_output": "[0,1]" },
     { "input": "[3,2,4] 6",     "expected_output": "[1,2]" }
   ]
   ```
   - `input` is passed to the program's stdin
   - `expected_output` is compared against stdout (trimmed whitespace)
   - Add as many test cases as needed
   - Include edge cases the sample doesn't cover

4. Click **Create Question**
5. You are redirected to the questions list

**Edit an existing question**
1. Click the pencil icon (edit) in the Actions column
2. All fields are pre-populated
3. Make changes and click **Update Question**

**Publish / Unpublish**
- Toggle **Published** in the edit form and save
- Unpublished questions are hidden from the student Problems page

### Monitor Submissions

- Navigate to `/admin/submissions`
- Table shows: User, Question, Language, Status (colour-coded verdict), Score, Date
- Read-only — use for monitoring and debugging student results

---

## 3. Playground

The Playground is a free scratchpad — no problems, no scoring, no history.

1. Click **Playground** in the navbar
2. Write any code in the editor
3. Type custom input in the **Stdin** box (optional)
4. Click **Run** — output appears immediately
5. Nothing is saved; refresh to start fresh

**Useful for:**
- Testing language syntax
- Exploring I/O format before submitting
- Live coding demos

---

## 4. Submitting Solutions

### Run vs Submit

| | Run Code | Submit Solution |
|---|---|---|
| Tests against | Sample input only | All hidden test cases |
| Saved to DB | No | Yes |
| Affects score | No | Yes |
| Shows test details | Sample output only | Per-case verdict table |

### Output Format Tips

The judge compares `actual.strip() == expected.strip()` — trailing newlines and spaces are ignored.

For array outputs, use compact JSON to match the stored expected format:

```python
import json
print(json.dumps(result, separators=(',', ':')))  # [0,1] not [0, 1]
```

For boolean outputs, use lowercase:
```python
print(str(result).lower())  # true / false
```

### Working Python Solutions

See [`SOLUTIONS.md`](./SOLUTIONS.md) for copy-paste ready solutions for all 11 demo questions.

---

## 5. Leaderboard

- Shows all users who have at least one submission
- Ranked by **total score** (sum of best score per question), then **solved count**
- Only the **best submission per question** counts — re-submitting a correct answer doesn't inflate your score
- Updates in real time after each submission

---

## 6. Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@platform.com` | `admin123` |
| Student (test) | `alice@test.com` | `test123` |
| Student (test) | `bob@test.com` | `test123` |
| Student (test) | `carol@test.com` | `test123` |
| ... | `[name]@test.com` | `test123` |
| Your account | `aditya2992padi@gmail.com` | `12345` |

Full list of test users: alice, bob, carol, dave, eve, frank, grace, henry, ivy, jack, kate, leo, maya, noah, olivia — all `@test.com` with password `test123`.

---

## 7. Seeding Data for Demo

Run these from the `code-compiler-ui` directory after the backend is up.

### Full fresh seed (recommended)

```bash
make seed
```

This runs `seed-questions.js` then `fix-submissions.js` in sequence.

### Step by step

```bash
# 1. Create the 11 demo questions
node seed-questions.js

# 2. Register test users and create correct submissions
node fix-submissions.js

# 3. (Optional) Also add some wrong-answer noise
node seed-submissions.js
```

### What each script does

| Script | What it does |
|---|---|
| `seed-questions.js` | Logs in as admin, reads `seed-questions.json`, creates all questions via `POST /admin/questions`. Safe to re-run (skips duplicates). |
| `seed-submissions.js` | Registers 15 test users, submits random (mostly wrong) code to simulate realistic activity. Useful for populating the admin submissions view. |
| `fix-submissions.js` | Logs in as each test user and submits the **correct** solution for a random subset of questions. Leaderboard picks best score per user/question, so this overrides wrong answers and populates rankings. |

### Re-seeding after a database reset

If you `docker compose down -v` (removes the DB volume):

```bash
make backend-rebuild   # restarts with fresh DB
make seed              # recreate questions + submissions
```

---

## 8. Troubleshooting

### "Internal Server Error" on submit

The Piston code executor may be rate-limited or starting up. Wait 2–3 seconds and retry. If it persists:

```bash
make logs   # check fastapi container logs
```

### Submission always shows "Wrong Answer"

Verify the judge is comparing the right field:
- Expected output in test cases must be stored as `expected_output` (not `output`)
- The backend fix was applied in commit `ba7c6d9`
- Rebuild if needed: `make backend-rebuild`

### Questions not showing on Problems page

Questions must have `is_published: true`. Set this via the admin edit form or in `seed-questions.json` before seeding.

### Frontend not connecting to backend

Check that `VITE_API_BASE_URL` (or the default `http://localhost:8000`) matches where the backend is actually running:

```bash
curl http://localhost:8000/questions   # should return JSON array
```
