import dotenv from "dotenv";
dotenv.config();

if (!process.env.PORT) {
  console.log("PORT is missing in enviroment variables");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.log("JWT_SECRET is missing in enviroment variables");
  process.exit(1);
}
if (!process.env.MONGO_URI) {
  console.log("MONGO_URI is missing in enviroment variables");
  process.exit(1);
}
if (!process.env.NODE_ENV) {
  console.log("NODE_ENV is missing in enviroment variables");
  process.exit(1);
}
if (!process.env.FRONTEND_URL) {
  console.log("FRONTEND_URL is missing in enviroment variables");
  process.exit(1);
}
if (!process.env.BACKEND_URL) {
  console.log("BACKEND_URL is missing in enviroment variables");
  process.exit(1);
}
if (!process.env.SMTP_HOST) {
  console.log("SMTP_HOST is missing in enviroment variables");
  process.exit(1);
}
if (!process.env.SMTP_PORT) {
  console.log("SMTP_PORT is missing in enviroment variables");
  process.exit(1);
}
if (!process.env.SMTP_USER) {
  console.log("SMTP_USER is missing in enviroment variables");
  process.exit(1);
}
if (!process.env.SMTP_PASS) {
  console.log("SMTP_PASS is missing in enviroment variables");
  process.exit(1);
}
if (!process.env.EMAIL_FROM) {
  console.log("EMAIL_FROM is missing in enviroment variables");
  process.exit(1);
}

const config = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",
  MONGO_URI: process.env.MONGO_URI,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL || process.env.FRONTEND_URL,
  FRONTEND_URL: process.env.FRONTEND_URL,
  BACKEND_URL: process.env.BACKEND_URL,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: Number(process.env.SMTP_PORT),
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM,
  APP_NAME: process.env.APP_NAME,
}

export default config;
