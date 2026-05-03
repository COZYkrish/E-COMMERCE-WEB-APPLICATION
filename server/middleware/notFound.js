/**
 * 404 Not Found middleware.
 * Catches requests to any route that doesn't exist.
 * Must be placed AFTER all route definitions in server.js.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = notFound;
