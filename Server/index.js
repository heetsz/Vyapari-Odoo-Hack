import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from './helpers/db.js';

// BOTH IMPORTS KEPT
import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();

// Global middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS for frontend
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// Cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET || "dev_secret"));

// ROUTES
app.use('/api', authRouter);              // auth routes
app.use("/api/products", productRoutes);  // product routes
app.use("/api/categories", categoryRoutes); // category routes

// DB
connectDB().catch((err) => {
  console.error("Initial DB connection error:", err.message);
  process.exit(1);
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running', status: 'OK' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: 'Internal Server Error', error: err.message });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
