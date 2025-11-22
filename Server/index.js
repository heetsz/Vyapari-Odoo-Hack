import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './helpers/db.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to database (uses helpers/db.js)
connectDB().catch((err) => {
  console.error('Initial DB connection error:', err.message);
  process.exit(1);
});

// Basic route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running', status: 'OK' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} `);
});
