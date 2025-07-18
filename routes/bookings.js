const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Booking = require('../models/Booking');
const User = require('../models/User');

// وسطاء التحقق من التوثيق
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'الرجاء تسجيل الدخول أولاً' });
  }
};

// إنشاء حجز جديد
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, phone, date, time } = req.body;

    // التحقق من وجود المستخدم
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    // إنشاء الحجز
    const booking = new Booking({
      user: user._id,
      name,
      email,
      phone,
      date,
      time
    });

    await booking.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء حجز الجلسة' });
  }
});

// عرض جميع الحجوزات للمستخدم
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الحجوزات' });
  }
});

// تحديث حالة الحجز
router.patch('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!booking) {
      return res.status(404).json({ message: 'الحجز غير موجود' });
    }

    if (req.body.status) {
      booking.status = req.body.status;
      await booking.save();
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء تحديث الحجز' });
  }
});

module.exports = router;
