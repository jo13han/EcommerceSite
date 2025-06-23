const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  description: String
});

// Pre-save middleware to ensure consistent formatting
categorySchema.pre('save', function(next) {
  if (this.name) {
    this.name = this.name.trim().toLowerCase();
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema); 