const mongoose = require('mongoose');
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
require('dotenv').config();

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Get all unique categoryids from products
    const products = await Product.find({}, 'categoryid');
    const uniqueCategories = [...new Set(products.map(p => p.categoryid))];

    // Transform categories into the required format
    const categories = uniqueCategories.map(category => ({
      name: category,
      description: `${category} products`
    }));

    // Clear existing categories
    await Category.deleteMany({});

    // Insert new categories
    await Category.insertMany(categories);

    console.log('✅ Categories seeded successfully');
    console.log(`📊 Total categories: ${categories.length}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories(); 