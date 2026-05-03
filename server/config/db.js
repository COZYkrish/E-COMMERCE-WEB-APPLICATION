const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the MONGO_URI from environment variables.
 * Exits the process if the connection fails — this is intentional for production safety.
 * The `useNewUrlParser` and `useUnifiedTopology` options are handled automatically in Mongoose 7+.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit the process with failure code — no point running without a DB
    process.exit(1);
  }
};

module.exports = connectDB;
