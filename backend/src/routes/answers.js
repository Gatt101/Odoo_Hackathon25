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

    // Get vote count for the answer
    const voteCount = await getVoteCount(id);

    res.json({
      message: 'Answer updated successfully',
      answer: {
        ...answer,
        voteCount
      }
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

// POST /api/answers/:id/vote - Vote on an answer (up/down)
router.post('/:id/vote', auth, async (req, res) => {
  try {
    const { id: answerId } = req.params;
    const { type } = req.body;

    // Validate vote type
    if (!type || !['up', 'down'].includes(type)) {
      return res.status(400).json({ error: 'Vote type must be "up" or "down"' });
    }

    // Check if answer exists
    const answer = await prisma.answer.findUnique({
      where: { id: answerId }
    });

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    // Check if user has already voted on this answer
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_answerId: {
          userId: req.user.id,
          answerId: answerId
        }
      }
    });

    const voteType = type.toUpperCase(); // Convert to enum value

    if (existingVote) {
      // If same vote type, remove the vote (toggle)
      if (existingVote.type === voteType) {
        await prisma.vote.delete({
          where: { id: existingVote.id }
        });
        
        // Get updated vote counts
        const voteCount = await getVoteCount(answerId);
        
        return res.json({
          message: 'Vote removed',
          voteCount,
          userVote: null
        });
      } else {
        // Different vote type, update the existing vote
        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { type: voteType }
        });
        
        // Get updated vote counts
        const voteCount = await getVoteCount(answerId);
        
        return res.json({
          message: 'Vote updated',
          voteCount,
          userVote: type
        });
      }
    } else {
      // Create new vote
      await prisma.vote.create({
        data: {
          type: voteType,
          userId: req.user.id,
          answerId: answerId
        }
      });
      
      // Get updated vote counts
      const voteCount = await getVoteCount(answerId);
      
      return res.json({
        message: 'Vote registered',
        voteCount,
        userVote: type
      });
    }
  } catch (error) {
    console.error('Error voting on answer:', error);
    res.status(500).json({ error: 'Failed to vote on answer' });
  }
});

// POST /api/answers/:id/accept - Accept an answer (only by question owner)
router.post('/:id/accept', auth, async (req, res) => {
  try {
    const { id: answerId } = req.params;

    // Get the answer with question info
    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
      include: {
        question: {
          select: {
            id: true,
            authorId: true
          }
        }
      }
    });

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    // Check if current user is the question owner
    if (answer.question.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Only the question owner can accept answers' });
    }

    // First, unaccept any currently accepted answer for this question
    await prisma.answer.updateMany({
      where: {
        questionId: answer.questionId,
        isAccepted: true
      },
      data: {
        isAccepted: false
      }
    });

    // Accept this answer
    const updatedAnswer = await prisma.answer.update({
      where: { id: answerId },
      data: { isAccepted: true },
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

    // Get vote count for the answer
    const voteCount = await getVoteCount(answerId);

    res.json({
      message: 'Answer accepted successfully',
      answer: {
        ...updatedAnswer,
        voteCount
      }
    });
  } catch (error) {
    console.error('Error accepting answer:', error);
    res.status(500).json({ error: 'Failed to accept answer' });
  }
});

// Helper function to get vote count for an answer
async function getVoteCount(answerId) {
  const votes = await prisma.vote.groupBy({
    by: ['type'],
    where: { answerId },
    _count: {
      type: true
    }
  });

  const upVotes = votes.find(v => v.type === 'UP')?._count?.type || 0;
  const downVotes = votes.find(v => v.type === 'DOWN')?._count?.type || 0;

  return {
    upVotes,
    downVotes,
    total: upVotes - downVotes
  };
}

module.exports = router; 