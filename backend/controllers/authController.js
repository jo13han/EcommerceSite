const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { sendOTP, verifyOTP } = require('../lib/twilio');

// Email sender setup (configure for your real email provider)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'koshy.johan@gmail.com', // replace with your email
    pass: 'bixv slra qicz odsd',    // replace with your app password
  },
});

exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ 
        error: 'All fields are required',
        details: {
          name: !name ? 'Name is required' : null,
          email: !email ? 'Email is required' : null,
          phone: !phone ? 'Phone is required' : null,
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

    // Validate phone format (simple international, e.g. +919999999999)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        error: 'Invalid phone number format',
        details: 'Please provide a valid phone number with country code (e.g. +919999999999)'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res.status(409).json({ 
        error: 'Email or phone already registered',
        details: 'An account with this email or phone already exists. Please use a different email/phone or try logging in.'
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
      phone,
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpires
    });

    // Send OTP via email (optional, keep if you want email OTP)
    await transporter.sendMail({
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`
    });

    // Send OTP via Twilio SMS
    await sendOTP(phone);

    // Generate JWT token with 2 days expiration
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '2d' }
    );

    res.status(201).json({ 
      message: 'User created successfully. OTP sent to email and phone.',
      userId: user._id,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
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
    const { email, phone, phoneOtp, emailOtp } = req.body;
    if (!phoneOtp || !emailOtp || !email || !phone) {
      return res.status(400).json({ error: 'Both phone and email OTPs, as well as email and phone, are required.' });
    }
    // Find user by email and phone
    const user = await User.findOne({ email, phone });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    if (user.isVerified) {
      return res.status(400).json({ error: 'User already verified.' });
    }
    // Verify phone OTP with Twilio
    const twilioResult = await verifyOTP(phone, phoneOtp);
    if (twilioResult.status !== 'approved') {
      return res.status(400).json({ error: 'Invalid or expired phone OTP.' });
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
        phone: user.phone,
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
    const { email, phone } = req.body;
    if (!email && !phone) {
      return res.status(400).json({ error: 'Email or phone is required.' });
    }
    // Find user by email or phone
    const user = await User.findOne(email ? { email } : { phone });
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
      from: 'your-email@gmail.com',
      to: user.email,
      subject: 'Your OTP Code (Resent)',
      text: `Your new OTP code is: ${otp}`
    });
    // Send OTP via Twilio SMS
    await sendOTP(user.phone);
    res.json({ message: 'OTP resent to email and phone.' });
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
