// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import sessionRoutes from './routes/sessions.js';
import referralRoutes from './routes/referrals.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/referrals', referralRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    message: 'RefLink API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// Handle 404 - FIXED: Use proper Express 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    message: 'API route not found',
    path: req.originalUrl,
    method: req.method
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 RefLink server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});