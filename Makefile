# ============================================================
#  Code Compiler Platform — Developer Makefile
#
#  Prerequisites:
#    - Docker & Docker Compose  (for backend + Piston)
#    - Node.js >= 18            (for frontend + seed scripts)
#    - Backend repo cloned at   ../code-compiler-backend
#
#  Quick start (fresh machine):
#    make setup        # start everything
#    make seed         # populate questions & leaderboard
#
#  Manual submission guide is at the bottom of this file.
# ============================================================

BACKEND_DIR := ../code-compiler-backend
FRONTEND_DIR := .

.PHONY: help setup backend-up backend-down frontend-install frontend-dev \
        seed seed-questions seed-submissions fix-submissions \
        status logs clean

# ─── Default: print help ────────────────────────────────────
help:
	@echo ""
	@echo "  Code Compiler Platform — available targets"
	@echo ""
	@echo "  Infrastructure"
	@echo "    make backend-up        Start backend + Piston via Docker Compose"
	@echo "    make backend-down      Stop and remove backend containers"
	@echo "    make backend-rebuild   Rebuild and restart backend containers"
	@echo "    make frontend-install  Install frontend npm dependencies"
	@echo "    make frontend-dev      Start Vite dev server (http://localhost:5173)"
	@echo ""
	@echo "  Full setup (runs all of the above in order)"
	@echo "    make setup             Start backend + install deps + start frontend"
	@echo ""
	@echo "  Seeding"
	@echo "    make seed              Run questions seed then fix-submissions"
	@echo "    make seed-questions    Create the 11 demo questions via admin API"
	@echo "    make seed-submissions  Create test users + random (wrong) submissions"
	@echo "    make fix-submissions   Submit correct solutions for all test users"
	@echo ""
	@echo "  Utilities"
	@echo "    make status            Show running containers and frontend port"
	@echo "    make logs              Tail backend container logs"
	@echo "    make clean             Stop containers and remove node_modules"
	@echo ""

# ─── Infrastructure ─────────────────────────────────────────
backend-up:
	@echo "▶  Starting backend containers..."
	cd $(BACKEND_DIR) && docker compose up -d
	@echo "✅ Backend running at http://localhost:8000"

backend-down:
	@echo "▶  Stopping backend containers..."
	cd $(BACKEND_DIR) && docker compose down

backend-rebuild:
	@echo "▶  Rebuilding and restarting backend containers..."
	cd $(BACKEND_DIR) && docker compose down && docker compose up -d --build
	@echo "✅ Backend rebuilt and running at http://localhost:8000"

frontend-install:
	@echo "▶  Installing frontend dependencies..."
	cd $(FRONTEND_DIR) && npm install
	@echo "✅ Dependencies installed"

frontend-dev:
	@echo "▶  Starting Vite dev server..."
	cd $(FRONTEND_DIR) && npm run dev

# ─── Full setup ─────────────────────────────────────────────
setup: backend-up frontend-install
	@echo ""
	@echo "✅ Setup complete!"
	@echo ""
	@echo "   Backend API : http://localhost:8000"
	@echo "   Frontend    : run 'make frontend-dev' to start"
	@echo ""
	@echo "   Then run 'make seed' to populate questions and leaderboard."
	@echo ""

# ─── Seeding ────────────────────────────────────────────────
seed-questions:
	@echo "▶  Seeding questions..."
	@echo "   (requires admin@platform.com / admin123 to exist)"
	node seed-questions.js
	@echo "✅ Questions seeded"

seed-submissions:
	@echo "▶  Seeding test user submissions..."
	node seed-submissions.js

fix-submissions:
	@echo "▶  Submitting correct solutions for all test users..."
	node fix-submissions.js

# Run questions + correct submissions (skip the wrong-answer seed step)
seed: seed-questions fix-submissions
	@echo ""
	@echo "✅ Seeding complete!"
	@echo "   Leaderboard : http://localhost:5173/leaderboard"
	@echo "   Admin view  : http://localhost:5173/admin/submissions"
	@echo ""

# ─── Utilities ──────────────────────────────────────────────
status:
	@echo "--- Docker containers ---"
	cd $(BACKEND_DIR) && docker compose ps
	@echo ""
	@echo "--- Frontend (check for port 5173) ---"
	@lsof -i :5173 2>/dev/null | grep LISTEN || echo "  Not running (run 'make frontend-dev')"

logs:
	cd $(BACKEND_DIR) && docker compose logs -f fastapi

clean: backend-down
	@echo "▶  Removing node_modules..."
	rm -rf $(FRONTEND_DIR)/node_modules
	@echo "✅ Cleaned"

# ============================================================
#  Manual Submission Guide
# ============================================================
#
#  1. Open http://localhost:5173 in your browser.
#
#  2. Log in or register a new account.
#
#  3. Click "Problems" in the nav bar.
#
#  4. Click any problem title to open it.
#
#  5. Select language "Python" (default).
#
#  6. Paste a solution from SOLUTIONS.md into the code editor.
#
#  7. Click "Run Code" to test against the sample input only
#     (ephemeral — result shown inline, nothing saved to DB).
#
#  8. Click "Submit Solution" to judge against all hidden test
#     cases. Result is saved to your submission history.
#
#  9. Check the Leaderboard to see your ranking update.
#
#  Admin account:  admin@platform.com / admin123
#  Test users:     alice@test.com ... olivia@test.com  (password: test123)
#
#  Admin pages (only visible when logged in as admin):
#    /admin/questions        — list, create, edit questions
#    /admin/questions/new    — create a new question
#    /admin/submissions      — view all user submissions
# ============================================================
