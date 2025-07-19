const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nafsyetak-clinic', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Connection error:', error);
    process.exit(1);
  }
};

const createAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      email: process.env.ADMIN_EMAIL || 'admin@nafsyetak.com',
      role: 'admin'
    });
    
    if (existingAdmin) {
      console.log('Admin account already exists, deleting old one...');
      await User.deleteOne({ _id: existingAdmin._id });
    }
    
    // Create new admin
    const adminData = {
      name: 'Administrator',
      email: process.env.ADMIN_EMAIL || 'admin@nafsyetak.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      phone: '+20 123 456 7890',
      role: 'admin'
    };
    
    const admin = new User(adminData);
    await admin.save();
    
    console.log(`Admin account created successfully with email: ${adminData.email}`);
    console.log(`Password: ${adminData.password}`);
    
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.disconnect();
  }
};

const main = async () => {
  await connectDB();
  await createAdmin();
};

main();
