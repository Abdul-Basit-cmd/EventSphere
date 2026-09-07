import mongoose from "mongoose";
import config from "./config.js";

// Cached connection for serverless environments (Vercel)
let connectionPromise = null;

const connectDB = async () => {
  // Already connected
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // Connection in progress — reuse the same promise instead of opening a new one
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = mongoose
    .connect(config.MONGO_URI, {
      bufferCommands: false,
    })
    .then((db) => {
      console.log("MongoDB connected successfully");
      return db;
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error.message);
      connectionPromise = null; // Reset so next request can retry
      throw error;
    });

  return connectionPromise;
};

export default connectDB;