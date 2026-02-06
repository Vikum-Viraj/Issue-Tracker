import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './pages/Hero'
import ManageIssue from './pages/ManageIssue'
import SignIn from './components/Auth/SignIn'
import SignUp from './components/Auth/SignUp'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route 
            path="/manage-issues" 
            element={
              <ProtectedRoute>
                <ManageIssue />
              </ProtectedRoute>
            } 
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
