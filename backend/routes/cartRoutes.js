const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected and require authentication
router.use(protect);

// Add item to cart
router.post('/', cartController.addToCart);

// Get user's cart
router.get('/', cartController.getCart);

// Remove item from cart
router.delete('/remove/:productId', cartController.removeFromCart);

// Update cart item quantity
router.put('/update/:productId', cartController.updateQuantity);

// Clear cart
router.delete('/clear', cartController.clearCart);

module.exports = router; 