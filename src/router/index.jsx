import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'
import ProtectedLayout from '../components/layout/ProtectedLayout'

// Import all page components
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import PlaygroundPage from '../pages/PlaygroundPage'
import QuestionsPage from '../pages/QuestionsPage'
import QuestionDetailPage from '../pages/QuestionDetailPage'
import LeaderboardPage from '../pages/LeaderboardPage'
import AdminQuestionsPage from '../pages/admin/AdminQuestionsPage'
import AdminQuestionNewPage from '../pages/admin/AdminQuestionNewPage'
import AdminQuestionEditPage from '../pages/admin/AdminQuestionEditPage'
import AdminSubmissionsPage from '../pages/admin/AdminSubmissionsPage'

function RootRedirect() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)

  if (!isAuthenticated) {
    return <Navigate to="/playground" replace />
  }

  if (user?.role === 'admin') {
    return <Navigate to="/admin/questions" replace />
  }

  return <Navigate to="/questions" replace />
}

function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect based on auth/role */}
      <Route path="/" element={<RootRedirect />} />

      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/playground"
        element={
          <ProtectedLayout>
            <PlaygroundPage />
          </ProtectedLayout>
        }
      />

      {/* Protected routes (student + admin) */}
      <Route
        path="/questions"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <QuestionsPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/questions/:id"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <QuestionDetailPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <LeaderboardPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin-only routes */}
      <Route
        path="/admin/questions"
        element={
          <AdminRoute>
            <ProtectedLayout>
              <AdminQuestionsPage />
            </ProtectedLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/questions/new"
        element={
          <AdminRoute>
            <ProtectedLayout>
              <AdminQuestionNewPage />
            </ProtectedLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/questions/:id/edit"
        element={
          <AdminRoute>
            <ProtectedLayout>
              <AdminQuestionEditPage />
            </ProtectedLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/submissions"
        element={
          <AdminRoute>
            <ProtectedLayout>
              <AdminSubmissionsPage />
            </ProtectedLayout>
          </AdminRoute>
        }
      />
    </Routes>
  )
}

export default AppRoutes
