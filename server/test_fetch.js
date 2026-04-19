require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function testFetch() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected');
    const products = await Product.find({}).limit(1);
    console.log('Products found:', products.length);
    if (products.length > 0) {
      console.log('First product:', products[0].name, '| isActive:', products[0].isActive, '| featured:', products[0].featured);
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

testFetch();
