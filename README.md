# Code Compiler Platform — Frontend

A HackerRank-style competitive coding platform built as an academic project. Students can browse problems, write and submit solutions in a Monaco-powered editor, and track their ranking on a global leaderboard. Admins can manage questions, test cases, and review all submissions. The backend is a FastAPI service in the sibling directory `../code-compiler-backend`.

---

## Screenshots

| View | Description |
|------|-------------|
| `/login` | Login form with email/password |
| `/questions` | Problem list with difficulty badges and solved indicators |
| `/questions/:id` | Split-pane: problem statement left, Monaco editor right, Run / Submit controls |
| `/playground` | Free-form editor with custom stdin input and output panel |
| `/leaderboard` | Ranked table showing solved count and total score per student |
| `/admin/questions` | Admin table of all questions including unpublished drafts |
| `/admin/submissions` | Admin view of every submission across all users |

> Add screenshots to a `docs/screenshots/` directory and update the paths above.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build tool | Vite |
| UI components | Material UI (MUI) v5 |
| Code editor | Monaco Editor |
| State management | Zustand |
| Routing | React Router v6 |
| HTTP client | Axios |
| Backend API | FastAPI (Python) on port 8000 |

---

## Prerequisites

- **Node.js** 18+ and **npm** 9+
- **Docker** and **Docker Compose** (for the backend)
- The backend repo cloned at `../code-compiler-backend` relative to this directory

---

## Quick Start

```bash
# 1. Clone both repos side by side
git clone <backend-repo-url> code-compiler-backend
git clone <this-repo-url> code-compiler-ui

# 2. Start the Docker backend and install frontend dependencies
cd code-compiler-ui
make setup

# 3. Seed demo questions and leaderboard data
make seed

# 4. Start the Vite dev server
make frontend-dev
```

The app will be available at `http://localhost:5173`.

### Makefile targets

| Target | What it does |
|--------|-------------|
| `make setup` | Starts the Docker backend (`docker compose up -d`) and runs `npm install` |
| `make seed` | Seeds 11 demo questions and submits correct solutions for 15 test users |
| `make frontend-dev` | Starts the Vite dev server on port 5173 |
| `make backend-rebuild` | Tears down and rebuilds the Docker backend (`docker compose down && up --build`) |

---

## Routes

| Path | Access | Description |
|------|--------|-------------|
| `/login` | Public | Email/password login |
| `/register` | Public | New account registration |
| `/playground` | Authenticated | Free editor with custom stdin |
| `/questions` | Authenticated | Browse all published problems |
| `/questions/:id` | Authenticated | Problem detail with Run and Submit |
| `/leaderboard` | Authenticated | Global rankings |
| `/admin/questions` | Admin only | List all questions including drafts |
| `/admin/questions/new` | Admin only | Create a question with JSON test cases |
| `/admin/questions/:id/edit` | Admin only | Edit question and test cases |
| `/admin/submissions` | Admin only | All submissions across all students |

Route protection is handled by `ProtectedRoute` (redirects to `/login`) and `AdminRoute` (redirects to `/questions`).

---

## Seed Scripts

Run these from the repo root with `make seed`, or individually with `node <script>`. The backend must be running before seeding.

| Script | What it does | When to run |
|--------|-------------|-------------|
| `seed-questions.js` | Creates 11 demo problems (Easy through Hard) via the admin API | Once after `make setup` |
| `seed-submissions.js` | Registers 15 test student accounts and creates random (mostly incorrect) submissions | After `seed-questions.js` |
| `fix-submissions.js` | Re-submits working solutions for all 15 test users to populate the leaderboard with real scores | After `seed-submissions.js` |

Working Python solutions for all 11 questions are documented in `SOLUTIONS.md`.

> To reset and re-seed, rebuild the backend (`make backend-rebuild`) then run `make seed` again.

---

## Environment Variables

Create a `.env.local` file in the repo root to override defaults:

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Base URL for all API requests |

No other environment variables are required for local development.

---

## Project Structure

```
code-compiler-ui/
├── Makefile
├── seed-questions.js
├── seed-submissions.js
├── fix-submissions.js
├── SOLUTIONS.md
├── index.html
├── vite.config.js
└── src/
    ├── App.jsx                        # ThemeProvider + RouterProvider root
    ├── main.jsx                       # Entry point
    ├── store/
    │   ├── authStore.js               # Zustand: token, user, role, login/logout
    │   └── editorStore.js             # Zustand: code and language per question
    ├── router/
    │   ├── index.jsx                  # Full route tree
    │   ├── ProtectedRoute.jsx         # Requires authentication
    │   └── AdminRoute.jsx             # Requires admin role
    ├── services/
    │   └── api.js                     # Axios instance with auto Bearer token injection
    ├── features/
    │   ├── auth/services/
    │   │   └── authService.js
    │   ├── questions/services/
    │   │   ├── questionsApi.js
    │   │   └── submissionsApi.js
    │   ├── playground/services/
    │   │   └── playgroundApi.js
    │   ├── leaderboard/services/
    │   │   └── leaderboardApi.js
    │   └── admin/
    │       ├── questions/services/adminQuestionsApi.js
    │       └── submissions/services/adminSubmissionsApi.js
    ├── components/common/
    │   ├── CodeEditor.jsx             # Monaco editor wrapper
    │   ├── DifficultyBadge.jsx        # Easy=green / Medium=orange / Hard=red chip
    │   ├── VerdictBadge.jsx           # Accepted=green / Wrong Answer=red chip
    │   ├── OutputPanel.jsx            # Displays stdout, stderr, and execution time
    │   ├── VerdictPanel.jsx           # Submit result with per-test-case table
    │   └── LanguageSelector.jsx
    └── pages/                         # One file per route
```

---

## Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@platform.com` | `admin123` |
| Student (x15) | `alice@test.com` … `olivia@test.com` | `test123` |

Test student accounts are created by `seed-submissions.js`. The admin account is seeded by the backend on first startup.
