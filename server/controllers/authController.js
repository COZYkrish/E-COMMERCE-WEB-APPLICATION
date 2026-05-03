const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * ── Auth Controllers ─────────────────────────────────────
 * All business logic for user registration and login.
 *
 * Controllers are kept thin:
 *  - Input validation → handled by express-validator middleware
 *  - Password hashing → handled by User model pre-save hook
 *  - Token generation → handled by generateToken utility
 *
 * This controller only orchestrates: validate → persist → respond
 */

// ─────────────────────────────────────────────────────────
//  @desc    Register a new user
//  @route   POST /api/auth/register
//  @access  Public
// ─────────────────────────────────────────────────────────
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Check if a user with this email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'An account with this email already exists');
  }

  // 2. Create the new user
  //    Password hashing happens automatically via the pre-save hook in User.js
  const user = await User.create({ name, email, password });

  // 3. Generate JWT for immediate login after registration
  const token = generateToken(user._id);

  // 4. Respond — 201 Created
  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

// ─────────────────────────────────────────────────────────
//  @desc    Login user and return JWT
//  @route   POST /api/auth/login
//  @access  Public
// ─────────────────────────────────────────────────────────
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Find user by email — explicitly select password (it's hidden by default)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    // Use a generic message — don't reveal whether the email exists
    throw new ApiError(401, 'Invalid email or password');
  }

  // 2. Check if account is active
  if (!user.isActive) {
    throw new ApiError(403, 'Your account has been deactivated. Contact support.');
  }

  // 3. Compare the entered password with the stored hash
  const isPasswordMatch = await user.matchPassword(password);
  if (!isPasswordMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // 4. Generate JWT
  const token = generateToken(user._id);

  // 5. Respond — 200 OK
  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

// ─────────────────────────────────────────────────────────
//  @desc    Get currently logged-in user's profile
//  @route   GET /api/auth/me
//  @access  Private (requires JWT)
// ─────────────────────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  // req.user is set by the protect middleware — no need to query DB again
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// ─────────────────────────────────────────────────────────
//  @desc    Update user profile (name, email)
//  @route   PUT /api/auth/profile
//  @access  Private (requires JWT)
// ─────────────────────────────────────────────────────────
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  // Find and update — only update fields that were actually sent
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,          // return the updated document
      runValidators: true // run schema validators on the update
    }
  );

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: updatedUser,
  });
});

// ─────────────────────────────────────────────────────────
//  @desc    Change password
//  @route   PUT /api/auth/change-password
//  @access  Private (requires JWT)
// ─────────────────────────────────────────────────────────
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Current password and new password are required');
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, 'New password must be at least 6 characters');
  }

  // Fetch user with password selected (hidden by default)
  const user = await User.findById(req.user._id).select('+password');

  // Verify current password
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  // Update — the pre-save hook will hash the new password automatically
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
};
