# Architecture — Code Compiler Platform

## System Overview

The platform consists of three services that run together via Docker Compose plus a Vite dev server:

```
┌──────────────────────────────────────────────────────────────────┐
│                         BROWSER                                  │
│                                                                  │
│   React + Vite + MUI + Monaco Editor                             │
│   http://localhost:5173                                          │
│                                                                  │
│   ┌──────────────────┐        ┌───────────────────────────────┐  │
│   │  Admin Dashboard  │        │       Student Portal          │  │
│   │  /admin/*         │        │  /playground /questions       │  │
│   │  Question CRUD    │        │  /leaderboard                 │  │
│   │  Submissions view │        │  Code editor + judge results  │  │
│   └──────────────────┘        └───────────────────────────────┘  │
└───────────────────────────┬──────────────────────────────────────┘
                            │  HTTP/JSON  +  JWT Bearer token
                            │  http://localhost:8000
┌───────────────────────────▼──────────────────────────────────────┐
│                     FastAPI Backend                              │
│                                                                  │
│  /auth          register, login → JWT                            │
│  /playground    run code (no auth, no save)                      │
│  /questions     list published questions                         │
│  /submissions   run sample, submit + judge, my history           │
│  /rankings      global leaderboard, per-question leaderboard     │
│  /admin/*       question CRUD, all submissions (admin role)      │
│                                                                  │
│  SQLite (app.db)                                                 │
│  tables: users / questions / submissions                         │
└───────────────────────────┬──────────────────────────────────────┘
                            │  HTTP  (internal Docker network)
                            │  http://piston:2000
┌───────────────────────────▼──────────────────────────────────────┐
│                    Piston Engine (Docker)                        │
│                                                                  │
│  Stateless code execution sandbox                                │
│  Accepts: language, code, stdin → returns: stdout, stderr, time  │
│  Supported: Python 3.12, Node.js 18, Java 15, gcc 10, Go, Rust  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### State Management

Two Zustand stores handle global state:

**`authStore.js`**
```
token (string | null)   ← stored in localStorage, rehydrated on load
user  { id, name, email, role }
login(token, user)      ← called after successful /auth/login
logout()                ← clears token + user, redirects to /login
```

**`editorStore.js`**
```
code     { [questionId]: string }   ← persists code per question
language { [questionId]: string }   ← persists language per question
setCode(qid, code)
setLanguage(qid, lang)
```

### Route Protection

```
Router
├── /login, /register          ← Public
├── ProtectedRoute              ← Requires valid JWT in authStore
│   ├── /playground
│   ├── /questions
│   ├── /questions/:id
│   ├── /leaderboard
│   └── AdminRoute              ← Requires role === 'admin'
│       ├── /admin/questions
│       ├── /admin/questions/new
│       ├── /admin/questions/:id/edit
│       └── /admin/submissions
```

### API Layer

`src/services/api.js` — Axios instance with:
- `baseURL`: `VITE_API_BASE_URL` (default `http://localhost:8000`)
- Request interceptor: reads `token` from `authStore` and attaches `Authorization: Bearer <token>`
- No response interceptor — errors surface to calling component

Each feature has its own thin API module:

| Module | Calls |
|---|---|
| `authService.js` | `POST /auth/login`, `POST /auth/register` |
| `questionsApi.js` | `GET /questions`, `GET /questions/:id` |
| `submissionsApi.js` | `POST /submissions/run`, `POST /submissions/submit` |
| `playgroundApi.js` | `POST /playground/run` |
| `leaderboardApi.js` | `GET /rankings` |
| `adminQuestionsApi.js` | `GET/POST/PUT /admin/questions/:id` |
| `adminSubmissionsApi.js` | `GET /admin/submissions` |

### Component Hierarchy

```
App
├── ThemeProvider (MUI dark theme)
└── RouterProvider
    ├── LoginPage / RegisterPage
    └── ProtectedLayout (Navbar + PageWrapper)
        ├── PlaygroundPage
        │   ├── LanguageSelector
        │   ├── CodeEditor (Monaco)
        │   └── OutputPanel
        ├── QuestionsPage
        │   └── DifficultyBadge (per row)
        ├── QuestionDetailPage
        │   ├── LanguageSelector
        │   ├── CodeEditor (Monaco)
        │   ├── OutputPanel (Run result)
        │   └── VerdictPanel (Submit result)
        │       └── TestCaseRow × n
        ├── LeaderboardPage
        ├── AdminQuestionsPage
        │   └── DifficultyBadge, EditIcon per row
        ├── AdminQuestionNewPage → QuestionForm (mode=create)
        ├── AdminQuestionEditPage → QuestionForm (mode=edit)
        │   QuestionForm shared component:
        │   - 8 fields including JSON test case textarea
        │   - validates test_cases as [{input, expected_output}]
        │   - POST or PUT depending on mode
        └── AdminSubmissionsPage
            └── VerdictBadge per row
```

---

## Backend Architecture

### Request Lifecycle (Submit)

```
POST /submissions/submit
        │
        ▼
dependencies.py: get_current_user()
  - decodes JWT → user_id
        │
        ▼
routers/submissions.py: submit_code()
  - validates request body
  - calls judge_service.judge_submission()
        │
        ▼
judge_service.judge_submission()
  - loads Question from DB
  - for each test_case in question.test_cases:
      - calls piston_service.run_code(language, code, stdin)
      - compares actual.strip() == expected_output.strip()
      - records pass/fail
  - calculates score = (passed / total) × 100
  - creates Submission record → DB
  - returns result dict
        │
        ▼
routers/submissions.py
  - returns SubmitResponse JSON
```

### Scoring Formula

```
score = (passed_cases / total_cases) × 100

status:
  passed_cases == total_cases  →  "accepted"
  otherwise                    →  "wrong_answer"
  piston returns error         →  "runtime_error"   (score 0)
  piston returns TLE           →  "time_limit_exceeded" (score 0)
```

### Leaderboard Calculation

```python
# ranking_service.py — computed in-memory on every /rankings request

best = {}  # (user_id, question_id) → best_score

for submission in all_submissions:
    key = (submission.user_id, submission.question_id)
    best[key] = max(best.get(key, 0), submission.score)

user_totals = {}
for (user_id, _), score in best.items():
    user_totals[user_id]["total_score"] += score
    if score == 100.0:
        user_totals[user_id]["solved_count"] += 1

# sorted by total_score DESC, solved_count DESC
```

Only the best submission per (user, question) pair counts. Multiple submissions for the same question don't stack.

---

## Data Model

```
users
  id            INTEGER PK
  name          TEXT
  email         TEXT UNIQUE
  password_hash TEXT          (bcrypt)
  role          TEXT          'admin' | 'student'
  created_at    DATETIME

questions
  id            INTEGER PK
  title         TEXT
  description   TEXT
  difficulty    TEXT          'easy' | 'medium' | 'hard'
  constraints   TEXT
  sample_input  TEXT          (visible to students)
  sample_output TEXT          (visible to students)
  test_cases    JSON          [{input, expected_output}, ...]  ← NEVER returned to students
  is_published  BOOLEAN
  created_by    INTEGER FK → users.id
  created_at    DATETIME
  updated_at    DATETIME

submissions
  id                INTEGER PK
  user_id           INTEGER FK → users.id
  question_id       INTEGER FK → questions.id
  language          TEXT
  code              TEXT
  status            TEXT    'accepted' | 'wrong_answer' | 'runtime_error' | 'time_limit_exceeded'
  passed_cases      INTEGER
  total_cases       INTEGER
  score             FLOAT   0–100
  execution_time_ms INTEGER
  submitted_at      DATETIME
```

---

## Security Notes

- **Test cases are never returned to students** — `GET /questions/:id` excludes the `test_cases` field; only `GET /admin/questions/:id` returns them
- **Role enforcement** — every `/admin/*` route calls `require_admin()` dependency which 403s non-admin JWTs
- **Password hashing** — bcrypt with default work factor; plaintext never stored
- **JWT expiry** — 24 hours; no refresh token (stateless)
- **Piston sandboxing** — code runs in an isolated subprocess; on macOS dev the sandbox uses `isolate-nosec.py` (no namespace isolation — dev only); production should use the upstream Piston image on Linux

---

## Environment Variables

### Backend (`.env`)

| Variable | Default | Description |
|---|---|---|
| `SECRET_KEY` | *(required)* | JWT signing secret |
| `ADMIN_EMAIL` | `admin@platform.com` | Seeded admin account email |
| `ADMIN_PASSWORD` | `admin123` | Seeded admin account password |
| `PISTON_URL` | `http://localhost:2000` | Piston API base URL |
| `DATABASE_URL` | `sqlite:///./app.db` | SQLAlchemy DB URL |

### Frontend

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Backend API base URL |
