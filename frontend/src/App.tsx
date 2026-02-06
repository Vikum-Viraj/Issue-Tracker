import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './pages/Hero'
import SignIn from './components/Auth/SignIn'
import SignUp from './components/Auth/SignUp'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import PublicRoute from './components/PublicRoute.tsx'
import AllIssues from './pages/AllIssues'
import MyIssues from './pages/MyIssues'

function App() {
  return (
    <Router>
      <Navbar/>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
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
          path="/my-issues" 
          element={
            <ProtectedRoute>
              <MyIssues />
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
