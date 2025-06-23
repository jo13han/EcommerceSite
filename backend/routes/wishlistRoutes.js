const express = require('express');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All wishlist routes require authentication
router.use(protect);

// Get user's wishlist
router.get('/', getWishlist);

// Add product to wishlist
router.post('/', addToWishlist);

// Remove product from wishlist
router.delete('/remove/:productId', removeFromWishlist);

// Check if product is in wishlist
router.get('/check/:productId', checkWishlistStatus);

module.exports = router; 