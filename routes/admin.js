const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// جلب جميع الحجوزات
router.get('/appointments', requireAdmin, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('user')
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الحجوزات' });
  }
});

// تحديث حالة الحجز
router.put('/appointments/:id', requireAdmin, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: 'لم يتم العثور على الحجز' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء تحديث الحجز' });
  }
});

// جلب جميع المستخدمين
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب المستخدمين' });
  }
});

// جلب إحصائيات الموقع
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const [totalUsers, totalAppointments, todayAppointments] = await Promise.all([
      User.countDocuments(),
      Appointment.countDocuments(),
      Appointment.find({
        date: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(24, 0, 0, 0))
        }
      }).countDocuments()
    ]);

    res.json({
      totalUsers,
      totalAppointments,
      todayAppointments
    });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الإحصائيات' });
  }
});

module.exports = router;
