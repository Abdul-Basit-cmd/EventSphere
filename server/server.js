import app from './src/app.js';
import config from './src/config/config.js';
import connectDB from "./src/config/db.js";
import { startSessionReminderScheduler } from './src/utils/sessionReminders.js';

connectDB().then(() => {
  startSessionReminderScheduler();
});


const PORT = config.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
