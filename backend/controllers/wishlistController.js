const User = require('../models/userModel');
const Product = require('../models/productModel');

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('wishlist');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching wishlist', details: error.message });
  }
};

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { product } = req.body;
    
    if (!product) {
      return res.status(400).json({ error: 'Product information is required' });
    }

    // If productId is missing, generate a unique ID
    if (!product.productId) {
      product.productId = Date.now().toString();
    }

    // Add to user's wishlist if not already present
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if product already exists in wishlist
    const existingProduct = user.wishlist.find(item => item.productId === product.productId);
    if (existingProduct) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }

    // Add new product to wishlist
    user.wishlist.push(product);
    await user.save();
    
    res.json({ message: 'Product added to wishlist', product });
  } catch (error) {
    console.error('Error in addToWishlist:', error);
    res.status(500).json({ error: 'Error adding to wishlist', details: error.message });
  }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.wishlist = user.wishlist.filter(item => item.productId !== productId);
    await user.save();
    
    res.json({ message: 'Product removed from wishlist' });
  } catch (error) {
    res.status(500).json({ error: 'Error removing from wishlist', details: error.message });
  }
};

// Check if product is in wishlist
exports.checkWishlistStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isWishlisted = user.wishlist.some(item => item.productId === productId);
    res.json({ isWishlisted });
  } catch (error) {
    res.status(500).json({ error: 'Error checking wishlist status', details: error.message });
  }
};