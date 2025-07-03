const express = require('express');
const { signup, login, verifyOtp, resendOtp, googleSignup, googleLogin, forgotPassword, resetPassword, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/userModel');

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/google-signup', googleSignup);
router.post('/google-login', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.get('/profile', protect, getProfile);
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

module.exports = router;
