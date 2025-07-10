const express = require('express');
const router = express.Router();

// Services data
const services = [
  {
    id: 1,
    title: 'Individual Therapy',
    description: 'One-on-one therapy sessions tailored to your specific needs and goals.',
    icon: '👤',
    duration: '50-60 minutes',
    price: '$150 per session'
  },
  {
    id: 2,
    title: 'Couples Therapy',
    description: 'Specialized therapy for couples to improve communication and strengthen relationships.',
    icon: '💑',
    duration: '80-90 minutes',
    price: '$200 per session'
  },
  {
    id: 3,
    title: 'Family Therapy',
    description: 'Family-focused therapy to address conflicts and improve family dynamics.',
    icon: '👨‍👩‍👧‍👦',
    duration: '80-90 minutes',
    price: '$200 per session'
  },
  {
    id: 4,
    title: 'Child Therapy',
    description: 'Specialized therapy for children and adolescents using age-appropriate techniques.',
    icon: '🧒',
    duration: '45-50 minutes',
    price: '$120 per session'
  },
  {
    id: 5,
    title: 'Group Therapy',
    description: 'Therapeutic groups for shared experiences and peer support.',
    icon: '👥',
    duration: '90 minutes',
    price: '$80 per session'
  },
  {
    id: 6,
    title: 'Assessment',
    description: 'Comprehensive psychological assessments and evaluations.',
    icon: '📋',
    duration: '2-3 hours',
    price: '$300 per assessment'
  }
];

// Get all services
router.get('/', (req, res) => {
  res.json(services);
});

// Get service by ID
router.get('/:id', (req, res) => {
  const service = services.find(s => s.id === parseInt(req.params.id));
  if (!service) {
    return res.status(404).json({ message: 'Service not found' });
  }
  res.json(service);
});

module.exports = router;