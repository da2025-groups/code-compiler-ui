---
marp: true
theme: default
paginate: true
style: |
  section {
    font-family: 'Segoe UI', Arial, sans-serif;
    background: #ffffff;
    color: #111827;
  }
  h1 { color: #4f46e5; font-size: 2.4rem; margin-bottom: 0.4em; }
  h2 { color: #4f46e5; font-size: 1.8rem; margin-bottom: 0.3em; }
  h3 { color: #3730a3; font-size: 1.2rem; margin-bottom: 0.3em; }
  p { font-size: 1.1rem; line-height: 1.6; }
  ul { font-size: 1rem; line-height: 1.8; }
  li { margin-bottom: 0.5em; }
  table { width: 100%; border-collapse: collapse; font-size: 0.9rem; margin-top: 1em; }
  th { background: #4f46e5; color: #ffffff; padding: 10px 14px; text-align: left; }
  td { padding: 8px 14px; border-bottom: 1px solid #e5e7eb; color: #111827; }
  tr:nth-child(even) td { background: #f5f3ff; }
  code { background: #ede9fe; color: #3730a3; padding: 3px 8px; border-radius: 4px; font-size: 0.9em; }
  pre { background: #1e1b4b; color: #e0e7ff; padding: 20px; border-radius: 8px; font-size: 0.85em; line-height: 1.5; }
  pre code { background: transparent; color: #e0e7ff; padding: 0; }
  strong { color: #4f46e5; }
  section.cover { background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); color: #ffffff; }
  section.cover h1 { font-size: 3rem; text-align: center; color: #ffffff; margin-bottom: 0.3em; }
  section.cover h2 { text-align: center; color: #c7d2fe; font-size: 1.3rem; font-weight: normal; margin-bottom: 2em; }
  section.cover p { text-align: center; color: #c7d2fe; font-size: 1rem; margin-top: 3em; }
  section.cover ul { list-style: none; padding: 0; text-align: center; }
  section.cover li { font-size: 1.2rem; color: #ffffff; margin: 0.8em 0; }
---

<!-- _class: cover -->

# Code Compiler Platform

## HackerRank-style Competitive Coding System

**Automated Code Evaluation · Multi-language Support · Live Leaderboard**

---

**Problem:** Manual code evaluation is time-consuming and inconsistent

**Solution:**
- ✅ Browser-based code editor with instant execution
- ✅ Hidden test case judging with automatic scoring
- ✅ Real-time leaderboard with best-score ranking
- ✅ Admin dashboard for question management
- ✅ Support for Python, JavaScript, Java, C++, Go, Rust

---

**Team:** Bala Vardhan Palli and Team  
**Project #10** — Dr. Dhawaleswar Rao, SoET/CSE

---

# System Architecture & Key Features

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND — React + Vite + Monaco Editor + Material UI     │
│  Student: Playground · Problems · Submit · Leaderboard     │
│  Admin:   Question CRUD · Test Cases · Submissions View    │
└────────────────┬────────────────────────────────────────────┘
                 │  REST API + JWT Authentication
┌────────────────▼────────────────────────────────────────────┐
│  BACKEND — FastAPI + SQLite + SQLAlchemy                    │
│  Routes: /auth /questions /submissions /rankings /admin     │
│  Scoring: (passed_cases / total_cases) × 100                │
└────────────────┬────────────────────────────────────────────┘
                 │  HTTP (Docker internal network)
┌────────────────▼────────────────────────────────────────────┐
│  PISTON ENGINE — Multi-language Code Execution Sandbox      │
│  Accepts: { language, code, stdin } → { stdout, time }      │
└─────────────────────────────────────────────────────────────┘
```

### Two Execution Modes

| Mode | Use Case | Test Cases | Score Impact |
|---|---|---|---|
| **Run Code** | Test against sample input | Sample only | None (not saved) |
| **Submit Solution** | Full judge against hidden tests | All test cases | Saved to DB, affects leaderboard |

---

# Tech Stack & Live Demo

### Technologies

| Layer | Stack |
|---|---|
| **Frontend** | React 18 · Vite · Material UI · Monaco Editor · Zustand · React Router v6 |
| **Backend** | FastAPI (Python 3.11) · SQLite · SQLAlchemy 2.x · JWT (python-jose) · bcrypt |
| **Execution** | Piston (Docker) — Python 3.12, Node 18, Java 15, gcc 10, Go, Rust |
| **Deployment** | Docker Compose · Single-command setup via Makefile |

### Quick Start

```bash
git clone <repo>
cd code-compiler-ui
make setup        # Start backend + install deps
make seed         # Create 11 questions + populate leaderboard
make frontend-dev # Launch at http://localhost:5173
```

**Demo Credentials:** `admin@platform.com` / `admin123`

### Key Features Demonstrated

✅ **Playground** — Free editor with custom stdin  
✅ **Questions** — 11 problems (Easy/Medium) with sample I/O  
✅ **Live Judge** — Instant verdict table per test case  
✅ **Leaderboard** — Ranked by total score, then solved count  
✅ **Admin Panel** — Create/edit questions with JSON test cases

---

**Repository:** `github.com/da2025-groups/code-compiler-ui`  
**Thank you!** 🎉
