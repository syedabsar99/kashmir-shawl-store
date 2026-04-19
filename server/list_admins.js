require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const users = await User.find({ isAdmin: true });
    console.log('✅ Admin Users found:', users.map(u => u.email));
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}
test();
