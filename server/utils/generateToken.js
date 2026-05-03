const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT for a given user ID.
 *
 * The token contains the userId as payload.
 * It is signed with JWT_SECRET and expires per JWT_EXPIRE (.env).
 *
 * Usage:
 *   const token = generateToken(user._id);
 *
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {string} Signed JWT string
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },           // payload — keep it minimal
    process.env.JWT_SECRET,   // secret key from .env
    { expiresIn: process.env.JWT_EXPIRE || '7d' } // expiry
  );
};

module.exports = generateToken;
