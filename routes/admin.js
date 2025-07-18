const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');
const BlogPost = require('../models/BlogPost');
const { adminAuth } = require('../middleware/auth');

// Dashboard statistics
router.get('/dashboard/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const totalPosts = await BlogPost.countDocuments();

    // Monthly bookings
    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthlyBookings = await Booking.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // Service statistics
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

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({ role: { $ne: 'admin' } });

    res.json({
      success: true,
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب المستخدمين' });
  }
});

// Get all bookings
router.get('/bookings', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      bookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBookings: total
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الحجوزات' });
  }
});

// Update booking status
router.patch('/bookings/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'حالة غير صالحة' });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
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

// Delete booking
router.delete('/bookings/:id', adminAuth, async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findByIdAndDelete(bookingId);
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

// Delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const userId = req.params.id;

    // Delete user's bookings first
    await Booking.deleteMany({ user: userId });

    // Delete user
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    res.json({
      success: true,
      message: 'تم حذف المستخدم وجميع حجوزاته بنجاح'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء حذف المستخدم' });
  }
});

// Search users
router.get('/users/search', adminAuth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'يجب إدخال نص البحث' });
    }

    const users = await User.find({
      role: { $ne: 'admin' },
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
    res.status(500).json({ message: 'حدث خطأ أثناء البحث عن المستخدمين' });
  }
});

// Search bookings
router.get('/bookings/search', adminAuth, async (req, res) => {
  try {
    const { q, status, service, date } = req.query;
    
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (service) {
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
      // Search in user details
      const users = await User.find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } },
          { phone: { $regex: q, $options: 'i' } }
        ]
      }).select('_id');

      const userIds = users.map(user => user._id);
      filter.user = { $in: userIds };
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
    res.status(500).json({ message: 'حدث خطأ أثناء البحث عن الحجوزات' });
  }
});

module.exports = router;
