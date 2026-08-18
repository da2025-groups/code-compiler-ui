import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

function AdminRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/questions" replace />
  }

  return children
}

export default AdminRoute
