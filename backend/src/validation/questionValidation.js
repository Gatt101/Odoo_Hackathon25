const Joi = require('joi');

const createQuestionSchema = Joi.object({
  title: Joi.string()
    .min(10)
    .max(200)
    .required()
    .messages({
      'string.min': 'Title must be at least 10 characters long',
      'string.max': 'Title must not exceed 200 characters',
      'any.required': 'Title is required'
    }),
  description: Joi.string()
    .min(20)
    .max(10000)
    .required()
    .messages({
      'string.min': 'Description must be at least 20 characters long',
      'string.max': 'Description must not exceed 10000 characters',
      'any.required': 'Description is required'
    }),
  tags: Joi.array()
    .items(Joi.string().min(1).max(20))
    .min(1)
    .max(10)
    .required()
    .messages({
      'array.min': 'At least one tag is required',
      'array.max': 'Maximum 10 tags allowed',
      'any.required': 'Tags are required'
    })
});

const updateQuestionSchema = Joi.object({
  title: Joi.string()
    .min(10)
    .max(200)
    .optional()
    .messages({
      'string.min': 'Title must be at least 10 characters long',
      'string.max': 'Title must not exceed 200 characters'
    }),
  description: Joi.string()
    .min(20)
    .max(10000)
    .optional()
    .messages({
      'string.min': 'Description must be at least 20 characters long',
      'string.max': 'Description must not exceed 10000 characters'
    }),
  tags: Joi.array()
    .items(Joi.string().min(1).max(20))
    .min(1)
    .max(10)
    .optional()
    .messages({
      'array.min': 'At least one tag is required',
      'array.max': 'Maximum 10 tags allowed'
    })
});

const questionQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().min(1).max(100).optional(),
  tags: Joi.string().optional(), // comma-separated tags
  sortBy: Joi.string().valid('createdAt', 'updatedAt', 'title', 'answers', 'votes').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  filter: Joi.string().valid('all', 'answered', 'unanswered', 'accepted').default('all')
});

module.exports = {
  createQuestionSchema,
  updateQuestionSchema,
  questionQuerySchema
}; 