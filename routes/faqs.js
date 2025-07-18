const express = require('express');
const router = express.Router();
const FAQ = require('../models/FAQ');

// Get all FAQs
router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get FAQs by category
router.get('/category/:category', async (req, res) => {
  try {
    const faqs = await FAQ.find({ 
      category: req.params.category, 
      isActive: true 
    }).sort({ order: 1, createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create FAQ (Admin only)
router.post('/', async (req, res) => {
  try {
    const { question, answer, category, order } = req.body;
    
    const faq = new FAQ({
      question,
      answer,
      category,
      order: order || 0
    });

    await faq.save();
    res.status(201).json(faq);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update FAQ (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const { question, answer, category, order, isActive } = req.body;
    
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      { question, answer, category, order, isActive },
      { new: true }
    );

    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    res.json(faq);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete FAQ (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;