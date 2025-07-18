const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Booking = require('../models/Booking');
const BlogPost = require('../models/BlogPost');

// وسطاء التحقق من صلاحيات الإدارة
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'الرجاء تسجيل الدخول أولاً' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // التحقق من وجود adminId في التوكن
    if (decoded.adminId) {
      const admin = await Admin.findById(decoded.adminId);
      if (!admin) {
        return res.status(403).json({ message: 'غير مصرح لك بالوصول' });
      }
      req.admin = admin;
      next();
    } else {
      return res.status(403).json({ message: 'غير مصرح لك بالوصول' });
    }
  } catch (error) {
    res.status(401).json({ message: 'الرجاء تسجيل الدخول أولاً' });
  }
};

// الحصول على إحصائيات لوحة التحكم
router.get('/dashboard/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const totalPosts = await BlogPost.countDocuments();

    // إحصائيات الحجوزات الشهرية
    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthlyBookings = await Booking.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // إحصائيات الخدمات
    const serviceStats = await Booking.aggregate([
      { $group: { _id: '$service', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        totalPosts,
        monthlyBookings,
        serviceStats
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الإحصائيات' });
  }
});

// الحصول على جميع المستخدمين
router.get('/users', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments();

    res.json({
      success: true,
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNextPage: page < Math.ceil(totalUsers / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب المستخدمين' });
  }
});

// الحصول على جميع الحجوزات
router.get('/bookings', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    let filter = {};
    if (status && ['pending', 'confirmed', 'cancelled'].includes(status)) {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBookings = await Booking.countDocuments(filter);

    res.json({
      success: true,
      bookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBookings / limit),
        totalBookings,
        hasNextPage: page < Math.ceil(totalBookings / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الحجوزات' });
  }
});

// تحديث حالة الحجز
router.patch('/bookings/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'حالة غير صحيحة' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'الحجز غير موجود' });
    }

    res.json({
      success: true,
      message: 'تم تحديث حالة الحجز بنجاح',
      booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء تحديث حالة الحجز' });
  }
});

// حذف حجز
router.delete('/bookings/:id', adminAuth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'الحجز غير موجود' });
    }

    res.json({
      success: true,
      message: 'تم حذف الحجز بنجاح'
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء حذف الحجز' });
  }
});

// حذف مستخدم
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    // حذف جميع حجوزات المستخدم
    await Booking.deleteMany({ user: req.params.id });

    res.json({
      success: true,
      message: 'تم حذف المستخدم وجميع حجوزاته بنجاح'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء حذف المستخدم' });
  }
});

// البحث في المستخدمين
router.get('/users/search', adminAuth, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'يرجى إدخال كلمة البحث' });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } }
      ]
    }).select('-password').limit(20);

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء البحث' });
  }
});

// البحث في الحجوزات
router.get('/bookings/search', adminAuth, async (req, res) => {
  try {
    const { q, status, service, date } = req.query;
    
    let filter = {};
    
    if (status && ['pending', 'confirmed', 'cancelled'].includes(status)) {
      filter.status = status;
    }
    
    if (service && ['individual', 'couples', 'family', 'anxiety', 'depression'].includes(service)) {
      filter.service = service;
    }
    
    if (date) {
      const searchDate = new Date(date);
      filter.date = {
        $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
        $lt: new Date(searchDate.setHours(23, 59, 59, 999))
      };
    }

    let bookings;
    if (q) {
      // البحث في المستخدمين أولاً
      const users = await User.find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } },
          { phone: { $regex: q, $options: 'i' } }
        ]
      }).select('_id');

      const userIds = users.map(user => user._id);
      
      filter.$or = [
        { user: { $in: userIds } },
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } }
      ];
    }

    bookings = await Booking.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Search bookings error:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء البحث' });
  }
});

module.exports = router;
