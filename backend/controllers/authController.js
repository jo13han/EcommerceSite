const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Email sender setup (configure for your real email provider)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL, // replace with your email
    pass: process.env.NODEMAILER_PASS,    // replace with your app password
  },
});

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'All fields are required',
        details: {
          name: !name ? 'Name is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format',
        details: 'Please provide a valid email address'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ 
        error: 'Email already registered',
        details: 'An account with this email already exists. Please use a different email or try logging in.'
      });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpires
    });

    // Send OTP via email (optional, keep if you want email OTP)
    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`
    });

    // Generate JWT token with 2 days expiration
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '2d' }
    );

    res.status(201).json({ 
      message: 'User created successfully. OTP sent to email.',
      userId: user._id,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    if (err && err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: err.message });
    }
    if (err && err.code === 11000) {
      // Duplicate key error (unique index)
      return res.status(409).json({ error: 'Duplicate field', details: err.keyValue });
    }
    res.status(500).json({ error: err.message || 'Error creating user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    // Generate a unique sessionId
    const sessionId = require('crypto').randomBytes(16).toString('hex');
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Remove oldest session if already 2 sessions
    if (user.sessions && user.sessions.length >= 2) {
      // Sort by createdAt just in case
      user.sessions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      user.sessions.shift(); // Remove the oldest
    }
    // Add new session
    user.sessions.push({ sessionId, userAgent });
    await user.save();

    // Generate JWT token with sessionId
    const token = jwt.sign({ userId: user._id, sessionId }, process.env.JWT_SECRET, { expiresIn: '2d' });
    
    res.json({ 
      token,
      sessionId,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// OTP verification endpoint
exports.verifyOtp = async (req, res) => {
  try {
    const { email, emailOtp } = req.body;
    if (!emailOtp || !email) {
      return res.status(400).json({ error: 'Email and email OTP are required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    if (user.isVerified) {
      return res.status(400).json({ error: 'User already verified.' });
    }
    // Verify email OTP
    if (!user.otp || !user.otpExpires || user.otp !== emailOtp) {
      return res.status(400).json({ error: 'Invalid email OTP.' });
    }
    if (user.otpExpires < new Date()) {
      return res.status(400).json({ error: 'Email OTP has expired.' });
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate a unique sessionId
    const sessionId = require('crypto').randomBytes(16).toString('hex');
    const userAgent = req.headers['user-agent'] || 'unknown';
    // Remove oldest session if already 2 sessions
    if (user.sessions && user.sessions.length >= 2) {
      user.sessions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      user.sessions.shift();
    }
    user.sessions.push({ sessionId, userAgent });
    await user.save();

    // Generate JWT token with sessionId
    const token = jwt.sign({ userId: user._id, sessionId }, process.env.JWT_SECRET, { expiresIn: '2d' });

    res.json({
      message: 'User verified successfully.',
      token,
      sessionId,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ error: err.message || 'Error verifying OTP' });
  }
};

// Resend OTP endpoint
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    if (user.isVerified) {
      return res.status(400).json({ error: 'User already verified.' });
    }
    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
    // Send OTP via email (optional)
    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: user.email,
      subject: 'Your OTP Code (Resent)',
      text: `Your new OTP code is: ${otp}`
    });
    res.json({ message: 'OTP resent to email.' });
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ error: err.message || 'Error resending OTP' });
  }
};

exports.googleSignup = async (req, res) => {
  try {
    const { name, email, googleId, photoURL } = req.body;
    if (!email || !googleId) {
      return res.status(400).json({ error: 'Email and Google ID are required.' });
    }
    let user = await User.findOne({ email });
    if (!user) {
      // Create user without requiring phone number
      user = await User.create({
        name: name || email.split('@')[0], // Use part of email if name not provided
        email,
        password: googleId,
        isVerified: true, // Google users are pre-verified
        photoURL
      });
    }

    // Generate a unique sessionId
    const sessionId = require('crypto').randomBytes(16).toString('hex');
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Remove oldest session if already 2 sessions
    if (user.sessions && user.sessions.length >= 2) {
      user.sessions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      user.sessions.shift();
    }
    user.sessions.push({ sessionId, userAgent });
    await user.save();

    // Generate JWT token with sessionId
    const token = jwt.sign({ userId: user._id, sessionId }, process.env.JWT_SECRET, { expiresIn: '2d' });

    res.status(201).json({
      message: 'Google signup/login successful',
      token,
      sessionId,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    console.warn('Google signup error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: err.message 
      });
    }
    res.status(500).json({ error: 'Error with Google signup' });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { email, googleId } = req.body;
    if (!email || !googleId) {
      return res.status(400).json({ error: 'Email and Google ID are required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'No user found with this email.' });
    }
    // If user was created with Google, password will be googleId
    // If user was created with email/password, allow login if isVerified
    if (user.password !== googleId && !user.isVerified) {
      return res.status(401).json({ error: 'Google ID mismatch and user not verified.' });
    }
    // Optionally, update password to googleId if user is verified and logging in with Google for the first time
    if (user.password !== googleId && user.isVerified) {
      user.password = googleId;
      await user.save();
    }
    // Generate a unique sessionId
    const sessionId = require('crypto').randomBytes(16).toString('hex');
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Remove oldest session if already 2 sessions
    if (user.sessions && user.sessions.length >= 2) {
      user.sessions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      user.sessions.shift();
    }
    user.sessions.push({ sessionId, userAgent });
    await user.save();

    // Generate JWT token with sessionId
    const token = jwt.sign({ userId: user._id, sessionId }, process.env.JWT_SECRET, { expiresIn: '2d' });
    res.json({
      message: 'Google login successful',
      token,
      sessionId,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ error: err.message || 'Error with Google login' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // To prevent user enumeration, we send a generic success response
      return res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send email
    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: 'Password Reset Request',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
    });

    res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });

  } catch (err) {
    console.error('FORGOT PASSWORD ERROR:', err);
    // In case of server error, don't reveal user existence
    res.status(500).json({ error: 'An error occurred while attempting to send the reset email.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    // Get hashed token from URL
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Password reset token is invalid or has expired.' });
    }

    // Set new password
    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    // Optionally log the user in by sending a new token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '2d' });

    res.status(200).json({ token, message: 'Password has been reset successfully.' });

  } catch (err) {
    console.error('RESET PASSWORD ERROR:', err);
    res.status(500).json({ error: 'An error occurred while resetting the password.' });
  }
};
