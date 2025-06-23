const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

// Product Schema matching your existing model
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

const Product = mongoose.model('Product', productSchema);

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Fetch all products from DummyJSON
    console.log('📥 Fetching all products from DummyJSON...');
    const response = await axios.get('https://dummyjson.com/products?limit=200');
    const products = response.data.products;

    // Filter out food-related products
    const foodRelatedCategories = ['groceries', 'food', 'fruits', 'vegetables', 'beverages', 'desserts', 'condiments'];
    const filteredProducts = products.filter(product => 
      !foodRelatedCategories.includes(product.category.toLowerCase())
    );

    // Transform products to match our schema
    const transformedProducts = filteredProducts.map(product => ({
      name: product.title,
      description: product.description,
      discountedPrice: product.price * (1 - product.discountPercentage / 100),
      image: product.thumbnail,
      discountPercentage: product.discountPercentage,
      originalPrice: product.price,
      reviews: product.reviews?.length || 0,
      categoryid: product.category.trim().toLowerCase()
    }));

    // Clear existing products
    console.log('🗑️ Clearing existing products...');
    await Product.deleteMany({});

    // Insert new products
    console.log('📝 Inserting products...');
    const insertedProducts = await Product.insertMany(transformedProducts);

    console.log(`✅ Successfully seeded ${insertedProducts.length} non-food products`);
    console.log(`❌ Filtered out ${products.length - insertedProducts.length} food-related products`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error seeding products:', error.message);
    process.exit(1);
  }
}

// Run the seed function
seedProducts(); 