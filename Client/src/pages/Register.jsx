import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { useNavigate } from 'react-router-dom'

function validatePassword(pw) {
  if (!pw) return false
  if (pw.length < 6 || pw.length > 12) return false
  const hasLower = /[a-z]/.test(pw)
  const hasUpper = /[A-Z]/.test(pw)
  const hasSpecial = /[^A-Za-z0-9]/.test(pw)
  return hasLower && hasUpper && hasSpecial
}

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showRePassword, setShowRePassword] = useState(false)
  const [role, setRole] = useState('Inventory Managers')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email) return setError('Email is required')
    if (!validatePassword(password)) return setError('Password must be 6-12 chars and include lower, upper and special char')
    if (password !== rePassword) return setError('Passwords do not match')

    setLoading(true)
    try {
      const res = await axios.post('/register', { email, password, role })
      if (res.status !== 201) {
        setError(res.data?.message || 'Registration failed')
        setLoading(false)
        return
      }

      // server sets cookie; reload so App's auth-check redirects to dashboard
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
      <h2 className="text-2xl mb-4">Register</h2>
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

        <div>
          <label className="block text-sm mb-1">Re-enter Password</label>
          <div className="relative">
            <Input type={showRePassword ? 'text' : 'password'} value={rePassword} onChange={(e) => setRePassword(e.target.value)} required />
            <button
              type="button"
              aria-label={showRePassword ? 'Hide password' : 'Show password'}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
              onClick={() => setShowRePassword((s) => !s)}
            >
              {showRePassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Role</label>
          <Select onValueChange={(v) => setRole(v)} defaultValue={role}>
            <SelectTrigger>
              <SelectValue>{role}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inventory Managers">Inventory Managers</SelectItem>
              <SelectItem value="Warehouse Staff">Warehouse Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && <div className="text-destructive text-sm">{error}</div>}

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</Button>
        </div>
      </form>
    </div>
  )
}

export default Register
