import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import axios from 'axios'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    const fetchMe = async () => {
      try {
        const res = await axios.get('/me')
        if (res.status === 401) return navigate('/login')
        if (mounted) setUser(res.data.user)
      } catch (err) {
        navigate('/login')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchMe()
    return () => (mounted = false)
  }, [navigate])

  if (loading) return <div className="p-6">Loading...</div>
  if (!user) return null

  return (
    <div className="max-w-md mx-auto mt-12 p-6 rounded-lg shadow-md bg-card">
      <h2 className="text-2xl mb-4">Profile</h2>
      <div className="space-y-2">
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Role:</strong> {user.role}</div>
        <div><strong>ID:</strong> {user._id}</div>
      </div>

      <div className="mt-4 flex gap-2 justify-end">
        <Button variant="outline" onClick={() => navigate('/dashboard')}>Dashboard</Button>
        <Button
          onClick={async () => {
            try {
              await axios.post('/logout')
            } catch (err) {
              // ignore errors; still navigate to login
            } finally {
              navigate('/login')
            }
          }}
        >Logout</Button>
      </div>
    </div>
  )
}

export default Profile
