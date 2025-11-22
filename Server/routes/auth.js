import express from 'express';
import { register, login, me, logout } from '../controllers/authController.js';
import { sendOtp, verifyOtp, resetPassword } from '../controllers/otpController.js';
import { requireAuth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

// OTP endpoints
router.post('/otp/send', sendOtp);
router.post('/otp/verify', verifyOtp);
router.post('/otp/reset', resetPassword);

export default router;
