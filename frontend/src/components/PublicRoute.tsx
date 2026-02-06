import { Navigate } from 'react-router-dom'

const PublicRoute = ({ children }: { children: React.ReactNode }  ) => {
  const token = sessionStorage.getItem('token')
  
  if (token) {
    return <Navigate to="/all-issues" replace />
  }

  return children
}

export default PublicRoute
