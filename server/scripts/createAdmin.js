require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    const name = process.argv[2] || 'Tanzeel';
    const email = process.argv[3] || 'admin@kashurmart.com';
    const password = process.argv[4] || 'Syed2006334';

    if (!email || !password) {
      console.error('Usage: node createAdmin.js <name> <email> <password>');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await User.findOne({ email });
    if (existing) {
      console.log('⚠️  User already exists. Upgrading to Admin...');
      existing.isAdmin = true;
      await existing.save();
      console.log('✅ User updated to Admin');
    } else {
      const user = await User.create({
        name,
        email,
        password,
        isAdmin: true
      });
      console.log(`✅ Admin user created: ${user.email}`);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

createAdmin();
