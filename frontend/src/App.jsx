import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ChatProvider } from './context/ChatContext'
import { VideoProvider } from './context/VideoContext' // ← Add VideoProvider import
import ProtectedRoute from './components/common/ProtectedRoute'
import './App.css'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Therapists from './pages/Therapists.jsx'
import Dashboard from './pages/Dashboard.jsx'
import TherapistProfile from './pages/TherapistProfile.jsx'
import BookingConfirm from './pages/BookingConfirm.jsx'

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <VideoProvider> {/* ← ADD VideoProvider WRAPPER */}
          <Router>
            <div className="app">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/therapists" element={<Therapists />} />
                <Route path="/therapist/:id" element={<TherapistProfile />} />
                
                {/* Protected Routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/booking-confirm" 
                  element={
                    <ProtectedRoute>
                      <BookingConfirm />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </div>
          </Router>
        </VideoProvider> {/* ← CLOSE VideoProvider WRAPPER */}
      </ChatProvider>
    </AuthProvider>
  )
}

export default App
