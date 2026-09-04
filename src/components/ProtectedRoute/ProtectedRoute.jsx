import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { authenticated } = useAuth()

  if (!authenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
