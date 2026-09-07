import app from './src/app.js';
import config from './src/config/config.js';
import connectDB from "./src/config/db.js";
import { startSessionReminderScheduler } from './src/utils/sessionReminders.js';

// Local development only — Vercel handles its own lifecycle
if (process.env.NODE_ENV !== 'production') {
  const PORT = config.PORT || 5000;
  connectDB().then(() => {
    startSessionReminderScheduler();
    app.listen(PORT, () => {
      console.log(`Server is running locally on port ${PORT}`);
    });
  }).catch((err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  });
}

// Vercel imports this as a serverless function handler
export default app;