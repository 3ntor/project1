const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new appointment
router.post('/', async (req, res) => {
  try {
    // التحقق من البيانات المطلوبة
    const requiredFields = ['name', 'email', 'phone', 'service', 'date', 'time'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        missing: missingFields 
      });
    }

    // تحويل التاريخ إلى تنسيق Date
    const date = new Date(req.body.date);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // إنشاء موعد جديد
    const appointment = new Appointment({
      name: req.body.name,
      email: req.body.email.toLowerCase().trim(),
      phone: req.body.phone.trim(),
      service: {
        name: req.body.service.name,
        description: req.body.service.description,
        price: req.body.service.price,
        duration: req.body.service.duration
      },
      date: date,
      time: req.body.time,
      message: req.body.message ? req.body.message.trim() : '',
      status: 'pending'
    });

    // حفظ الموعد
    const newAppointment = await appointment.save();
    
    // إرسال رسالة نجاح
    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: newAppointment
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update appointment status
router.patch('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (req.body.status) {
      appointment.status = req.body.status;
    }
    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete appointment
router.delete('/:id', async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;