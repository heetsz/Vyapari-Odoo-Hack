import React, { useState } from 'react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const send = async () => {
    setError('')
    if (!email) return setError('Email is required')
    setLoading(true)
    try {
      await axios.post('/otp/send', { email, type: 'forgot' })
      // navigate to reset page without putting email in the URL
      navigate('/reset-password', { state: { email } })
    } catch (err) {
      setError(err?.response?.data?.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 rounded-lg shadow-md bg-card">
      <h2 className="text-2xl mb-4">Forgot Password</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        {error && <div className="text-destructive text-sm">{error}</div>}

        <div className="flex justify-end">
          <Button onClick={send} disabled={loading}>{loading ? 'Sending...' : 'Send reset code'}</Button>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
