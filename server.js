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
    const User = require('./models/User');
    
    // التحقق من وجود حساب إدارة
    const existingAdmin = await User.findOne({ 
      email: process.env.ADMIN_EMAIL || 'admin@nafsyetak.com',
      role: 'admin'
    });
    
    if (!existingAdmin) {
      console.log('Creating admin account...');
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
      
      const adminData = {
        name: 'Administrator',
        email: process.env.ADMIN_EMAIL || 'admin@nafsyetak.com',
        password: hashedPassword,
        phone: '+20 123 456 7890',
        role: 'admin'
      };
      
      // إنشاء حساب المدير
      const admin = new User(adminData);
      await admin.save();
      console.log(`Admin account created successfully with email: ${adminData.email}`);
    } else {
      console.log('Admin account already exists');
    }
  } catch (error) {
    console.error('Error creating admin account:', error);
  }
};

const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nafsyetak-clinic';
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', mongoURI);
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // إنشاء حساب المدير بعد الاتصال بنجاح
    await createAdminIfNotExists();
    
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log('');
    console.log('🔥 SOLUTION: MongoDB is not running! Please do one of the following:');
    console.log('1. Install and start MongoDB locally:');
    console.log('   - Install: sudo apt install mongodb-org');
    console.log('   - Start: sudo systemctl start mongod');
    console.log('');
    console.log('2. Or use MongoDB Atlas (cloud):');
    console.log('   - Sign up at https://cloud.mongodb.com');
    console.log('   - Get connection string and update MONGODB_URI in .env file');
    console.log('');
    console.log('3. Or use a local MongoDB container:');
    console.log('   - docker run -d -p 27017:27017 --name mongodb mongo:latest');
    console.log('');
    console.log('The server will continue running but database operations will fail.');
    console.log('Please fix the MongoDB connection and restart the server.');
    console.log('');
  }
};

// Connect to database
connectDB();

// Database connection check middleware
const checkDBConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      success: false,
      message: 'قاعدة البيانات غير متاحة حالياً',
      error: 'Database connection not available. Please check MongoDB connection.',
      helpText: 'يرجى التأكد من تشغيل MongoDB أو التحقق من إعدادات الاتصال'
    });
  }
  next();
};

// Apply database check to API routes
app.use('/api', checkDBConnection);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/services', require('./routes/services'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/faqs', require('./routes/faqs'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/admin', require('./routes/admin'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// تحقق من حالة MongoDB
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

// تحقق من حالة الخادم
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`🌐 Frontend URL: http://localhost:3000`);
  }
});

module.exports = app;