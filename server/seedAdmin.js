require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function seedAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/portalpal";
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const adminEmail = "admin@esyasoft.com";
    
    // Check if the admin exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log("Admin user already exists! Updating role just in case...");
      existingAdmin.role = "admin";
      existingAdmin.password = "admin123";
      await existingAdmin.save();
      console.log("Admin credentials updated.");
    } else {
      console.log("Creating new admin user...");
      const newAdmin = new User({
        name: "Super Admin",
        email: adminEmail,
        password: "admin123", // In production you would hash this
        contactNumber: "0000000000",
        region: "Head Office",
        consumerNumber: "ADMIN-001",
        meterNumber: "ADMIN-MTR",
        role: "admin",
        applicationStatus: "verified",
        isFirstLogin: false
      });
      await newAdmin.save();
      console.log(`Successfully created admin user: ${adminEmail} / admin123`);
    }

  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

seedAdmin();
