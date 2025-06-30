const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  wishlist: [{
    productId: { type: String, required: true },
    image: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    rating: { type: Number },
    reviewCount: { type: Number },
    discountPercentage: { type: Number }
  }],
  cart: [{
    productId: { type: String, required: true },
    image: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    rating: { type: Number },
    reviewCount: { type: Number },
    discountPercentage: { type: Number },
    quantity: { type: Number, default: 1 }
  }],
  sessions: [{
    sessionId: { type: String, required: true },
    userAgent: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  photoURL: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
