const Joi = require('joi');

const createAnswerSchema = Joi.object({
  content: Joi.string()
    .min(20)
    .max(10000)
    .required()
    .messages({
      'string.min': 'Answer content must be at least 20 characters long',
      'string.max': 'Answer content must not exceed 10000 characters',
      'any.required': 'Answer content is required'
    })
});

const updateAnswerSchema = Joi.object({
  content: Joi.string()
    .min(20)
    .max(10000)
    .required()
    .messages({
      'string.min': 'Answer content must be at least 20 characters long',
      'string.max': 'Answer content must not exceed 10000 characters',
      'any.required': 'Answer content is required'
    })
});

module.exports = {
  createAnswerSchema,
  updateAnswerSchema
}; 