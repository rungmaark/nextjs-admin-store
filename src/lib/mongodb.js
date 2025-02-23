import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log("✅ Using existing MongoDB connection");
    return mongoose.connection; // 🔹 คืนค่า connection ออกมา
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
    return mongoose.connection; // 🔹 คืนค่า connection ออกมา
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("ไม่สามารถเชื่อมต่อฐานข้อมูลได้");
  }
};