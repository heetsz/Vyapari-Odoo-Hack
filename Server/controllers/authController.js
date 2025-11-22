import bcrypt from 'bcrypt'
import sgMail from '@sendgrid/mail'
import User from '../models/User.js'

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
if (SENDGRID_API_KEY) sgMail.setApiKey(SENDGRID_API_KEY)

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function validatePassword(pw) {
  // Acceptance disabled: accept any non-empty password for now
  if (!pw) return false;
  return true;
}

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'name, email, password and role are required' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'Password must be 6-12 chars and include lower, upper and special char' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);
    const user = await User.create({ name, email, password: hashed, role });

    // create verification code on user and set pending cookie (10 minutes)
    const code = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
    user.verificationCode = code
    user.verificationExpiresAt = expiresAt
    await user.save()

    // send email if configured
    if (SENDGRID_API_KEY) {
      const msg = {
        to: user.email,
        from: process.env.SENDGRID_FROM || 'no-reply@example.com',
        subject: `Your verification code`,
        text: `Your verification code is ${code}. It expires in 10 minutes.`,
        html: `<p>Your verification code is <strong>${code}</strong>. It expires in 10 minutes.</p>`,
      }
      try { await sgMail.send(msg) } catch (e) { /* ignore send errors here */ }
    }

    // set pending cookie so verify endpoint can identify user without passing email
    const pendingValue = JSON.stringify({ id: user._id })
    res.cookie('pending', pendingValue, { httpOnly: true, signed: true, maxAge: 10 * 60 * 1000, sameSite: 'lax' })

    return res.status(201).json({ message: 'Registered. Verify your email.' })
  } catch (err) {
    next(err);
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const cookieValue = JSON.stringify({ id: user._id, email: user.email, role: user.role, name: user.name });
    res.cookie('user', cookieValue, {
      httpOnly: true,
      signed: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    return res.status(200).json({ message: 'Logged in', user: { id: user._id, email: user.email, role: user.role, name: user.name } });
  } catch (err) {
    next(err);
  }
}

export const me = async (req, res, next) => {
  try {
    // `requireAuth` middleware attaches req.user
    return res.status(200).json({ user: req.user });
  } catch (err) {
    next(err);
  }
}

export const logout = async (req, res, next) => {
  try {
    // clear the signed cookie
    res.clearCookie('user', { httpOnly: true, sameSite: 'lax' });
    return res.status(200).json({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
}

export default { register, login, me, logout }
