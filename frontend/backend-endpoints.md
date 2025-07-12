# Express/Node.js Backend Endpoints for StackIt

## Installation & Setup

```bash
npm init -y
npm install express cors helmet morgan dotenv bcryptjs jsonwebtoken mongoose express-rate-limit
npm install -D nodemon
```

## Basic Server Setup (server.js)

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/answers', require('./routes/answers'));
app.use('/api/users', require('./routes/users'));
app.use('/api/tags', require('./routes/tags'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

## Database Models (models/)

### User Model (models/User.js)
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 500
  },
  reputation: {
    type: Number,
    default: 0
  },
  badges: [{
    name: String,
    description: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### Question Model (models/Question.js)
```javascript
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  votes: {
    upvotes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      votedAt: {
        type: Date,
        default: Date.now
      }
    }],
    downvotes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      votedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  views: {
    type: Number,
    default: 0
  },
  answers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer'
  }],
  acceptedAnswer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer'
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'answered'],
    default: 'open'
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

questionSchema.virtual('score').get(function() {
  return this.votes.upvotes.length - this.votes.downvotes.length;
});

questionSchema.index({ title: 'text', content: 'text', tags: 'text' });
questionSchema.index({ createdAt: -1 });
questionSchema.index({ score: -1 });

module.exports = mongoose.model('Question', questionSchema);
```

## API Routes

### Authentication Routes (routes/auth.js)
```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('username').isLength({ min: 3, max: 30 }).trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    const user = new User({ username, email, password });
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        reputation: user.reputation
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        reputation: user.reputation
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

module.exports = router;
```

### Questions Routes (routes/questions.js)
```javascript
const express = require('express');
const Question = require('../models/Question');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// @route   GET /api/questions
// @desc    Get all questions with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'newest',
      tags,
      search,
      status = 'open'
    } = req.query;

    const query = { isDeleted: false };
    
    // Filter by status
    if (status !== 'all') {
      query.status = status;
    }
    
    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'votes':
        sortOption = { score: -1 };
        break;
      case 'views':
        sortOption = { views: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const questions = await Question.find(query)
      .populate('author', 'username avatar reputation')
      .populate('acceptedAnswer')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Add calculated score to each question
    const questionsWithScore = questions.map(q => ({
      ...q,
      score: q.votes.upvotes.length - q.votes.downvotes.length
    }));

    const total = await Question.countDocuments(query);

    res.json({
      success: true,
      questions: questionsWithScore,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching questions'
    });
  }
});

// @route   POST /api/questions
// @desc    Create a new question
// @access  Private
router.post('/', auth, [
  body('title').isLength({ min: 10, max: 200 }).trim(),
  body('content').isLength({ min: 20, max: 10000 }).trim(),
  body('tags').isArray({ min: 1, max: 5 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { title, content, tags } = req.body;
    
    const question = new Question({
      title,
      content,
      tags: tags.map(tag => tag.toLowerCase().trim()),
      author: req.user.userId
    });

    await question.save();
    await question.populate('author', 'username avatar reputation');

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      question
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating question'
    });
  }
});

// @route   GET /api/questions/:id
// @desc    Get single question
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'username avatar reputation badges')
      .populate({
        path: 'answers',
        populate: {
          path: 'author',
          select: 'username avatar reputation badges'
        }
      })
      .populate('acceptedAnswer');

    if (!question || question.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Increment view count
    question.views += 1;
    await question.save();

    res.json({
      success: true,
      question: {
        ...question.toObject(),
        score: question.votes.upvotes.length - question.votes.downvotes.length
      }
    });
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching question'
    });
  }
});

// @route   POST /api/questions/:id/vote
// @desc    Vote on a question
// @access  Private
router.post('/:id/vote', auth, [
  body('type').isIn(['upvote', 'downvote'])
], async (req, res) => {
  try {
    const { type } = req.body;
    const userId = req.user.userId;
    
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Remove existing votes by this user
    question.votes.upvotes = question.votes.upvotes.filter(
      vote => vote.user.toString() !== userId
    );
    question.votes.downvotes = question.votes.downvotes.filter(
      vote => vote.user.toString() !== userId
    );

    // Add new vote
    if (type === 'upvote') {
      question.votes.upvotes.push({ user: userId });
    } else {
      question.votes.downvotes.push({ user: userId });
    }

    await question.save();

    const score = question.votes.upvotes.length - question.votes.downvotes.length;

    res.json({
      success: true,
      message: `Question ${type}d successfully`,
      score,
      userVote: type
    });
  } catch (error) {
    console.error('Vote question error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while voting'
    });
  }
});

module.exports = router;
```

### Answers Routes (routes/answers.js)
```javascript
const express = require('express');
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// @route   POST /api/answers
// @desc    Create a new answer
// @access  Private
router.post('/', auth, [
  body('content').isLength({ min: 20, max: 10000 }).trim(),
  body('questionId').isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { content, questionId } = req.body;
    
    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    const answer = new Answer({
      content,
      question: questionId,
      author: req.user.userId
    });

    await answer.save();
    
    // Add answer to question
    question.answers.push(answer._id);
    await question.save();
    
    await answer.populate('author', 'username avatar reputation');

    res.status(201).json({
      success: true,
      message: 'Answer created successfully',
      answer
    });
  } catch (error) {
    console.error('Create answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating answer'
    });
  }
});

module.exports = router;
```

### Authentication Middleware (middleware/auth.js)
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }

    req.user = { userId: user._id, ...user.toObject() };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};
```

## Environment Variables (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stackit
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:5173
```

## Package.json Scripts
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

## Frontend Integration Example

```javascript
// api/client.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: credentials,
    });
  }

  // Questions
  async getQuestions(params = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/questions?${searchParams}`);
  }

  async createQuestion(questionData) {
    return this.request('/questions', {
      method: 'POST',
      body: questionData,
    });
  }

  async getQuestion(id) {
    return this.request(`/questions/${id}`);
  }

  async voteQuestion(id, type) {
    return this.request(`/questions/${id}/vote`, {
      method: 'POST',
      body: { type },
    });
  }
}

export const apiClient = new ApiClient();
```

This backend provides all the essential endpoints for a Stack Overflow-like application with authentication, questions, answers, voting, and more!