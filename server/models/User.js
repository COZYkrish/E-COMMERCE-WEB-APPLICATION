const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * ───────────────────────────────────────────────────────
 * Represents a registered customer or admin in the system.
 *
 * Key design decisions:
 *  - Password is hashed via a pre-save Mongoose hook (never stored as plain text)
 *  - Role defaults to 'user' — admin must be set explicitly in DB or seed
 *  - `matchPassword` is an instance method for clean controller code
 *  - Timestamps: createdAt + updatedAt added automatically
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,           // enforces unique index in MongoDB
      lowercase: true,        // always store as lowercase
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // CRITICAL: never return password in queries by default
    },

    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'Role must be either user or admin',
      },
      default: 'user',
    },

    // Optional: profile picture URL (for future use)
    avatar: {
      type: String,
      default: '',
    },

    // Soft-delete / account suspension support
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields automatically
  }
);

// ─────────────────────────────────────────────────────────
//  Pre-save Hook — Hash password before saving
// ─────────────────────────────────────────────────────────
/**
 * This hook runs BEFORE every .save() call.
 * We only hash the password if it was modified (prevents re-hashing on unrelated updates).
 * Salt rounds = 12 → good balance of security and performance for 2024+.
 */
userSchema.pre('save', async function () {
  // Skip if password wasn't changed (e.g., updating name/email only)
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// ─────────────────────────────────────────────────────────
//  Instance Method — Compare plain password with hash
// ─────────────────────────────────────────────────────────
/**
 * Called during login to verify the entered password.
 *
 * Usage in controller:
 *   const isMatch = await user.matchPassword(enteredPassword);
 *
 * @param {string} enteredPassword - The raw password from the login form
 * @returns {boolean} - True if passwords match
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ─────────────────────────────────────────────────────────
//  toJSON transform — Strip sensitive fields from responses
// ─────────────────────────────────────────────────────────
/**
 * When the user object is serialized to JSON (e.g. in res.json()),
 * this transform strips the __v field and ensures password is never leaked
 * (belt-and-suspenders alongside `select: false`).
 */
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
