const { body, validationResult } = require('express-validator');

/**
 * Reusable validation chains for auth routes.
 * These use express-validator to check inputs BEFORE they reach the controller.
 *
 * Pattern:
 *   router.post('/register', validateRegister, validate, registerUser);
 */

// ── Rules for POST /api/auth/register
const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters')
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain at least one number'),
];

// ── Rules for POST /api/auth/login
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

/**
 * Middleware that reads validation errors from express-validator
 * and returns a 422 response if any rules failed.
 * Must be placed AFTER validation rule arrays in the route chain.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
};

module.exports = { validateRegister, validateLogin, validate };
