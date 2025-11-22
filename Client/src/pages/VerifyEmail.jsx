import React, { useState } from 'react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const VerifyEmail = () => {
  const [code, setCode] = useState('')
  const [step, setStep] = useState(1) // 1=verify (default), 0=send/resend
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const send = async () => {
    setError('')
    setLoading(true)
    try {
      // server will use pending cookie to identify user
      await axios.post('/otp/send', { type: 'verify' }, { withCredentials: true })
      setStep(1)
    } catch (err) {
      setError(err?.response?.data?.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  const verify = async () => {
    setError('')
    if (!code) return setError('Code required')
    setLoading(true)
    try {
      await axios.post('/otp/verify', { code, type: 'verify' }, { withCredentials: true })
      // verified — navigate to dashboard
      window.location.reload()
    } catch (err) {
      setError(err?.response?.data?.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 rounded-lg shadow-md bg-card">
      <h2 className="text-2xl mb-4">Verify Email</h2>

      {step === 0 ? (
        <div className="space-y-4">
          <div className="text-sm">Click to send a verification code to your email (no email address is shared in the URL).</div>
          {error && <div className="text-destructive text-sm">{error}</div>}
          <div className="flex justify-end">
            <Button onClick={send} disabled={loading}>{loading ? 'Sending...' : 'Send code'}</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Code</label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          <div className="text-sm text-muted-foreground">Check your inbox for the 6-digit code. If you don't see it, check your spam folder — sometimes the email lands there.</div>
          <div className="text-sm">
            <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Open Gmail</a>
          </div>
          {error && <div className="text-destructive text-sm">{error}</div>}
          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(0)}>Resend</Button>
            <Button onClick={verify} disabled={loading}>{loading ? 'Verifying...' : 'Verify'}</Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default VerifyEmail
