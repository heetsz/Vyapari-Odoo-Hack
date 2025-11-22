import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

// Configure axios defaults from Vite env vars
const baseURL = import.meta.env.VITE_API_BASE || '/api'
axios.defaults.baseURL = baseURL
axios.defaults.withCredentials = true // send cookies with requests

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
