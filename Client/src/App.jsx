import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'

// AUTH PAGES
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Profile from '@/pages/Profile'
// DASHBOARD + OLD PAGES
import Dashboard from '@/pages/Dashboard'
import ProductManager from '@/pages/Products'

// AUTH ROUTING WRAPPER
const AnimatedRoutes = ({ token }) => {
  return (
    <Routes>
      {/* Redirect root based on auth */}
      <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />

      {/* Public pages */}
      <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <Register />} />

      {/* Protected pages */}
      <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" replace />} />
      <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" replace />} />
      <Route path="/products" element={token ? <ProductManager /> : <Navigate to="/login" replace />} />

      {/* Wildcard */}
      <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
    </Routes>
  )
}

const App = () => {
  const [token, setToken] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const base_url =
      import.meta.env.VITE_API_BASE || import.meta.env.VITE_BACKEND_URL || '/api'

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

    // Recheck every hour
    const interval = setInterval(checkToken, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ minHeight: '100vh' }}>
      {!authChecked ? (
        <div className="flex h-screen items-center justify-center">
          Checking authentication...
        </div>
      ) : (
        <BrowserRouter>
          <AnimatedRoutes token={token} />
        </BrowserRouter>
      )}
    </div>
  )
}

export default App
