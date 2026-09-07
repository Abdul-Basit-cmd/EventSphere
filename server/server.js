import app from './src/app.js';
import config from './src/config/config.js';
import connectDB from "./src/config/db.js";
import { startSessionReminderScheduler } from './src/utils/sessionReminders.js';

const PORT = config.PORT || 5000;

// Only spin up server listener & background CRON locally
if (process.env.NODE_ENV !== 'production') {
  connectDB().then(() => {
    startSessionReminderScheduler();
    app.listen(PORT, () => {
      console.log(`Server is running locally on port ${PORT}`);
    });
  });
}

export default app;