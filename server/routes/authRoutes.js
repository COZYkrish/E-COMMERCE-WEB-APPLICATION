const express = require('express');
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin, validate } = require('../middleware/validators');

const router = express.Router();

/**
 * Auth Routes
 * ─────────────────────────────────────────────────────────
 * Base path: /api/auth
 *
 * Public:
 *   POST /api/auth/register  → Create account
 *   POST /api/auth/login     → Get JWT token
 *
 * Private (JWT required):
 *   GET  /api/auth/me               → Get logged-in user
 *   PUT  /api/auth/profile          → Update name/email
 *   PUT  /api/auth/change-password  → Change password
 *
 * Middleware chain example for register:
 *   validateRegister  ← express-validator rules run first
 *   validate          ← checks for errors, returns 422 if any
 *   registerUser      ← controller only runs if validation passes
 */

// ── Public routes
router.post('/register', validateRegister, validate, registerUser);
router.post('/login', validateLogin, validate, loginUser);

// ── Private routes (require valid JWT)
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
