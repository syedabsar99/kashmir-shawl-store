require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

async function checkCounts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    
    const collections = ['categories', 'products', 'users', 'orders', 'settings'];
    for (const col of collections) {
      const count = await db.collection(col).countDocuments();
      console.log(`${col}: ${count} documents`);
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

checkCounts();
