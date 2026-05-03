const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: require('path').join(__dirname, '../.env') });

const User = require('../models/User');
const Product = require('../models/Product');

const users = [
  { name: 'Admin User', email: 'admin@ecommerce.com', password: 'Admin@123', role: 'admin' },
  { name: 'John Doe', email: 'john@example.com', password: 'User@1234', role: 'user' },
  { name: 'Jane Smith', email: 'jane@example.com', password: 'User@1234', role: 'user' },
];

const products = [
  { title: 'Wireless Noise-Cancelling Headphones', description: 'Premium over-ear headphones with 30hr battery, active noise cancellation and Hi-Res audio support.', price: 2999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', stock: 50, rating: 4.7, numReviews: 128 },
  { title: 'Smart Watch Pro', description: 'Feature-rich smartwatch with health tracking, GPS, and 7-day battery life. Water resistant up to 50m.', price: 4499, category: 'Electronics', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', stock: 30, rating: 4.5, numReviews: 89 },
  { title: 'Wireless Mechanical Keyboard', description: 'RGB backlit mechanical keyboard with custom switches, multi-device Bluetooth connectivity.', price: 1799, category: 'Electronics', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500', stock: 25, rating: 4.6, numReviews: 67 },
  { title: 'Minimalist Leather Jacket', description: 'Genuine leather biker jacket with quilted lining. Slim fit, premium quality hide. Available in black.', price: 3499, category: 'Clothing', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', stock: 20, rating: 4.4, numReviews: 45 },
  { title: 'Premium Running Sneakers', description: 'Lightweight responsive foam midsole with breathable mesh upper. Ideal for road and trail running.', price: 1299, category: 'Clothing', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', stock: 60, rating: 4.3, numReviews: 112 },
  { title: 'Classic Cotton Hoodie', description: 'Heavyweight 400gsm French terry cotton hoodie. Relaxed fit, kangaroo pocket, ribbed cuffs.', price: 799, category: 'Clothing', image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500', stock: 80, rating: 4.2, numReviews: 98 },
  { title: 'JavaScript: The Good Parts', description: 'The authoritative guide to JavaScript best practices by Douglas Crockford. A must-read for all developers.', price: 349, category: 'Books', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500', stock: 100, rating: 4.8, numReviews: 234 },
  { title: 'Atomic Habits', description: 'Proven framework for improving every day by James Clear. Tiny changes, remarkable results.', price: 299, category: 'Books', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500', stock: 150, rating: 4.9, numReviews: 512 },
  { title: 'Stainless Steel Water Bottle', description: 'Double-wall vacuum insulated 1L bottle. Keeps drinks cold 24hrs, hot 12hrs. BPA free.', price: 599, category: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', stock: 75, rating: 4.5, numReviews: 88 },
  { title: 'Ergonomic Office Chair', description: 'Adjustable lumbar support, 3D armrests, breathable mesh back. Designed for 8+ hour comfort.', price: 8999, category: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1589384267710-7a170981ca78?w=500', stock: 15, rating: 4.6, numReviews: 43 },
  { title: 'Yoga Mat Premium', description: 'Extra thick 6mm non-slip yoga mat with alignment lines. Eco-friendly TPE material, carry strap included.', price: 699, category: 'Sports', image: 'https://images.unsplash.com/photo-1601925228008-0a0a9e6df2e1?w=500', stock: 40, rating: 4.4, numReviews: 76 },
  { title: 'Adjustable Dumbbell Set', description: 'Space-saving 5-52.5 lb adjustable dumbbell pair. 15 weight settings, durable resin material.', price: 5499, category: 'Sports', image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=500', stock: 12, rating: 4.7, numReviews: 55 },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Hash passwords manually (insertMany skips pre-save hooks)
    const hashedUsers = await Promise.all(
      users.map(async (u) => ({ ...u, password: await bcrypt.hash(u.password, 12) }))
    );
    await User.insertMany(hashedUsers);
    console.log(`✅ Created ${hashedUsers.length} users`);

    await Product.insertMany(products);
    console.log(`✅ Created ${products.length} products`);

    console.log('\n🎉 Seeding complete!\n');
    console.log('Admin → admin@ecommerce.com / Admin@123');
    console.log('User  → john@example.com / User@1234');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seedDB();
