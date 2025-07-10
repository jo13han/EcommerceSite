const express = require('express');
const {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  getCategories
} = require('../controllers/productController');
const mongoose = require('mongoose');
const Product = require('../models/productModel');

const router = express.Router();

// Get all products with filtering and pagination
router.get('/', getAllProducts);

// Get all categories
router.get('/categories', getCategories);

// Search products
router.get('/search', searchProducts);

// Get products by category
router.get('/category/:category', getProductsByCategory);

// Bulk fetch products by IDs
router.get('/bulk', async (req, res) => {
  const ids = req.query.ids ? req.query.ids.split(',') : [];
  // Only keep valid ObjectIds
  const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
  if (!validIds.length) return res.json([]);
  try {
    const products = await Product.find({ _id: { $in: validIds } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get product by ID
router.get('/:id', getProductById);

module.exports = router;
