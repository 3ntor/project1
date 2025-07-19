const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nafsyetak-clinic', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  
  // بيانات الحساب الإداري الثابت
  const adminData = {
    name: 'Administrator',
    email: process.env.ADMIN_EMAIL || 'admin@nafsyetak.com',
    password: process.env.ADMIN_PASSWORD || 'admin123',
    phone: '+20 123 456 7890',
    role: 'admin'
  };

  // التحقق من وجود المدير
  User.findOne({ email: adminData.email, role: 'admin' })
    .then(existingAdmin => {
      if (existingAdmin) {
        console.log('Admin account already exists');
        mongoose.disconnect();
        return;
      }

      // إنشاء حساب المدير
      const admin = new User(adminData);
      return admin.save();
    })
    .then(() => {
      console.log('Admin account created successfully');
      mongoose.disconnect();
    })
    .catch(error => {
      console.error('Error:', error);
      mongoose.disconnect();
    });
})
.catch(error => {
  console.error('Connection error:', error);
});
