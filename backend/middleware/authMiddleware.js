const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return res.status(401).json({ error: 'Not authorized, user not found' });
      }

      // If sessionId is present, check it; otherwise, allow (for Google users)
      if (decoded.sessionId) {
        if (!user.sessions.some(s => s.sessionId === decoded.sessionId)) {
          return res.status(401).json({ error: 'Session expired or not authorized on this device' });
        }
      }

      // Add user to request object
      req.user = {
        userId: user._id,
        email: user.email
      };
      
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Server error in auth middleware' });
  }
}; 