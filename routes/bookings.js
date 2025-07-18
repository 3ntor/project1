const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Admin = require('../models/Admin');

// وسطاء التحقق من التوثيق
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'الرجاء تسجيل الدخول أولاً' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'الرجاء تسجيل الدخول أولاً' });
  }
};

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

// إنشاء حجز جديد (للمستخدمين المسجلين فقط)
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, phone, service, date, time, notes } = req.body;

    // التحقق من وجود المستخدم
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    // التحقق من صحة البيانات
    if (!name || !email || !phone || !service || !date || !time) {
      return res.status(400).json({ message: 'جميع الحقول المطلوبة يجب ملؤها' });
    }

    // التحقق من عدم وجود حجز في نفس التاريخ والوقت
    const existingBooking = await Booking.findOne({ 
      date: new Date(date), 
      time: time,
      status: { $ne: 'cancelled' }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'هذا الموعد محجوز بالفعل' });
    }

    // إنشاء الحجز
    const booking = new Booking({
      user: user._id,
      name,
      email,
      phone,
      service,
      date: new Date(date),
      time,
      notes: notes || ''
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'تم حجز الموعد بنجاح',
      booking
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء حجز الجلسة' });
  }
});

// عرض حجوزات المستخدم الحالي فقط
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الحجوزات' });
  }
});

// عرض جميع الحجوزات (للإدارة فقط)
router.get('/all', adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الحجوزات' });
  }
});

// تحديث حالة الحجز (للمستخدم أو الإدارة)
router.patch('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    // البحث عن الحجز
    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'الحجز غير موجود' });
    }

    // التحقق من الصلاحيات
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // إذا كان المستخدم عادي، يمكنه تعديل حجوزاته فقط
    if (decoded.userId && booking.user.toString() !== decoded.userId) {
      return res.status(403).json({ message: 'غير مصرح لك بتعديل هذا الحجز' });
    }

    // إذا كان إدارة، يمكنه تعديل أي حجز
    if (decoded.adminId) {
      const admin = await Admin.findById(decoded.adminId);
      if (!admin) {
        return res.status(403).json({ message: 'غير مصرح لك بالوصول' });
      }
    }

    // تحديث الحالة
    if (status && ['pending', 'confirmed', 'cancelled'].includes(status)) {
      booking.status = status;
      await booking.save();
    }

    res.json({
      success: true,
      message: 'تم تحديث الحجز بنجاح',
      booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء تحديث الحجز' });
  }
});

// حذف حجز (للمستخدم أو الإدارة)
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'الحجز غير موجود' });
    }

    // التحقق من الصلاحيات
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // إذا كان المستخدم عادي، يمكنه حذف حجوزاته فقط
    if (decoded.userId && booking.user.toString() !== decoded.userId) {
      return res.status(403).json({ message: 'غير مصرح لك بحذف هذا الحجز' });
    }

    // إذا كان إدارة، يمكنه حذف أي حجز
    if (decoded.adminId) {
      const admin = await Admin.findById(decoded.adminId);
      if (!admin) {
        return res.status(403).json({ message: 'غير مصرح لك بالوصول' });
      }
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'تم حذف الحجز بنجاح'
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء حذف الحجز' });
  }
});

// الحصول على الأوقات المتاحة لتاريخ معين
router.get('/available-times/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    // الأوقات المتاحة
    const allTimeSlots = [
      '09:00', '10:00', '11:00', '12:00',
      '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    // البحث عن الحجوزات في هذا التاريخ
    const bookedSlots = await Booking.find({
      date: new Date(date),
      status: { $ne: 'cancelled' }
    }).select('time');

    const bookedTimes = bookedSlots.map(booking => booking.time);
    const availableTimes = allTimeSlots.filter(time => !bookedTimes.includes(time));

    res.json({
      success: true,
      availableTimes,
      bookedTimes
    });
  } catch (error) {
    console.error('Get available times error:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الأوقات المتاحة' });
  }
});

module.exports = router;
