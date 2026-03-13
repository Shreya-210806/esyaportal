const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Bill = require("../models/Bill");
const Payment = require("../models/Payment");
const MasterData = require("../models/MasterData");
const NewConnectionApplication = require("../models/NewConnectionApplication");

const Activity = require("../models/Activity");

// Get Aggregate Stats for Dashboard
router.get("/stats", async (req, res) => {
  try {
    const totalConsumers = await User.countDocuments({ role: { $ne: "admin" } });
    const totalMasterRecords = await MasterData.countDocuments();
    
    // Sum total revenue from payments
    const payments = await Payment.find({ status: "success" });
    const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

    const pendingBillsCount = await Bill.countDocuments({ status: "Pending" });

    res.status(200).json({
      success: true,
      stats: {
        totalConsumers,
        totalMasterRecords,
        totalRevenue,
        pendingBillsCount
      }
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch stats" });
  }
});

// Get Recent Activities
router.get("/activities", async (req, res) => {
  try {
    const activities = await Activity.find().sort({ timestamp: -1 }).limit(50);
    res.status(200).json({ success: true, activities });
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ success: false, error: "Failed to fetch activities" });
  }
});

/* Import Master Data */
router.post("/import-masterdata", async (req, res) => {
  try {
    const data = req.body; // Expecting an array of objects
    if (!Array.isArray(data)) {
      return res.status(400).json({ success: false, error: "Data must be an array" });
    }
    
    // Insert many, ignoring duplicates if handled or we can drop/re-insert. For simplicity, just insert.
    await MasterData.insertMany(data, { ordered: false });
    res.status(200).json({ success: true, message: "Master data imported successfully" });
  } catch (error) {
    console.error("Import error:", error);
    // If it's a bulk write error (e.g. duplicates), we still return success but maybe partial
    res.status(500).json({ success: false, error: "Import encountered errors (might be duplicates)" });
  }
});

/* View Consumers */
router.get("/consumers", async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch consumers" });
  }
});

/* View Bills */
router.get("/bills", async (req, res) => {
  try {
    const bills = await Bill.find().sort({ dueDate: 1 });
    res.status(200).json({ success: true, bills });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch bills" });
  }
});

/* Payment History */
router.get("/payments", async (req, res) => {
  try {
    const payments = await Payment.find().sort({ date: -1 });
    res.status(200).json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch payments" });
  }
});

/* Approve User (If application process is used) */
router.put("/approve/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { applicationStatus: "approved" });
    res.status(200).json({ success: true, message: "User approved" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to approve user" });
  }
});

/* New Connection Applications */
router.get("/applications", async (req, res) => {
  try {
    const applications = await NewConnectionApplication.find().populate("userId").sort({ createdAt: -1 });
    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch applications" });
  }
});

module.exports = router;
