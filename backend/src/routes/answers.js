const express = require('express');
const { auth } = require('../middleware/auth');
const { updateAnswerSchema } = require('../validation/answerValidation');
const { sanitizeContent } = require('../utils/sanitizer');
const prisma = require('../lib/prisma');

const router = express.Router();

// Middleware to check if user is answer owner or admin
const answerOwnerOrAdminAuth = async (req, res, next) => {
  try {
    const { id } = req.params;
    const answer = await prisma.answer.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found.' });
    }

    if (req.user.role !== 'ADMIN' && req.user.id !== answer.authorId) {
      return res.status(403).json({ error: 'Access denied. Owner or admin privileges required.' });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed.' });
  }
};

// PUT /api/answers/:id - Edit answer (answer owner or admin only)
router.put('/:id', auth, answerOwnerOrAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate request body
    const { error, value } = updateAnswerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { content } = value;

    // Sanitize the content to prevent XSS
    const sanitizedContent = sanitizeContent(content);

    // Update the answer
    const answer = await prisma.answer.update({
      where: { id },
      data: {
        content: sanitizedContent,
        updatedAt: new Date()
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      }
    });

    res.json({
      message: 'Answer updated successfully',
      answer
    });
  } catch (error) {
    console.error('Error updating answer:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Answer not found' });
    }
    res.status(500).json({ error: 'Failed to update answer' });
  }
});

// DELETE /api/answers/:id - Delete answer (answer owner or admin only)
router.delete('/:id', auth, answerOwnerOrAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the answer (this will also cascade delete related comments)
    await prisma.answer.delete({
      where: { id }
    });

    res.json({
      message: 'Answer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting answer:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Answer not found' });
    }
    res.status(500).json({ error: 'Failed to delete answer' });
  }
});

module.exports = router; 