const ApiError = require('../utils/ApiError');

/**
 * Central error handling middleware for Express.
 * All errors thrown via `next(error)` or `throw new ApiError(...)` land here.
 *
 * Distinguishes between:
 *  - Operational errors (ApiError): Known, safe to expose to the client
 *  - Programming / unexpected errors: Internal 500 — don't leak details
 *
 * Handles specific Mongoose errors:
 *  - CastError     → 400 (bad MongoDB ID format)
 *  - ValidationError → 400 (schema validation failed)
 *  - Duplicate key → 400 (e.g., duplicate email on register)
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log in development only — don't pollute production logs
  if (process.env.NODE_ENV === 'development') {
    console.error('🔴 ERROR:', err);
  }

  // ── Mongoose: Bad ObjectId (e.g., /api/products/not-valid-id)
  if (err.name === 'CastError') {
    error = new ApiError(400, `Resource not found with id: ${err.value}`);
  }

  // ── Mongoose: Duplicate key (e.g., duplicate email on register)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new ApiError(400, `Duplicate value for field: ${field}`);
  }

  // ── Mongoose: Schema validation failure
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    error = new ApiError(400, message);
  }

  // ── JWT: Token invalid or expired
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token — please log in again');
  }
  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token expired — please log in again');
  }

  // Final response
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    // Stack trace only in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
