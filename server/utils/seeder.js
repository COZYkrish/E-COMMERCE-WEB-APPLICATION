/**
 * Seed Script — Creates sample users in MongoDB
 * ─────────────────────────────────────────────
 * Run once to populate your DB with test data.
 *
 * Usage:
 *   node server/utils/seeder.js
 *
 * This script:
 *  1. Connects to MongoDB
 *  2. Clears the Users collection
 *  3. Creates 1 Admin + 2 regular Users
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load env vars
dotenv.config({ path: '../.env' });

const seedUsers = [
  {
    name: 'Admin User',
    email: 'admin@ecommerce.com',
    password: 'Admin@123',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'User@1234',
    role: 'user',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'User@1234',
    role: 'user',
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected for seeding');

    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Insert seed users (passwords will be hashed by the pre-save hook)
    const createdUsers = await User.insertMany(seedUsers);
    console.log(`✅ Created ${createdUsers.length} users:`);
    createdUsers.forEach((u) =>
      console.log(`   → ${u.role.toUpperCase()}: ${u.email}`)
    );

    console.log('\n🎉 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDB();
