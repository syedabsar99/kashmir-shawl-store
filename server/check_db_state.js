require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

async function checkDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log('Current Database Name:', mongoose.connection.db.databaseName);
    
    const admin = mongoose.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log('Available Databases:');
    dbs.databases.forEach(db => console.log(` - ${db.name}`));

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in Current DB:', collections.map(c => c.name));

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

checkDB();
