require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to DB');
    const user = await User.findOne({ email: 'syedtanzeel64@gmail.com' });
    if (!user) {
      console.log('User not found!');
      process.exit(1);
    }
    user.isAdmin = true;
    user.password = 'admin1234';
    await user.save();
    console.log('Admin privileges successfully granted and password reset to: admin1234');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
