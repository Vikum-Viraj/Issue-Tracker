import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = sessionStorage.getItem('token')
  
  if (!token) {
    return <Navigate to="/signin" replace />
  }

  return children
}

export default ProtectedRoute
