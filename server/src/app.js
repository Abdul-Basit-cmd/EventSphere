import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import exhibitorProfileRoutes from './routes/exhibitorProfile.routes.js';
import expoRoutes from './routes/expo.routes.js';
import boothRoutes from './routes/booth.routes.js';
import scheduleRoutes from './routes/schedule.routes.js';
import registrationRoutes from './routes/registration.routes.js';
import inquiryRoutes from './routes/inquiry.routes.js';
import attendeeRoutes from './routes/attendee.routes.js';
import exhibitorDirectoryRoutes from './routes/exhibitorDirectory.routes.js';
import adminAnalyticsRoutes from './routes/adminAnalytics.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import globalErrorHandler from './middlewares/error.middleware.js';
import config from './config/config.js';

const app = express();

// 1. Ensure DB Connection on every Serverless Request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// 2. CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  config.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(express.json());
app.use(cookieParser());

// Root endpoint prevent 404/500 on base URL
app.get('/', (req, res) => {
  res.status(200).json({ status: 'Ok', message: 'EventSphere API is live' });
});

const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/expos`, expoRoutes);
app.use(`${API_PREFIX}/expos/:expoId/booths`, boothRoutes);
app.use(`${API_PREFIX}/expos/:expoId/sessions`, scheduleRoutes);
app.use(`${API_PREFIX}/expos/:expoId/registrations`, registrationRoutes);
app.use(`${API_PREFIX}/attendees`, attendeeRoutes);
app.use(`${API_PREFIX}/exhibitors`, exhibitorDirectoryRoutes);
app.use(`${API_PREFIX}/exhibitors`, exhibitorProfileRoutes);
app.use(`${API_PREFIX}/inquiries`, inquiryRoutes);
app.use(`${API_PREFIX}/notifications`, notificationRoutes);
app.use(`${API_PREFIX}/analytics`, adminAnalyticsRoutes);

app.get(`${API_PREFIX}/health`, (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  return res.status(200).json({ status: 'Ok', dbState, uptime: process.uptime(), timestamp: new Date() });
});

app.use(globalErrorHandler);

export default app;