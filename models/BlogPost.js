const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: false,
    unique: true
  },
  excerpt: {
    type: String,
    required: false,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  featuredImage: {
    type: String,
    required: false,
    default: 'https://via.placeholder.com/800x400/667eea/ffffff?text=Blog+Post'
  },
  category: {
    type: String,
    required: true,
    enum: ['depression', 'anxiety', 'stress', 'relationships', 'self-care', 'therapy', 'general', 'صحة نفسية', 'علاج نفسي', 'نصائح', 'تطوير ذاتي']
  },
  tags: [{
    type: String,
    trim: true
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  readTime: {
    type: Number,
    default: 5 // in minutes
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  publishedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
blogPostSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate slug from title
blogPostSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    let slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
    
    // Ensure slug is not empty
    if (!slug || slug === '-') {
      slug = 'post-' + Date.now();
    }
    
    this.slug = slug;
  }
  
  // Generate excerpt from content if not provided
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 150) + '...';
  }
  
  next();
});

module.exports = mongoose.model('BlogPost', blogPostSchema);