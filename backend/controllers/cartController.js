const User = require('../models/userModel');

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    console.log('Add to cart request:', {
      body: req.body,
      user: req.user,
      headers: req.headers
    });

    const { product } = req.body;
    const userId = req.user.userId;

    if (!product || !product.productId) {
      console.error('Invalid product data:', product);
      return res.status(400).json({ error: 'Invalid product data' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if product already exists in cart
    const existingCartItem = user.cart.find(item => item.productId === product.productId);

    if (existingCartItem) {
      // Update quantity if product already in cart
      existingCartItem.quantity += 1;
    } else {
      // Add new product to cart
      user.cart.push({ ...product, quantity: 1 });
    }

    await user.save();
    console.log('Product added to cart successfully');
    res.status(201).json(user.cart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Error adding to cart', details: error.message });
  }
};

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Error fetching cart' });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.cart = user.cart.filter(item => item.productId !== productId);
    await user.save();
    
    res.json({ message: 'Item removed from cart', cart: user.cart });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Error removing from cart' });
  }
};

// Update cart item quantity
exports.updateQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const cartItem = user.cart.find(item => item.productId === productId);
    if (!cartItem) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    cartItem.quantity = quantity;
    await user.save();

    res.json(user.cart);
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    res.status(500).json({ error: 'Error updating cart quantity' });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.cart = [];
    await user.save();
    
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Error clearing cart' });
  }
}; 