/**
 * Health-check route controller.
 * GET /api/health
 * Used to verify the server is alive (useful for monitoring tools / deployment checks).
 */
const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
};

module.exports = { healthCheck };
