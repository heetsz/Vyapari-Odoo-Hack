import sgMail from '@sendgrid/mail'
import Otp from '../models/Otp.js'
import User from '../models/User.js'
import bcrypt from 'bcrypt'

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
if (SENDGRID_API_KEY) sgMail.setApiKey(SENDGRID_API_KEY)

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString() // 6 digit
}

export const sendOtp = async (req, res, next) => {
  try {
    const { email, type } = req.body
    if (!type) return res.status(400).json({ message: 'type required' })
    if (!['verify', 'forgot'].includes(type)) return res.status(400).json({ message: 'invalid type' })

    // If a pending cookie exists (user just registered), send code using User record
    const pending = req.signedCookies && req.signedCookies.pending
    if (type === 'verify' && pending) {
      let pendingData
      try { pendingData = JSON.parse(pending) } catch (e) { pendingData = null }
      if (pendingData && pendingData.id) {
        const user = await User.findById(pendingData.id)
        if (!user) return res.status(400).json({ message: 'Invalid pending user' })

        const code = generateCode()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
        user.verificationCode = code
        user.verificationExpiresAt = expiresAt
        await user.save()

        // Send email via SendGrid if configured
        if (SENDGRID_API_KEY) {
          const msg = {
            to: user.email,
            from: process.env.SENDGRID_FROM || 'no-reply@example.com',
            subject: `Your verification code`,
            text: `Your verification code is ${code}. It expires in 10 minutes.`,
            html: `<p>Your verification code is <strong>${code}</strong>. It expires in 10 minutes.</p>`,
          }
          try { await sgMail.send(msg) } catch (e) { /* ignore */ }
        }

        return res.status(200).json({ message: 'OTP sent' })
      }
    }

    // fallback/legacy flow: require email in body
    if (!email) return res.status(400).json({ message: 'email required' })

    // optional: prevent sending forgot OTP to non-existing users
    if (type === 'forgot') {
      const user = await User.findOne({ email })
      if (!user) return res.status(404).json({ message: 'User not found' })
    }

    const code = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await Otp.create({ email, code, type, expiresAt })

    // Send email via SendGrid if configured
    if (SENDGRID_API_KEY) {
      const msg = {
        to: email,
        from: process.env.SENDGRID_FROM || 'no-reply@example.com',
        subject: `Your ${type === 'verify' ? 'verification' : 'password reset'} code`,
        text: `Your OTP code is ${code}. It expires in 10 minutes.`,
        html: `<p>Your OTP code is <strong>${code}</strong>. It expires in 10 minutes.</p>`,
      }
      await sgMail.send(msg)
    }

    return res.status(200).json({ message: 'OTP sent' })
  } catch (err) {
    next(err)
  }
}

export const verifyOtp = async (req, res, next) => {
  try {
    const { code, type } = req.body

    // If a signed pending cookie exists, prefer verifying against the User record
    const pending = req.signedCookies && req.signedCookies.pending
    if (pending) {
      let pendingData
      try { pendingData = JSON.parse(pending) } catch (e) { pendingData = null }
      if (pendingData && pendingData.id) {
        const user = await User.findById(pendingData.id)
        if (!user) return res.status(400).json({ message: 'Invalid pending user' })
        if (!code) return res.status(400).json({ message: 'code required' })
        if (!user.verificationCode || user.verificationCode !== code) return res.status(400).json({ message: 'Invalid code' })
        if (!user.verificationExpiresAt || user.verificationExpiresAt < new Date()) return res.status(400).json({ message: 'Code expired' })

        user.emailVerified = true
        user.verificationCode = undefined
        user.verificationExpiresAt = undefined
        await user.save()

        // clear pending cookie and set authenticated cookie (include name)
        const cookieValue = JSON.stringify({ id: user._id, email: user.email, role: user.role, name: user.name })
        res.clearCookie('pending')
        res.cookie('user', cookieValue, { httpOnly: true, signed: true, maxAge: 24 * 60 * 60 * 1000, sameSite: 'lax' })

        return res.status(200).json({ message: 'Verified' })
      }
    }

    // Fallback: verify using OTP collection (legacy / forgot flows)
    const { email } = req.body
    if (!email || !code || !type) return res.status(400).json({ message: 'email, code and type required' })

    const otp = await Otp.findOne({ email, code, type }).sort({ createdAt: -1 })
    if (!otp) return res.status(400).json({ message: 'Invalid code' })
    if (otp.expiresAt < new Date()) return res.status(400).json({ message: 'Code expired' })

    // mark as used: remove
    await Otp.deleteMany({ email, type })

    return res.status(200).json({ message: 'Verified' })
  } catch (err) {
    next(err)
  }
}

export const resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body
    if (!email || !code || !newPassword) return res.status(400).json({ message: 'email, code and newPassword required' })

    const otp = await Otp.findOne({ email, code, type: 'forgot' }).sort({ createdAt: -1 })
    if (!otp) return res.status(400).json({ message: 'Invalid code' })
    if (otp.expiresAt < new Date()) return res.status(400).json({ message: 'Code expired' })

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const hashed = await bcrypt.hash(newPassword, 10)
    user.password = hashed
    await user.save()

    await Otp.deleteMany({ email, type: 'forgot' })

    return res.status(200).json({ message: 'Password reset' })
  } catch (err) {
    next(err)
  }
}

export default { sendOtp, verifyOtp, resetPassword }
