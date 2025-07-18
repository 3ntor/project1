const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// إنشاء حساب المدير تلقائياً عند تشغيل الخادم
const createAdminIfNotExists = async () => {
  try {
    const Admin = require('./models/Admin');
    
    // حذف أي حسابات إدارية موجودة
    await Admin.deleteMany({});
    
    console.log('Creating admin account...');
    const adminData = {
      email: 'admin@gmail.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // كلمة مرور مشفرة مسبقاً (admin123)
      role: 'admin'
    };
    
    // إنشاء حساب المدير
    const admin = new Admin(adminData);
    await admin.save();
    console.log('Admin account created successfully');
  } catch (error) {
    console.error('Error creating admin account:', error);
  }
};

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/booking-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  // إنشاء حساب المدير بعد الاتصال بنجاح
  createAdminIfNotExists();
})
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth')); // روتات التوثيق الجديدة
app.use('/api/bookings', require('./routes/bookings')); // روتات الحجوزات الجديدة
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/services', require('./routes/services'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/faqs', require('./routes/faqs'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/admin', require('./routes/admin')); // روتات الإدارة

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

// تحقق من حالة MongoDB
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// تحقق من حالة الخادم
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('API Routes:', app._router.stack
    .filter(r => r.route && r.route.path)
    .map(r => r.route.path));
});