const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  discountedPrice: Number,
  image: String,
  discountPercentage: Number,
  originalPrice: Number,
  reviews: Number,
  categoryid: String,
});

module.exports = mongoose.model('Product', productSchema);
