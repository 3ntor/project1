const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { adminAuth } = require('../middleware/auth');

// Get all contact messages
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit contact form
router.post('/', async (req, res) => {
  const contact = new Contact({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    subject: req.body.subject,
    message: req.body.message
  });

  try {
    const newContact = await contact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all contact messages (Admin only)
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (status) {
      query.status = status;
    }
    
    const contacts = await Contact.find(query)
      .populate('repliedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Contact.countDocuments(query);
    
    res.json({
      contacts,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get contact message by ID (Admin only)
router.get('/admin/:id', adminAuth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('repliedBy', 'name');
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update contact message status (Admin only)
router.put('/admin/:id/status', adminAuth, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    
    contact.status = status || contact.status;
    contact.adminNotes = adminNotes || contact.adminNotes;
    
    if (status === 'read' && contact.status === 'new') {
      contact.status = 'read';
    }
    
    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark contact as replied (Admin only)
router.put('/admin/:id/reply', adminAuth, async (req, res) => {
  try {
    const { adminNotes } = req.body;
    
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    
    contact.status = 'replied';
    contact.adminNotes = adminNotes || contact.adminNotes;
    contact.repliedAt = new Date();
    contact.repliedBy = req.user._id;
    
    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete contact message (Admin only)
router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get contact statistics (Admin only)
router.get('/admin/stats/overview', adminAuth, async (req, res) => {
  try {
    const total = await Contact.countDocuments();
    const newMessages = await Contact.countDocuments({ status: 'new' });
    const readMessages = await Contact.countDocuments({ status: 'read' });
    const repliedMessages = await Contact.countDocuments({ status: 'replied' });
    const archivedMessages = await Contact.countDocuments({ status: 'archived' });
    
    // Get recent messages (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentMessages = await Contact.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });
    
    res.json({
      total,
      new: newMessages,
      read: readMessages,
      replied: repliedMessages,
      archived: archivedMessages,
      recent: recentMessages
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;