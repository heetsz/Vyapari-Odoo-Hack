import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  const uri = process.env.MONGODB_STRING || process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set in .env');
    process.exit(1);
  }

  try {
    // Use default connection options; passing deprecated options causes errors
    const conn = await mongoose.connect(uri);
    console.log(`Database Connected`);
    return conn;
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    throw err;
  }
};

export const getConnection = () => mongoose.connection;

export default connectDB;

/**
 * Close the mongoose connection (useful for graceful shutdown)
 */
export const closeDB = async () => {
  try {
    await mongoose.connection.close(false);
    console.log('MongoDB connection closed');
  } catch (err) {
    console.error('Error closing MongoDB connection', err.message);
  }
};

// Graceful shutdown handlers
process.on('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await closeDB();
  process.exit(0);
});
