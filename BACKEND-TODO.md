# Backend API Requirements for CC-20

## Missing Endpoint: GET /admin/questions/:id

**Status:** 🔴 Blocking admin edit functionality

**Issue:**
- Frontend edit form calls `GET /questions/:id` to fetch question details
- Backend returns question data but **excludes `test_cases`** field (by design for students)
- Admin edit form cannot pre-populate the test_cases JSON field
- Results in "Request failed with status code 404" for unpublished questions

**Required Implementation:**
```
GET /admin/questions/:id   [Admin only]

Response: {
  id: number
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  constraints: string | null
  sample_input: string
  sample_output: string
  test_cases: Array<{input: string, expected_output: string}>  // ← Must include this
  is_published: boolean
  created_at: string
  updated_at: string
}
```

**Why This is Needed:**
1. Admins need `test_cases` to edit questions
2. `GET /questions/:id` deliberately hides `test_cases` from students
3. Unpublished questions can't be fetched via `GET /questions/:id` (returns 404)
4. Admin-specific endpoint allows fetching ANY question (published or not) with full data

**Frontend Status:**
- ✅ API service ready (`getQuestionForEdit`)
- ✅ Form component ready
- ✅ Handles missing `test_cases` gracefully (shows empty field)
- ⏳ Waiting for backend endpoint

**Workaround Until Fixed:**
1. Only edit **published** questions (available via `GET /questions/:id`)
2. Manually re-enter test_cases when editing (not ideal)
3. Create questions as published from the start

**Testing:**
Once backend implements `GET /admin/questions/:id`:
1. Navigate to `/admin/questions`
2. Click edit on any question (published or unpublished)
3. Form should pre-populate with all fields including test_cases
4. Update and save should work via `PUT /admin/questions/:id`
