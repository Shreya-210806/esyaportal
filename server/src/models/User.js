const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: {
    type: String,
    unique: true,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  contactNumber: {
    type: String,
    required: true,
  },

  region: {
    type: String,
    required: true,
  },

  consumerNumber: {
    type: String,
    unique: true,
    required: true,
  },

  meterNumber: {
    type: String,
    unique: true,
    required: true,
  },

  // Role-based access control
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  // New connection application status
  applicationStatus: {
    type: String,
    enum: ["none", "pending", "verified", "rejected"],
    default: "none",
  },

  isFirstLogin: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);