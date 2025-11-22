import bcrypt from 'bcrypt'
import User from '../models/User.js'

function validatePassword(pw) {
  if (!pw) return false;
  if (pw.length < 6 || pw.length > 12) return false;
  const hasLower = /[a-z]/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  return hasLower && hasUpper && hasSpecial;
}

export const register = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'email, password and role are required' });
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
    const user = await User.create({ email, password: hashed, role });

    const cookieValue = JSON.stringify({ id: user._id, email: user.email, role: user.role });
    res.cookie('user', cookieValue, {
      httpOnly: true,
      signed: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    return res.status(201).json({ message: 'Registered', user: { id: user._id, email: user.email, role: user.role } });
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

    const cookieValue = JSON.stringify({ id: user._id, email: user.email, role: user.role });
    res.cookie('user', cookieValue, {
      httpOnly: true,
      signed: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    return res.status(200).json({ message: 'Logged in', user: { id: user._id, email: user.email, role: user.role } });
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
