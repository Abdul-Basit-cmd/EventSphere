import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../src/config/db.js";
import userModel from "../src/models/user.model.js";

const seedAdmin = async () => {
  try {
    await connectDB();
    
    const existing = await userModel.findOne({ role: "admin" });
    if (existing) {
      console.log("Admin already exists:", existing.email);
      process.exit(0);
    }
    
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error("Missing required environment variables: ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD");
      process.exit(1);
    }
    
    await userModel.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      passwordHash: ADMIN_PASSWORD,
      role: "admin",
      isVerified: true,
    });
    
    console.log(`Admin account created: ${ADMIN_EMAIL}`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
