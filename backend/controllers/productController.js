const Product = require('../models/productModel');
const Category = require('../models/categoryModel');

// Get all products with filtering and pagination
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 200;
    const category = req.query.category;
    const search = req.query.search;
    const minPrice = parseFloat(req.query.minPrice);
    const maxPrice = parseFloat(req.query.maxPrice);
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    // Build filter object
    const filter = {};
    if (category) filter.categoryid = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (minPrice || maxPrice) {
      filter.originalPrice = {};
      if (minPrice) filter.originalPrice.$gte = minPrice;
      if (maxPrice) filter.originalPrice.$lte = maxPrice;
    }

    // Get total count for pagination
    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // Get products with pagination and sorting
    const products = await Product.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: total,
        productsPerPage: limit
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products', details: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product', details: error.message });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 200;
    const category = req.params.category;

    const total = await Product.countDocuments({ categoryid: category });
    const totalPages = Math.ceil(total / limit);

    const products = await Product.find({ categoryid: category })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: total,
        productsPerPage: limit
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products by category', details: error.message });
  }
};

// Search products
exports.searchProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 200;
    const searchTerm = req.query.q;

    if (!searchTerm) {
      return res.status(400).json({ error: 'Search term is required' });
    }

    const filter = {
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ]
    };

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: total,
        productsPerPage: limit
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error searching products', details: error.message });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().select('name _id');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching categories', details: error.message });
  }
};

exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

exports.updateProduct = async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).end();
};
