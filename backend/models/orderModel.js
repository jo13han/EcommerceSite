const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true },
  streetAddress: { type: String, required: true },
  town: { type: String, required: true },
  apartment: { type: String, required: true },
  products: [{ productId: String, quantity: Number, price: Number }],
  paymentMethod: { type: String, enum: ['cod', 'bank'], required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema); 