const express = require('express');
const { signup, login, verifyOtp, resendOtp, googleSignup, googleLogin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/userModel');
const { sendOTP } = require('../lib/twilio');

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/google-signup', googleSignup);
router.post('/google-login', googleLogin);

// Send OTP for phone login (not signup)
router.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone is required' });
  try {
    await sendOTP(phone);
    res.json({ message: 'OTP sent to phone.' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to send OTP' });
  }
});

// Protected routes
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

module.exports = router;
