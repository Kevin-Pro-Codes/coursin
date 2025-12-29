const { body } = require('express-validator');

const contactValidationRules = () => {
  return [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please enter a valid email address')
      .normalizeEmail(),
    
    body('phone')
      .optional({ checkFalsy: true })
      .trim()
      .matches(/^[\+]?[1-9][\d]{0,15}$/)
      .withMessage('Please enter a valid phone number'),
    
    body('courseInterest')
      .optional()
      .isIn(['web-development', 'data-science', 'design', 'mobile-dev', 'ai-ml', 'business', 'other', ''])
      .withMessage('Invalid course interest selected'),
    
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message is required')
      .isLength({ min: 10, max: 2000 })
      .withMessage('Message must be between 10 and 2000 characters'),
    
    body('subscribe')
      .optional()
      .isBoolean()
      .withMessage('Subscribe must be a boolean value')
  ];
};

module.exports = contactValidationRules;