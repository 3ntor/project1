const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');

// Get all published blog posts
router.get('/', async (req, res) => {
  try {
    const { category, tag, page = 1, limit = 9 } = req.query;
    const skip = (page - 1) * limit;
    
    let query = { isPublished: true };
    
    if (category) {
      query.category = category;
    }
    
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    const posts = await BlogPost.find(query)
      .populate('author', 'name specialization')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await BlogPost.countDocuments(query);
    
    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured blog posts
router.get('/featured', async (req, res) => {
  try {
    const posts = await BlogPost.find({ 
      isPublished: true, 
      isFeatured: true 
    })
    .populate('author', 'name specialization')
    .sort({ publishedAt: -1 })
    .limit(5);
    
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get blog post by slug
router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ 
      slug: req.params.slug,
      isPublished: true 
    }).populate('author', 'name specialization bio');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Increment views
    post.views += 1;
    await post.save();
    
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new blog post (Admin only)
router.post('/', async (req, res) => {
  try {
    const { title, excerpt, content, featuredImage, category, tags, readTime } = req.body;
    
    const post = new BlogPost({
      title,
      excerpt,
      content,
      featuredImage,
      category,
      tags: tags || [],
      readTime: readTime || 5,
      author: req.body.authorId || '64f8b2c1a2b3c4d5e6f7g8h9', // Mock author ID
      isPublished: req.body.isPublished || false,
      isFeatured: req.body.isFeatured || false
    });
    
    if (post.isPublished) {
      post.publishedAt = new Date();
    }
    
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update blog post (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const { title, excerpt, content, featuredImage, category, tags, readTime, isPublished, isFeatured } = req.body;
    
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    post.title = title || post.title;
    post.excerpt = excerpt || post.excerpt;
    post.content = content || post.content;
    post.featuredImage = featuredImage || post.featuredImage;
    post.category = category || post.category;
    post.tags = tags || post.tags;
    post.readTime = readTime || post.readTime;
    post.isPublished = isPublished !== undefined ? isPublished : post.isPublished;
    post.isFeatured = isFeatured !== undefined ? isFeatured : post.isFeatured;
    
    // Set publishedAt if publishing for the first time
    if (isPublished && !post.publishedAt) {
      post.publishedAt = new Date();
    }
    
    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete blog post (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like blog post
router.post('/:id/like', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    post.likes += 1;
    await post.save();
    
    res.json({ likes: post.likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get blog categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = [
      { id: 'depression', name: 'الاكتئاب', icon: '😔' },
      { id: 'anxiety', name: 'القلق', icon: '😰' },
      { id: 'stress', name: 'الضغوط النفسية', icon: '😤' },
      { id: 'relationships', name: 'العلاقات', icon: '💕' },
      { id: 'self-care', name: 'الرعاية الذاتية', icon: '🧘' },
      { id: 'therapy', name: 'العلاج النفسي', icon: '🩺' },
      { id: 'general', name: 'عام', icon: '📝' }
    ];
    
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;