import mongoose from "mongoose";
import config from "./config.js";

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  try {
    const db = await mongoose.connect(config.MONGO_URI, {
      bufferCommands: false,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    // Throw error so Express middleware can catch it instead of killing the process
    throw error;
  }
};

export default connectDB;