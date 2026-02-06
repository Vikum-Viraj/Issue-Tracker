import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './pages/Hero'
import SignIn from './components/Auth/SignIn'
import SignUp from './components/Auth/SignUp'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import AllIssues from './pages/AllIssues'

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route 
          path="/all-issues" 
          element={
            <ProtectedRoute>
              <AllIssues />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/signin" 
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App
