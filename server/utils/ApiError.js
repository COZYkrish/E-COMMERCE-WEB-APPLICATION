/**
 * Custom API Error class that extends the native Error.
 * Used throughout controllers to throw standardized HTTP errors.
 *
 * Usage:
 *   throw new ApiError(404, 'Product not found');
 *   throw new ApiError(401, 'Not authorized');
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // marks it as a known, handled error

    // Capture stack trace — helps with debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
