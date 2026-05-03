/**
 * ─────────────────────────────────────────────────────────
 *  E-Commerce API Server — Entry Point
 *  server.js
 * ─────────────────────────────────────────────────────────
 *
 *  Responsibilities:
 *   1. Load environment variables (.env)
 *   2. Connect to MongoDB
 *   3. Register all Express middleware (cors, helmet, morgan, json)
 *   4. Mount all API route groups
 *   5. Register 404 + global error handling middleware
 *   6. Start the HTTP server
 */

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// ── Load .env variables FIRST (before any other module needs them)
dotenv.config();

// ── Internal imports
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

// ── Connect to MongoDB
connectDB();

// ── Create Express app
const app = express();

// ─────────────────────────────────────────────────────────
//  Global Middleware
// ─────────────────────────────────────────────────────────

// Security headers (XSS, clickjacking, etc.)
app.use(helmet());

// CORS — allow requests from the React dev server
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // allow cookies / auth headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  })
);

// HTTP request logger (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Parse JSON bodies (up to 10mb for product images in base64 if needed)
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies (HTML form submissions)
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────────────────
//  API Routes
//  All routes are prefixed with /api
//  More route groups will be added in subsequent phases
// ─────────────────────────────────────────────────────────

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// ─────────────────────────────────────────────────────────
//  404 & Error Handling
//  Must be AFTER all routes
// ─────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─────────────────────────────────────────────────────────
//  Start Server
// ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║  🛍️  E-Commerce API Server              ║
  ║  🌐  http://localhost:${PORT}               ║
  ║  🔧  Environment: ${process.env.NODE_ENV}        ║
  ╚══════════════════════════════════════════╝
  `);
});

// ── Graceful shutdown — handle unhandled promise rejections
// (e.g., MongoDB disconnects mid-run)
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  // Close server gracefully then exit
  server.close(() => {
    console.log('Server closed due to unhandled rejection.');
    process.exit(1);
  });
});

module.exports = app;
