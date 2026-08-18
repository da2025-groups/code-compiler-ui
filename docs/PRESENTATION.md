---
marp: true
theme: default
paginate: true
style: |
  section {
    font-family: 'Segoe UI', Arial, sans-serif;
    background: #0d1117;
    color: #e6edf3;
  }
  h1 { color: #58a6ff; font-size: 2rem; margin-bottom: 0.3em; }
  h2 { color: #58a6ff; font-size: 1.5rem; }
  h3 { color: #79c0ff; font-size: 1.1rem; }
  table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
  th { background: #161b22; color: #58a6ff; padding: 8px 12px; }
  td { padding: 6px 12px; border-bottom: 1px solid #30363d; }
  tr:hover td { background: #161b22; }
  code { background: #161b22; color: #79c0ff; padding: 2px 6px; border-radius: 4px; font-size: 0.85em; }
  pre { background: #161b22; padding: 16px; border-radius: 8px; font-size: 0.78em; }
  .green { color: #3fb950; }
  .red { color: #f85149; }
  .yellow { color: #d29922; }
  .blue { color: #58a6ff; }
  footer { color: #8b949e; font-size: 0.75em; }
  section.cover h1 { font-size: 2.6rem; text-align: center; }
  section.cover h2 { text-align: center; color: #8b949e; font-size: 1.1rem; font-weight: normal; }
  section.cover p { text-align: center; color: #8b949e; margin-top: 3em; }
---

<!-- _class: cover -->

# Code Compiler Platform

## HackerRank-style Competitive Coding Platform
### Browser-based Code Editor · Multi-language Execution · Live Leaderboard

Project #10 — Dr. Dhawaleswar Rao, SoET/CSE

---

# Problem Statement

> Manual code evaluation is **time-consuming**, **inconsistent**, and doesn't scale in academic settings.

- Instructors spend hours checking code submissions manually
- No standardised way to set hidden test cases
- Students have no immediate feedback on correctness
- No visibility into class-wide performance or rankings

### Our solution

An end-to-end automated platform where **admins post challenges** and **students solve them in the browser** — with instant judging, hidden test case evaluation, and a live leaderboard.

---

# What We Built

Two portals, one platform:

| Admin Portal | Student Portal |
|---|---|
| Create & edit coding questions | Browse published problems |
| Define hidden test cases (JSON) | Free playground editor |
| Publish / unpublish problems | Run against sample input |
| View all student submissions | Submit for full scoring |
| — | Track position on leaderboard |

---

# System Architecture

```
┌─────────────────────────────────────────┐
│         BROWSER  (React + Vite)         │
│  Admin Dashboard  │  Student Portal     │
└────────────┬────────────────────────────┘
             │  REST API + JWT
┌────────────▼────────────────────────────┐
│         FastAPI Backend  :8000          │
│  Auth · Questions · Submissions         │
│  Rankings · Admin endpoints             │
│             SQLite DB                   │
└────────────┬────────────────────────────┘
             │  HTTP (Docker network)
┌────────────▼────────────────────────────┐
│    Piston Code Execution Engine         │
│  Python · JavaScript · Java · C++       │
└─────────────────────────────────────────┘
```

---

# Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 18 + Vite | Fast HMR, component model |
| UI Library | Material UI (MUI) | Professional components, theming |
| Code Editor | Monaco Editor | Same engine as VS Code |
| State | Zustand | Lightweight, no boilerplate |
| Routing | React Router v6 | Protected + admin routes |
| Backend | FastAPI (Python) | Async, automatic API docs |
| Database | SQLite + SQLAlchemy | Zero-config, ORM |
| Auth | JWT HS256 | Stateless, role-based |
| Execution | Piston (Docker) | Sandboxed multi-language runner |

---

# Demo — Student View

## Problems Page `/questions`

- Lists all published problems
- Difficulty badge (Easy · Medium · Hard)
- Solved indicator per question

## Question Detail `/questions/:id`

- Problem statement, constraints, sample I/O
- Monaco Editor (syntax highlighting, auto-complete)
- Language selector (Python, JavaScript, Java, C++, ...)
- **Run Code** → tests against sample input only (instant feedback, not saved)
- **Submit Solution** → judged against hidden test cases → score saved

---

# Demo — Code Execution Flow

```
Student clicks Submit
        │
        ▼
POST /submissions/submit
        │
        ▼
Backend loads hidden test cases from DB
        │
        ▼
For each test case:
  → send { language, code, stdin } to Piston
  ← receive { stdout, stderr, execution_time_ms }
  → compare actual.strip() == expected_output.strip()
  → verdict: pass / fail
        │
        ▼
score = (passed / total) × 100
        │
        ▼
Submission saved to DB → response returned → UI renders verdict table
```

---

# Demo — Verdict & Scoring

| Status | Condition | Score |
|---|---|---|
| ✅ Accepted | All test cases pass | 100 |
| ⚠️ Partial | Some test cases pass | (passed / total) × 100 |
| ❌ Wrong Answer | Output mismatch | proportional |
| ⏱ Time Limit Exceeded | Exceeds timeout | 0 |
| 💥 Runtime Error | Crash / compile failure | 0 |

Output comparison uses **trimmed whitespace** — trailing newlines never cause false failures.

---

# Demo — Leaderboard `/leaderboard`

Live rankings updated after every submission.

**Scoring rules:**
- Only the **best submission per question** counts
- Rank by **total score** → then **solved count** as tiebreaker
- Per-question leaderboard also available (fastest accepted solution wins ties)

```
Rank  Name           Solved  Total Score
───────────────────────────────────────
 1    Alice Johnson    9       900
 2    Bob Smith        8       800
 3    Carol Williams   7       700
 ...
```

---

# Demo — Admin Portal

## Question Management `/admin/questions`

- Table of all questions (published + drafts)
- Create / edit questions with a rich form
- Toggle published status

## Create Question — Test Case Format

```json
[
  { "input": "[2,7,11,15] 9", "expected_output": "[0,1]" },
  { "input": "[3,2,4] 6",     "expected_output": "[1,2]" }
]
```

Test cases are **never returned to students** — only compared server-side.

## Submissions View `/admin/submissions`

All submissions across all students — user, question, language, verdict, score, date.

---

# Demo — Playground `/playground`

- Free-form editor — no problem constraints
- Custom stdin input
- Run in any supported language
- No scoring, nothing saved
- Great for quick experiments or live demos

**Supported languages:**

```
Python 3.12   JavaScript (Node 18)   Java 15
C++ (gcc 10)  Go 1.16               Rust 1.68
```

---

# Supported Questions (Demo Set)

11 problems across 3 difficulty levels:

| Easy | Medium |
|---|---|
| Two Sum | Maximum Subarray |
| Reverse String | Find Peak Element |
| Valid Palindrome | Product of Array Except Self |
| Binary Search | Rotate Array |
| Climbing Stairs | |
| Longest Common Prefix | |
| Merge Two Sorted Lists | |

All solutions available in `SOLUTIONS.md` for live demo use.

---

# Security Design

| Concern | Approach |
|---|---|
| Authentication | JWT HS256, 24h expiry |
| Passwords | bcrypt (never stored in plaintext) |
| Role enforcement | `require_admin()` dependency on all `/admin/*` routes — 403 for students |
| Test case secrecy | `GET /questions/:id` never returns `test_cases` field |
| Code execution | Piston sandbox — isolated subprocess per run |
| CORS | Restricted to `http://localhost:5173` (configurable) |

---

# Project Structure

```
code-compiler-ui/           code-compiler-backend/
├── src/                    ├── app/
│   ├── pages/              │   ├── routers/
│   ├── features/           │   ├── services/
│   ├── components/         │   ├── models/
│   ├── store/              │   └── schemas/
│   ├── router/             ├── tests/  (98 tests)
│   └── services/           ├── docker-compose.yml
├── seed-questions.js       └── Dockerfile
├── seed-submissions.js
├── fix-submissions.js
├── SOLUTIONS.md
└── Makefile
```

**One command to set up everything:**
```bash
make setup && make seed
```

---

# Getting Started

```bash
# 1. Clone both repos
git clone <backend-repo>  code-compiler-backend
git clone <frontend-repo> code-compiler-ui

# 2. Start backend (Docker required)
cd code-compiler-ui
make setup        # starts Docker containers + npm install

# 3. Seed demo data
make seed         # creates 11 questions + leaderboard entries

# 4. Start frontend
make frontend-dev # http://localhost:5173
```

**Login:** `admin@platform.com` / `admin123`

---

# Challenges & Solutions

| Challenge | How We Solved It |
|---|---|
| Multi-language sandbox on macOS ARM | Custom `isolate-nosec.py` wrapper replaces upstream sandbox for dev |
| Piston rate limiting under load | Added 1s delay + retry logic in seed scripts |
| Test case key mismatch (`output` vs `expected_output`) | Fixed `judge_service.py` to check both keys with fallback |
| React state not updating after Monaco setValue | Used API-direct submission in fix scripts instead of browser automation |
| Leaderboard showing all zeros | Root cause was the judge key bug — fixed and re-seeded |

---

# Key Design Decisions

**Why SQLite?**
- Zero infrastructure overhead for academic deployment
- Single file — trivial backup and reset
- Swappable to PostgreSQL via `DATABASE_URL` env var with no code changes

**Why Piston?**
- Self-hosted — no external API dependency or cost
- Supports 6+ languages out of the box
- Docker-isolated — each run is a fresh subprocess

**Why Zustand over Redux?**
- 1/10th the boilerplate
- Persists to localStorage in one line (`persist` middleware)
- Sufficient for two stores (auth + editor state)

---

# Summary

✅ **Admin** can create questions with hidden test cases and monitor all student activity

✅ **Students** can solve problems in a browser-based VS Code-quality editor with instant judging

✅ **Leaderboard** shows real-time standings based on best submission per problem

✅ **Playground** provides a free scratchpad for any language

✅ **6 languages** supported (Python, JavaScript, Java, C++, Go, Rust)

✅ **One-command setup** via Makefile

✅ **98 backend tests** ensure correctness

---

<!-- _class: cover -->

# Thank You

### Code Compiler Platform — Project #10

**Team:** dagroups02

**Repos:**
- Frontend: `code-compiler-ui`
- Backend: `code-compiler-backend`

**Live demo:** `http://localhost:5173`
**Admin login:** `admin@platform.com` / `admin123`
