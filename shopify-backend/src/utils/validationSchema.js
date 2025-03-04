// src/utils/validationSchema.js
const Joi = require('joi');

const customerRegistrationSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Invalid email format',
      'any.required': 'Email is required'
    }),
  
  firstName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters'
    }),
  
  lastName: Joi.string()
    .min(2)
    .max(50)
    .required(),
  
  birthdate: Joi.date()
    .max('now')
    .iso()
    .required()
    .messages({
      'date.max': 'Birthdate cannot be in the future',
      'date.format': 'Invalid date format'
    }),
});

const productCreationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  vendor: Joi.string().optional(),
  productType: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  
  variants: Joi.array().items(Joi.object({
    color: Joi.string().required(),
    size: Joi.string().required(),
    price: Joi.number().positive().required(),
    inventory: Joi.number().integer().min(0).required()
  })).min(1).required()
});

module.exports = {
  validateCustomerRegistration: (data) => 
    customerRegistrationSchema.validate(data),
  
  validateProductCreation: (data) => 
    productCreationSchema.validate(data)
};