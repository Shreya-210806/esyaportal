const mongoose = require("mongoose");
const User = require("./models/User");
const generateBillsForUser = require("./utils/generateBills");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/portalpal";

async function generateBillsForAllUsers() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    // Generate bills for each user
    for (const user of users) {
      console.log(`Generating bills for user: ${user.name} (${user.email})`);
      await generateBillsForUser(user._id);
    }

    console.log("✅ Successfully generated bills for all users!");
  } catch (error) {
    console.error("Error generating bills for all users:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
}

// Run the script
generateBillsForAllUsers();