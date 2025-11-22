import React, { useState } from 'react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useNavigate, useLocation } from 'react-router-dom'

const ResetPassword = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState(location.state?.email || '')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    setError('')
    if (!email) return setError('Email is required')
    if (!code) return setError('Code is required')
    if (!newPassword) return setError('Password is required')
    if (newPassword !== confirm) return setError('Passwords do not match')

    setLoading(true)
    try {
      await axios.post('/otp/reset', { email, code, newPassword })
      navigate('/login')
    } catch (err) {
      setError(err?.response?.data?.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 rounded-lg shadow-md bg-card">
      <h2 className="text-2xl mb-4">Reset Password</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm mb-1">Code</label>
          <Input value={code} onChange={(e) => setCode(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm mb-1">New Password</label>
          <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm mb-1">Confirm Password</label>
          <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>

        {error && <div className="text-destructive text-sm">{error}</div>}

        <div className="flex justify-end">
          <Button onClick={submit} disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</Button>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
