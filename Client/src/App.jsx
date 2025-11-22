import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'

// LAYOUT
import Layout from '@/components/Layout'
// AUTH PAGES
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import VerifyEmail from '@/pages/VerifyEmail'
import ForgotPassword from '@/pages/ForgotPassword'
import ResetPassword from '@/pages/ResetPassword'
import Profile from '@/pages/Profile'
// DASHBOARD + OLD PAGES
import Dashboard from '@/pages/Dashboard'
import ProductManager from '@/pages/Products'
// OPERATIONS PAGES
import Receipt from '@/pages/Receipt'
import ReceiptDetail from '@/pages/ReceiptDetail'
import Delivery from '@/pages/Delivery'
import Adjustment from '@/pages/Adjustment'
// SETTINGS PAGES
import Suppliers from '@/pages/Suppliers'
import Customers from '@/pages/Customers'
import UnitsOfMeasure from '@/pages/UnitsOfMeasure'

// AUTH ROUTING WRAPPER
const AnimatedRoutes = ({ token }) => {
  return (
    <Routes>
      {/* Redirect root based on auth */}
      <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />

      {/* Public pages */}
      <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/verify-email" element={token ? <Navigate to="/dashboard" replace /> : <VerifyEmail />} />
      <Route path="/forgot-password" element={token ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} />
      <Route path="/reset-password" element={token ? <Navigate to="/dashboard" replace /> : <ResetPassword />} />

      {/* Protected pages */}
      <Route path="/dashboard" element={token ? <Layout><Dashboard /></Layout> : <Navigate to="/login" replace />} />
      <Route path="/profile" element={token ? <Layout><Profile /></Layout> : <Navigate to="/login" replace />} />
      <Route path="/products" element={token ? <Layout><ProductManager /></Layout> : <Navigate to="/login" replace />} />
      <Route path="/stock" element={token ? <Layout><ProductManager /></Layout> : <Navigate to="/login" replace />} />
      
      {/* Operations pages */}
      <Route path="/operations/receipt" element={token ? <Layout><Receipt /></Layout> : <Navigate to="/login" replace />} />
      <Route path="/operations/receipt/:id" element={token ? <Layout><ReceiptDetail /></Layout> : <Navigate to="/login" replace />} />
      <Route path="/operations/delivery" element={token ? <Layout><Delivery /></Layout> : <Navigate to="/login" replace />} />
      <Route path="/operations/adjustment" element={token ? <Layout><Adjustment /></Layout> : <Navigate to="/login" replace />} />

      {/* Settings pages */}
      <Route path="/settings/suppliers" element={token ? <Layout><Suppliers /></Layout> : <Navigate to="/login" replace />} />
      <Route path="/settings/customers" element={token ? <Layout><Customers /></Layout> : <Navigate to="/login" replace />} />
      <Route path="/settings/units" element={token ? <Layout><UnitsOfMeasure /></Layout> : <Navigate to="/login" replace />} />

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
