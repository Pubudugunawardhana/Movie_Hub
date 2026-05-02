const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Check if admin already exists
    const existing = await User.findOne({ email: 'admin@moviehub.com' });
    if (existing) {
      console.log('Admin user already exists!');
      console.log('Email: admin@moviehub.com');
      console.log('Password: admin123');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      name: 'Admin',
      email: 'admin@moviehub.com',
      password: hashedPassword,
      isAdmin: true,
      subscribed: true,
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('Email   : admin@moviehub.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

createAdmin();
