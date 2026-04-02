import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected...");

    // Remove existing admin if any
    await User.deleteOne({ email: "admin@catholicstore.co.ke" });

    // Create admin user
    const admin = await User.create({
      firstName: "Store",
      lastName: "Admin",
      email: "admin@catholicstore.co.ke",
      phone: "700000000",
      password: "Admin@2026",
      role: "admin",
    });

    console.log("Admin user created!");
    console.log("Email:   ", admin.email);
    console.log("Password: Admin@2026");
    console.log("Role:    ", admin.role);

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

createAdmin();
