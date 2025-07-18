const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

mongoose.connect('mongodb+srv://ahmed:ahmed123@project.qemt8bn.mongodb.net/?retryWrites=true&w=majority&appName=project', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  
  // بيانات الحساب الإداري الثابت
  const adminData = {
    username: 'admin',
    password: 'admin123',
    role: 'admin'
  };

  // تشفير كلمة المرور
  bcrypt.hash(adminData.password, 10)
    .then(hashedPassword => {
      adminData.password = hashedPassword;

      // إنشاء حساب المدير
      const admin = new Admin(adminData);
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
