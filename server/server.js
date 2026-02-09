import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/db.js';
import errorHandler, { notFound } from './middleware/errorHandler.js';

// Import Routes
import userRoutes from './routes/user.routes.js';
import planRoutes from './routes/plan.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';
import announcementRoutes from './routes/announcement.routes.js';
import authRoutes from './routes/auth.routes.js';
import createDefaultAdmin from './utils/seedAdmin.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB().then(() => {
  // Seed Default Admin
  createDefaultAdmin();
});

const app = express();

// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions)); // Enable CORS with configuration
app.use(express.json()); // Body parser
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/announcements', announcementRoutes);

// Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Gym Portal API Running' });
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`\x1b[33m%s\x1b[0m`, `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
