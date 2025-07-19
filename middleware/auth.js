const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Regular user authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'يحتاج تسجيل الدخول' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.userId) {
      return res.status(403).json({ message: 'غير مصرح' });
    }

    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(403).json({ message: 'المستخدم غير موجود' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'خطأ في التحقق من الصلاحيات' });
  }
};

// Admin authentication middleware
const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'يحتاج تسجيل الدخول' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.userId) {
      return res.status(403).json({ message: 'غير مصرح' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(403).json({ message: 'المستخدم غير موجود' });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'يحتاج صلاحيات الأدمن' });
    }

    req.user = user;
    req.admin = user; // For backward compatibility
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(401).json({ message: 'خطأ في التحقق من الصلاحيات' });
  }
};

// Optional auth middleware (doesn't require authentication)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.userId) {
        const user = await User.findById(decoded.userId);
        if (user) {
          req.user = user;
        }
      }
    }
    
    next();
  } catch (error) {
    // If token is invalid, just continue without setting req.user
    next();
  }
};

module.exports = {
  auth,
  adminAuth,
  optionalAuth,
  requireAdmin: adminAuth // For backward compatibility
};
