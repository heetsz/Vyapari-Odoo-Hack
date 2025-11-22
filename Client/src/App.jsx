<<<<<<< Updated upstream
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from '@/pages/dashboard'
import ProductManager from '@/pages/Products'
=======
import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'

import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Profile from '@/pages/Profile'
import Dashboard from '@/pages/Dashboard'

const AnimatedRoutes = ({ token }) => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />

      <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <Register />} />

      <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" replace />} />

      <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" replace />} />

      <Route path="*" element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
    </Routes>
  )
}

>>>>>>> Stashed changes
const App = () => {
  const [token, setToken] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const base_url = import.meta.env.VITE_API_BASE || import.meta.env.VITE_BACKEND_URL || '/api'

    const checkToken = async () => {
      try {
        const res = await axios.get(`${base_url}/me`, { withCredentials: true })
        setToken(res.status === 200)
      } catch (err) {
        setToken(false)
      } finally {
        setAuthChecked(true)
      }
    }

    checkToken()

    // Recheck token every hour
    const interval = setInterval(checkToken, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
<<<<<<< Updated upstream
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/products' element={<ProductManager/>}/>
      </Routes>
    </Router>
=======
    <div style={{ minHeight: '100vh' }}>
      {!authChecked ? (
        <div className="flex h-screen items-center justify-center">Checking authentication...</div>
      ) : (
        <BrowserRouter>
          <AnimatedRoutes token={token} />
        </BrowserRouter>
      )}
    </div>
>>>>>>> Stashed changes
  )
}

export default App
