const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-app';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Blog Post Schema
const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  tags: {
    type: [String],
    default: []
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

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

// Routes

// GET all blog posts (with optional tag filter)
app.get('/api/posts', async (req, res) => {
  try {
    const { tag } = req.query;
    let query = {};
    
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    const posts = await BlogPost.find(query).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single blog post by ID
app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new blog post
app.post('/api/posts', async (req, res) => {
  try {
    const { title, content, author, tags } = req.body;
    
    if (!title || !content || !author) {
      return res.status(400).json({ error: 'Title, content, and author are required' });
    }

    // Process tags - handle both array and string formats
    let processedTags = [];
    if (tags) {
      if (Array.isArray(tags)) {
        // Already an array, just trim and filter
        processedTags = tags
          .map(tag => String(tag).trim())
          .filter(tag => tag.length > 0);
      } else if (typeof tags === 'string') {
        // String format, split by comma
        processedTags = tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0);
      }
    }
    console.log('Processed tags for create:', processedTags); // Debug log

    const newPost = new BlogPost({
      title,
      content,
      author,
      tags: processedTags,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const savedPost = await newPost.save();
    console.log('Post created with tags:', savedPost.tags); // Debug log
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE blog post
app.put('/api/posts/:id', async (req, res) => {
  try {
    const { title, content, author, tags } = req.body;
    
    // Process tags - handle both array and string formats
    let processedTags = [];
    if (tags) {
      if (Array.isArray(tags)) {
        // Already an array, just trim and filter
        processedTags = tags
          .map(tag => String(tag).trim())
          .filter(tag => tag.length > 0);
      } else if (typeof tags === 'string') {
        // String format, split by comma
        processedTags = tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0);
      }
    }
    console.log('Processed tags for update:', processedTags); // Debug log
    
    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        author,
        tags: processedTags,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    console.log('Post updated with tags:', updatedPost.tags); // Debug log
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE blog post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
    
    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ message: 'Post deleted successfully', post: deletedPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

