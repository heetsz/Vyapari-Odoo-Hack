import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from '@/pages/dashboard'
import ProductManager from '@/pages/Products'
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/products' element={<ProductManager/>}/>
      </Routes>
    </Router>
  )
}

export default App
