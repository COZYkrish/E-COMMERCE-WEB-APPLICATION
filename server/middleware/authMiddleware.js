const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

/**
 * ── protect middleware ───────────────────────────────────
 * Verifies the JWT from the Authorization header.
 * Attaches the authenticated user to req.user for downstream use.
 *
 * Expected header format:
 *   Authorization: Bearer <token>
 *
 * Throws 401 if:
 *  - Header is missing
 *  - Token is invalid / expired
 *  - User no longer exists in the DB (deleted after token issued)
 *  - Account is deactivated (isActive: false)
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Extract the token from the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized — no token provided');
  }

  // 2. Verify the token (throws JsonWebTokenError or TokenExpiredError on failure)
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3. Fetch the user from the DB (confirms user still exists)
  //    We explicitly select password:false — no need for it here
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError(401, 'Not authorized — user no longer exists');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account has been deactivated');
  }

  // 4. Attach user to the request object for use in controllers
  req.user = user;
  next();
});

/**
 * ── adminOnly middleware ─────────────────────────────────
 * Must be used AFTER `protect` (requires req.user to be set).
 * Denies access to non-admin users with a 403 Forbidden.
 *
 * Usage:
 *   router.post('/products', protect, adminOnly, createProduct);
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  throw new ApiError(403, 'Access denied — admins only');
};

module.exports = { protect, adminOnly };
