import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './helpers/db.js';
<<<<<<< Updated upstream
import cors from "cors";
import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";

const app = express();
app.use(cors());
=======
import authRouter from './routes/auth.js';
>>>>>>> Stashed changes

dotenv.config();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// enable CORS for the Vite dev server (adjust origin as needed)
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
// use signed cookies with secret from env
app.use(cookieParser(process.env.COOKIE_SECRET || 'dev_secret'));

// mount auth routes
app.use('/api', authRouter);

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

connectDB().catch((err) => {
  console.error('Initial DB connection error:', err.message);
  process.exit(1);
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running', status: 'OK' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} `);
});
