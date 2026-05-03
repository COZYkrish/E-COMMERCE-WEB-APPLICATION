/**
 * Wraps async route handlers to automatically forward errors to Express's error middleware.
 * This eliminates try/catch boilerplate in every controller.
 *
 * Usage:
 *   router.get('/products', asyncHandler(getProducts));
 *
 * @param {Function} fn - An async express route handler
 * @returns {Function} - A wrapped handler that catches and forwards errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
