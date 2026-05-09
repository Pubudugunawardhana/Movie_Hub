const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
require('dotenv').config();

async function checkIds() {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ isAdmin: false });
  const category = await Category.findOne();
  console.log('User ID:', user ? user._id : 'None');
  console.log('Category ID:', category ? category._id : 'None');
  process.exit(0);
}
checkIds();
