const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

// حجز جلسة جديدة
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, phone, service, date, time, notes } = req.body;

    // التحقق من وجود المستخدم (req.user is already the user object from middleware)
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    // التحقق من البيانات المطلوبة
    if (!name || !email || !phone || !service || !date || !time) {
      return res.status(400).json({ message: 'جميع الحقول المطلوبة يجب ملؤها' });
    }

    // التحقق من عدم وجود حجز في نفس الوقت والتاريخ
    const existingBooking = await Booking.findOne({
      date: new Date(date),
      time: time,
      status: { $ne: 'cancelled' }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'هذا الموعد محجوز بالفعل' });
    }

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

// جلب حجوزات المستخدم الحالي فقط
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    const bookings = await Booking.find({ user: user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الحجوزات' });
  }
});

// جلب جميع الحجوزات (للأدمن فقط)
router.get('/all', adminAuth, async (req, res) => {
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
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الحجوزات' });
  }
});

// تحديث حالة الحجز (للمستخدم الخاص أو الأدمن)
router.patch('/:id', auth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const bookingId = req.params.id;

    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'الحجز غير موجود' });
    }

    // التحقق من الصلاحيات: المستخدم يمكنه تعديل حجوزاته فقط، الأدمن يمكنه تعديل جميع الحجوزات
    if (user.role !== 'admin' && booking.user.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'غير مصرح لك بتعديل هذا الحجز' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true }
    ).populate('user', 'name email phone');

    res.json({
      success: true,
      message: 'تم تحديث الحجز بنجاح',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء تحديث الحجز' });
  }
});

// حذف حجز (للمستخدم الخاص أو الأدمن)
router.delete('/:id', auth, async (req, res) => {
  try {
    const bookingId = req.params.id;

    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'الحجز غير موجود' });
    }

    // التحقق من الصلاحيات: المستخدم يمكنه حذف حجوزاته فقط، الأدمن يمكنه حذف جميع الحجوزات
    if (user.role !== 'admin' && booking.user.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'غير مصرح لك بحذف هذا الحجز' });
    }

    await Booking.findByIdAndDelete(bookingId);

    res.json({
      success: true,
      message: 'تم حذف الحجز بنجاح'
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء حذف الحجز' });
  }
});

// جلب الأوقات المتاحة لتاريخ معين
router.get('/available-times/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const selectedDate = new Date(date);

    // الأوقات المتاحة (من 9 صباحاً إلى 6 مساءً)
    const availableSlots = [
      '09:00', '10:00', '11:00', '12:00',
      '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    // جلب الحجوزات المؤكدة والمعلقة لهذا التاريخ
    const bookedSlots = await Booking.find({
      date: {
        $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(selectedDate.setHours(23, 59, 59, 999))
      },
      status: { $in: ['pending', 'confirmed'] }
    }).select('time');

    const bookedTimes = bookedSlots.map(booking => booking.time);
    const availableTimes = availableSlots.filter(time => !bookedTimes.includes(time));

    res.json({
      success: true,
      availableTimes,
      bookedTimes
    });
  } catch (error) {
    console.error('Error fetching available times:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الأوقات المتاحة' });
  }
});

module.exports = router;
