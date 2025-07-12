const express = require('express');
const { auth, ownerOrAdminAuth } = require('../middleware/auth');
const { createQuestionSchema, updateQuestionSchema, questionQuerySchema } = require('../validation/questionValidation');
const { createAnswerSchema } = require('../validation/answerValidation');
const { sanitizeContent, extractImageUrls } = require('../utils/sanitizer');
const prisma = require('../lib/prisma');

const router = express.Router();

// POST /api/questions - Create a new question
router.post('/', auth, async (req, res) => {
  try {
    // Validate request body
    const { error, value } = createQuestionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { title, description, tags } = value;

    // Sanitize the description to prevent XSS
    const sanitizedDescription = sanitizeContent(description);

    // Create the question
    const question = await prisma.question.create({
      data: {
        title,
        description: sanitizedDescription,
        tags,
        authorId: req.user.id
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
            answers: true,
            comments: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Question created successfully',
      question
    });
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
});

// GET /api/questions - Get all questions with filtering, search, and pagination
router.get('/', async (req, res) => {
  try {
    // Validate query parameters
    const { error, value } = questionQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { page, limit, search, tags, sortBy, sortOrder } = value;
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      where.tags = { hasSome: tagArray };
    }

    // Build orderBy clause
    let orderBy = {};
    if (sortBy === 'answers') {
      orderBy = {
        answers: {
          _count: sortOrder
        }
      };
    } else {
      orderBy[sortBy] = sortOrder;
    }

    // Get questions with pagination
    const [questions, totalCount] = await Promise.all([
      prisma.question.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatar: true
            }
          },
          answers: {
            select: {
              id: true,
              isAccepted: true
            }
          },
          _count: {
            select: {
              answers: true,
              comments: true
            }
          }
        }
      }),
      prisma.question.count({ where })
    ]);

    // Add vote counts and accepted answer status
    const questionsWithVotes = await Promise.all(
      questions.map(async (question) => {
        // Calculate total votes for all answers of this question
        let totalVotes = 0;
        
        for (const answer of question.answers) {
          const voteCount = await getVoteCount(answer.id);
          totalVotes += voteCount.total;
        }
        
        // Check if any answer is accepted
        const hasAcceptedAnswer = question.answers.some(answer => answer.isAccepted);
        
        return {
          ...question,
          totalVotes,
          hasAcceptedAnswer,
          // Remove detailed answers from the list view
          answers: undefined
        };
      })
    );

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      questions: questionsWithVotes,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// GET /api/questions/tags/popular - Get popular tags
router.get('/tags/popular', async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      select: { tags: true }
    });

    // Count tag occurrences
    const tagCounts = {};
    questions.forEach(question => {
      question.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // Sort by count and return top 20
    const popularTags = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([tag, count]) => ({ tag, count }));

    res.json({ popularTags });
  } catch (error) {
    console.error('Error fetching popular tags:', error);
    res.status(500).json({ error: 'Failed to fetch popular tags' });
  }
});

// GET /api/questions/:id - Get a single question by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
            bio: true
          }
        },
        answers: {
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
          },
          // Will sort manually after adding vote counts
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        _count: {
          select: {
            answers: true,
            comments: true
          }
        }
      }
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Add vote counts to answers
    const answersWithVotes = await Promise.all(
      question.answers.map(async (answer) => {
        const voteCount = await getVoteCount(answer.id);
        return {
          ...answer,
          voteCount
        };
      })
    );

    // Sort answers: accepted first, then by vote count (highest first), then by creation date
    const sortedAnswers = answersWithVotes.sort((a, b) => {
      // First, prioritize accepted answers
      if (a.isAccepted && !b.isAccepted) return -1;
      if (!a.isAccepted && b.isAccepted) return 1;
      
      // Then sort by vote count (highest first)
      const aVotes = a.voteCount?.total || 0;
      const bVotes = b.voteCount?.total || 0;
      if (aVotes !== bVotes) return bVotes - aVotes;
      
      // Finally, sort by creation date (newest first for tie-breaking)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    res.json({ 
      question: {
        ...question,
        answers: sortedAnswers
      }
    });
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

// PUT /api/questions/:id - Update a question (owner or admin only)
router.put('/:id', ownerOrAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate request body
    const { error, value } = updateQuestionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { title, description, tags } = value;

    // Prepare update data
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = sanitizeContent(description);
    if (tags) updateData.tags = tags;
    updateData.updatedAt = new Date();

    // Update the question
    const updatedQuestion = await prisma.question.update({
      where: { id },
      data: updateData,
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
            answers: true,
            comments: true
          }
        }
      }
    });

    res.json({
      message: 'Question updated successfully',
      question: updatedQuestion
    });
  } catch (error) {
    console.error('Error updating question:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.status(500).json({ error: 'Failed to update question' });
  }
});

// DELETE /api/questions/:id - Delete a question (owner or admin only)
router.delete('/:id', ownerOrAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the question (cascade will handle related records)
    await prisma.question.delete({
      where: { id }
    });

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

// POST /api/questions/:id/answers - Add answer (only authenticated users, one per user per question)
router.post('/:id/answers', auth, async (req, res) => {
  try {
    const { id: questionId } = req.params;

    // Validate request body
    const { error, value } = createAnswerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { content } = value;

    // Check if question exists
    const question = await prisma.question.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Check if user has already answered this question
    const existingAnswer = await prisma.answer.findFirst({
      where: {
        questionId: questionId,
        authorId: req.user.id
      }
    });

    if (existingAnswer) {
      return res.status(400).json({ error: 'You have already answered this question. You can edit your existing answer instead.' });
    }

    // Sanitize the content to prevent XSS
    const sanitizedContent = sanitizeContent(content);

    // Create the answer
    const answer = await prisma.answer.create({
      data: {
        content: sanitizedContent,
        questionId: questionId,
        authorId: req.user.id
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

    // Get vote count for the new answer (will be 0 initially)
    const voteCount = await getVoteCount(answer.id);

    res.status(201).json({
      message: 'Answer created successfully',
      answer: {
        ...answer,
        voteCount
      }
    });
  } catch (error) {
    console.error('Error creating answer:', error);
    res.status(500).json({ error: 'Failed to create answer' });
  }
});

// GET /api/questions/:id/answers - List all answers for a question
router.get('/:id/answers', async (req, res) => {
  try {
    const { id: questionId } = req.params;

    // Check if question exists
    const question = await prisma.question.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Get all answers for the question
    const answers = await prisma.answer.findMany({
      where: { questionId: questionId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      },
      // Will sort manually after adding vote counts
    });

    // Add vote counts to answers
    const answersWithVotes = await Promise.all(
      answers.map(async (answer) => {
        const voteCount = await getVoteCount(answer.id);
        return {
          ...answer,
          voteCount
        };
      })
    );

    // Sort answers: accepted first, then by vote count (highest first), then by creation date
    const sortedAnswers = answersWithVotes.sort((a, b) => {
      // First, prioritize accepted answers
      if (a.isAccepted && !b.isAccepted) return -1;
      if (!a.isAccepted && b.isAccepted) return 1;
      
      // Then sort by vote count (highest first)
      const aVotes = a.voteCount?.total || 0;
      const bVotes = b.voteCount?.total || 0;
      if (aVotes !== bVotes) return bVotes - aVotes;
      
      // Finally, sort by creation date (newest first for tie-breaking)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    res.json({
      answers: sortedAnswers,
      totalCount: sortedAnswers.length
    });
  } catch (error) {
    console.error('Error fetching answers:', error);
    res.status(500).json({ error: 'Failed to fetch answers' });
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