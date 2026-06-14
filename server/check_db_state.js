require('dotenv').config({ path: './.env' });
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');

async function checkDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const products = await mongoose.connection.db.collection('products').find().toArray();
    console.log('Products in DB:');
    products.forEach(p => console.log(` - _id: ${p._id}, name: ${p.name}`));

    const categories = await mongoose.connection.db.collection('categories').find().toArray();
    console.log('Categories in DB:');
    categories.forEach(c => console.log(` - _id: ${c._id}, name: ${c.name}`));

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

checkDB();
