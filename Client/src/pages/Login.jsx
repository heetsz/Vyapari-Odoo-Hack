import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) return setError('Email and password required')

    setLoading(true)
    try {
      const res = await axios.post('/login', { email, password })
      if (res.status !== 200) {
        setError(res.data?.message || 'Login failed')
        setLoading(false)
        return
      }

      // cookie is set by server; reload page so App's auth check handles redirect
      window.location.reload()
    } catch (err) {
      const msg = err?.response?.data?.message || 'Network error'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 rounded-lg shadow-md bg-card">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <div className="relative">
            <Input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {error && <div className="text-destructive text-sm">{error}</div>}
        
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
        </div>
      </form>
    </div>
  )
}

export default Login
