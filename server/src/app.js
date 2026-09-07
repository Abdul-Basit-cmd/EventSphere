import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // 1. CORS Import kiya
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
import { startSessionReminderScheduler } from './utils/sessionReminders.js';

const app = express();

// 2. CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true, // Cookies / Authorization headers pass karne ke liye
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(express.json());
app.use(cookieParser());

connectDB().then(() => {
  startSessionReminderScheduler();
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