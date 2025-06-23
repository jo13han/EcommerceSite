const express = require('express');
const {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  getCategories
} = require('../controllers/productController');

const router = express.Router();

// Get all products with filtering and pagination
router.get('/', getAllProducts);

// Get all categories
router.get('/categories', getCategories);

// Search products
router.get('/search', searchProducts);

// Get products by category
router.get('/category/:category', getProductsByCategory);

// Get product by ID
router.get('/:id', getProductById);

module.exports = router;
