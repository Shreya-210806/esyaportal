const express = require("express");
const router = express.Router();
const multer = require("multer");

const User = require("../models/User");
const Bill = require("../models/Bill");
const NewConnectionApplication = require("../models/NewConnectionApplication");
const MasterData = require("../models/MasterData");
const Activity = require("../models/Activity");
const generateBillsForUser = require("../utils/generateBills");

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
  },
  fileFilter: (req, file, cb) => {
    // Allow PDF, JPG, PNG files
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, and PNG are allowed.'), false);
    }
  }
});

// In-memory OTP store (in production, use Redis or database)
const otpStore = new Map();

// Helper: generate next sequential consumer number like CN-10001, CN-10002
async function generateNextConsumerNumber() {
  const lastUser = await User.findOne().sort({ createdAt: -1 }).lean();

  let base = 10000;

  if (lastUser && lastUser.consumerNumber) {
    const match = lastUser.consumerNumber.match(/CN-(\d+)/);
    if (match) {
      base = parseInt(match[1], 10);
    }
  }

  const next = base + 1;
  return `CN-${next}`;
}

// ================= OTP ENDPOINTS =================

// Send OTP to mobile number
router.post("/send-otp", async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile || mobile.length !== 10) {
      return res.status(400).json({
        success: false,
        error: "Valid 10-digit mobile number required",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with expiration (5 minutes)
    otpStore.set(mobile, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    // send via Twilio (or log if creds are missing)
    await sendSms(mobile, `Your OTP for Esyasoft Electricity Portal is: ${otp}. Valid for 5 minutes.`);

    console.log(`OTP sent to ${mobile}: ${otp}`);

    // return otp in response for demo purposes
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp, // include code so frontend can display it in demo
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send OTP",
    });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        error: "Mobile number and OTP are required",
      });
    }

    const storedOtp = otpStore.get(mobile);

    if (!storedOtp) {
      return res.status(400).json({
        success: false,
        error: "OTP not found or expired",
      });
    }

    if (Date.now() > storedOtp.expiresAt) {
      otpStore.delete(mobile);
      return res.status(400).json({
        success: false,
        error: "OTP expired",
      });
    }

    if (storedOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        error: "Invalid OTP",
      });
    }

    // OTP verified successfully
    otpStore.delete(mobile); // Clean up used OTP

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to verify OTP",
    });
  }
});

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, consumerNumber, contactNumber, region } = req.body;

    // Validate required fields
    if (!name || !email || !password || !consumerNumber || !contactNumber || !region) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already exists",
      });
    }

    // Validate against master data
    const masterDataEntry = await MasterData.findOne({
      Email: { $regex: new RegExp(`^${email}$`, 'i') },
      ConsumerNumber: consumerNumber
    });

    if (!masterDataEntry) {
      return res.status(400).json({
        success: false,
        error: "Registration failed: Email and Consumer Number do not match our records.",
      });
    }

    // Check if consumer number already registered
    const existingConsumer = await User.findOne({ consumerNumber });
    if (existingConsumer) {
      return res.status(400).json({
        success: false,
        error: "Consumer number already registered",
      });
    }

    const meterNumber = "MTR" + Math.floor(100000 + Math.random() * 900000);

    const newUser = new User({
      name,
      email,
      password,
      contactNumber,
      region,
      meterNumber,
      consumerNumber,
      // role will default to "user"
    });

    await newUser.save();

    // Generate 3 months of bills for the user
    await generateBillsForUser(newUser._id);
    
    // Log Activity
    try {
      const activity = new Activity({
        title: "New User Registered",
        description: `${name} (${email}) has registered for consumer number ${consumerNumber}`,
        type: "user",
        consumerNumber: consumerNumber
      });
      await activity.save();
      
      const io = req.app.get("io");
      if (io) {
        io.emit("new-activity", activity);
      }
    } catch (actErr) {
      console.error("Activity log error:", actErr);
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        phone: newUser.contactNumber,
        consumerNumber: newUser.consumerNumber,
        meterNumber: newUser.meterNumber,
        address: newUser.region,
        role: newUser.role,
        isFirstLogin: newUser.isFirstLogin,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// Twilio sms helper (real‑world verification)
// requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER env vars
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioFrom = process.env.TWILIO_FROM_NUMBER;
let twilioClient = null;

if (accountSid && authToken) {
  const twilio = require("twilio");
  twilioClient = twilio(accountSid, authToken);
} else {
  // Twilio credentials not set - using console logging for demo
}

async function sendSms(phone, message) {
  if (twilioClient && twilioFrom) {
    try {
      await twilioClient.messages.create({
        body: message,
        from: twilioFrom,
        to: phone,
      });
      console.log(`Twilio SMS sent to ${phone}`);
    } catch (err) {
      console.error("Twilio send error", err);
      // fallback to console log so OTP still appears during dev
      console.log(`[SMS-FALLBACK] To: ${phone} | Message: ${message}`);
    }
  } else {
    // fallback when credentials missing
    console.log(`[SMS] To: ${phone} | Message: ${message}`);
  }
}

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, consumerNumber, password } = req.body;

    if (!password || (!email && !consumerNumber)) {
      return res.status(400).json({
        success: false,
        error: "Email or consumer number and password are required",
      });
    }

    // Find user by email or consumer number
    const query = email ? { email } : { consumerNumber };
    const user = await User.findOne(query);

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Check password (plain text comparison for now - in production use bcrypt)
    if (user.password !== password) {
      return res.status(400).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    console.log("User logged in:", user._id);

    // Generate bills for the user
    await generateBillsForUser(user._id);

    // Fetch pending bills for the user
    const pendingBills = await Bill.find({ userId: user._id, billStatus: "Pending" });

    // Update isFirstLogin to false and save
    const isFirstLogin = user.isFirstLogin;
    if (user.isFirstLogin) {
      user.isFirstLogin = false;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.contactNumber,
        consumerNumber: user.consumerNumber,
        meterNumber: user.meterNumber,
        address: user.region,
        role: user.role || "user",
        applicationStatus: user.applicationStatus || "none",
        isFirstLogin: isFirstLogin,
      },
      bills: pendingBills.map(bill => ({
        id: bill._id.toString(),
        month: bill.month,
        amount: bill.billAmount,
        dueDate: bill.dueDate,
        status: bill.billStatus,
      })),
      hasPendingBills: pendingBills.length > 0,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// ================= GET BILLS BY CONSUMER NUMBER =================
router.get("/bills/:consumerNumber", async (req, res) => {
  try {
    const { consumerNumber } = req.params;

    if (!consumerNumber) {
      return res.status(400).json({
        success: false,
        error: "Consumer Number is required",
      });
    }

    // Try finding real bills
    let bills = await Bill.find({ consumerNumber: consumerNumber });

    if (bills.length === 0) {
      // Try generating bills dynamically
      const user = await User.findOne({ consumerNumber: consumerNumber });
      if (user) {
        await generateBillsForUser(user._id);
        bills = await Bill.find({ consumerNumber: consumerNumber });
      }
    }

    if (bills.length === 0) {
      // Mock bills for testing fallback
      bills = [
        {
          _id: `bill-${consumerNumber}-1`,
          consumerNumber: consumerNumber,
          consumerName: "Mock User",
          month: "January",
          unitsConsumed: Math.floor(100 + Math.random() * 300),
          billAmount: Math.floor(500 + Math.random() * 2000),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          billStatus: "Pending",
          paidDate: null,
          paidAmount: null,
        },
        {
          _id: `bill-${consumerNumber}-2`,
          consumerNumber: consumerNumber,
          consumerName: "Mock User",
          month: "February",
          unitsConsumed: Math.floor(100 + Math.random() * 300),
          billAmount: Math.floor(500 + Math.random() * 2000),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          billStatus: "Pending",
          paidDate: null,
          paidAmount: null,
        }
      ];
    }

    res.status(200).json({
      success: true,
      bills: bills,
    });
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// ================= PAY BILL =================
router.post("/pay-bill", async (req, res) => {
  try {
    const { billId, method, amount, userId, consumerNumber } = req.body;

    if (!billId || !method || !amount || !userId) {
      return res.status(400).json({
        success: false,
        error: "Bill ID, payment method, amount, and user ID are required",
      });
    }

    // Mock payment processing
    const payment = {
      id: `pay-${Date.now()}`,
      transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 9999)}`,
      userId,
      billId,
      billNumber: `BILL${Math.floor(100000 + Math.random() * 900000)}`,
      amount,
      method,
      status: 'success',
      dateTime: new Date().toISOString(),
      consumerNumber: consumerNumber || "",
    };

    console.log("Payment processed successfully:", payment);

    res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      payment,
    });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// ================= SUBMIT APPLICATION =================
router.post("/applications", upload.fields([
  { name: 'idProof', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 },
  { name: 'otherDocument', maxCount: 1 }
]), async (req, res) => {
  try {
    const applicationData = req.body;
    const files = req.files || {};

    console.log("Received application submission:", {
      name: applicationData.name,
      email: applicationData.email,
      hasIdProof: !!(files.idProof && files.idProof[0]),
      hasAddressProof: !!(files.addressProof && files.addressProof[0]),
      hasOtherDocument: !!(files.otherDocument && files.otherDocument[0]),
    });

    // Convert files to base64 for storage (optional - you could save files to disk instead)
    const processFile = (fileArray) => {
      if (!fileArray || !fileArray[0]) return null;
      const file = fileArray[0];
      return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    };

    const processedData = {
      ...applicationData,
      idProof: processFile(files.idProof),
      addressProof: processFile(files.addressProof),
      otherDocument: processFile(files.otherDocument),
    };

    // Find or create user by mobile number
    let user = await User.findOne({ contactNumber: applicationData.phone });

    if (!user) {
      // Create new user account
      const meterNumber = "MTR" + Math.floor(100000 + Math.random() * 900000);
      const consumerNumber = await generateNextConsumerNumber();

      user = new User({
        name: applicationData.fullName || applicationData.name,
        email: applicationData.email,
        password: applicationData.password, // Plain text for now (should hash in production)
        contactNumber: applicationData.phone,
        region: applicationData.region || applicationData.address,
        meterNumber,
        consumerNumber,
        applicationStatus: "pending",
      });

      await user.save();
    }

    // For testing/demo purposes, provide default values if files are missing
    const idProofData = processedData.idProof || "data:text/plain;base64,VGhpcyBpcyBhIGRlbW8gSUQgUHJvb2Y=";
    const addressProofData = processedData.addressProof || "data:text/plain;base64,VGhpcyBpcyBhIGRlbW8gQWRkcmVzcyBQcm9vZg==";

    // Create new connection application
    const newApplication = new NewConnectionApplication({
      userId: user._id,
      name: applicationData.fullName || user.name,
      contactNumber: applicationData.phone,
      idProof: idProofData,
      addressProof: addressProofData,
      otherDocument: processedData.otherDocument,
      status: "pending",
    });

    await newApplication.save();

    // Update user's application status
    user.applicationStatus = "pending";
    await user.save();
    
    // Log Activity
    try {
      const activity = new Activity({
        title: "New Connection Application",
        description: `${applicationData.fullName || user.name} requested a new connection`,
        type: "user",
        consumerNumber: user.consumerNumber || ""
      });
      await activity.save();
      
      const io = req.app.get("io");
      if (io) {
        io.emit("new-activity", activity);
      }
    } catch (actErr) {
      console.error("Activity log error:", actErr);
    }

    // Mock application processing
    const applicationNumber = `APP${Date.now()}${Math.floor(Math.random() * 9999)}`;

    res.status(201).json({
      success: true,
      message: "Application submitted successfully! Your account has been created and you can now login.",
      application: {
        applicationNumber,
        status: "pending",
        submittedAt: new Date().toISOString(),
        estimatedProcessingTime: "2-3 business days",
      },
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        consumerNumber: user.consumerNumber,
      },
    });
  } catch (error) {
    console.error("Application submission error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// ================= ADMIN: GET ALL USERS =================
router.get("/", async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({
      success: true,
      users: users.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        phone: u.contactNumber,
        consumerNumber: u.consumerNumber,
        meterNumber: u.meterNumber,
        address: u.region,
        role: u.role || "user",
        createdAt: u.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// ================= ADMIN: UPDATE USER ROLE =================
router.patch("/:id/role", async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        error: "Invalid role",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.contactNumber,
        consumerNumber: user.consumerNumber,
        meterNumber: user.meterNumber,
        address: user.region,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// ================= ADMIN: DELETE USER =================
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Optionally, also delete related bills
    await Bill.deleteMany({ userId: user._id });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// ================= NEW CONNECTION APPLICATIONS =================

// Create a new connection application for a user
router.post("/:userId/applications", async (req, res) => {
  console.log("Application creation route hit for user:", req.params.userId);
  try {
    console.log("Creating application for user:", req.params.userId);
    const { userId } = req.params;
    const {
      connectionType,
      fullName,
      email,
      phone,
      address,
      region,
      idProofType,
      idProofNumber,
      idProof,
      addressProof,
      otherDocument,
      remarks
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (!idProof || !addressProof) {
      return res.status(400).json({
        success: false,
        error: "ID proof and address proof are required",
      });
    }

    // Generate consumer number for new applications
    const consumerNumber = await generateNextConsumerNumber();

    // If an old application exists, overwrite its status
    let application = await NewConnectionApplication.findOne({ userId });

    if (!application) {
      application = new NewConnectionApplication({
        userId,
        idProof,
        addressProof,
        otherDocument: otherDocument || "",
        status: "pending",
      });
    } else {
      application.idProof = idProof;
      application.addressProof = addressProof;
      application.otherDocument = otherDocument || "";
      application.status = "pending";
      application.approvedAt = null;
      application.rejectedAt = null;
      application.smsSentAt = null;
    }

    await application.save();

    user.applicationStatus = "pending";
    await user.save();

    // Send SMS with consumer number (placeholder)
    await sendSms(
      phone,
      `Your new connection application has been submitted. Your reference number is ${consumerNumber}. You will receive your consumer number within 12 hours after verification.`
    );

    return res.status(201).json({
      success: true,
      message: "New connection application submitted",
      application: {
        id: application._id.toString(),
        status: application.status,
        consumerNumber,
        createdAt: application.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// Get all applications for admin review
router.get("/applications", async (_req, res) => {
  try {
    const applications = await NewConnectionApplication.find()
      .populate("userId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications: applications.map((a) => ({
        id: a._id.toString(),
        status: a.status,
        createdAt: a.createdAt,
        approvedAt: a.approvedAt,
        rejectedAt: a.rejectedAt,
        smsSentAt: a.smsSentAt,
        user: a.userId && {
          id: a.userId._id.toString(),
          name: a.userId.name,
          email: a.userId.email,
          phone: a.userId.contactNumber,
          consumerNumber: a.userId.consumerNumber,
          role: a.userId.role,
        },
      })),
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// Get a single user's application (for dashboard status)
router.get("/applications/user/:userId", async (req, res) => {
  try {
    const application = await NewConnectionApplication.findOne({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    if (!application) {
      return res.status(404).json({
        success: false,
        error: "No application found",
      });
    }

    res.status(200).json({
      success: true,
      application: {
        id: application._id.toString(),
        status: application.status,
        createdAt: application.createdAt,
        approvedAt: application.approvedAt,
        rejectedAt: application.rejectedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching user application:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// Get application status by mobile number (for public tracking)
router.get("/application-status/:mobile", async (req, res) => {
  try {
    const { mobile } = req.params;

    if (!mobile || mobile.length !== 10) {
      return res.status(400).json({
        success: false,
        error: "Valid 10-digit mobile number required",
      });
    }

    const user = await User.findOne({ contactNumber: mobile });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "No user found with this mobile number",
      });
    }

    const application = await NewConnectionApplication.findOne({
      userId: user._id,
    }).sort({ createdAt: -1 });

    if (!application) {
      return res.status(404).json({
        success: false,
        error: "No application found for this mobile number",
      });
    }

    res.status(200).json({
      success: true,
      application: {
        id: application._id.toString(),
        status: application.status,
        createdAt: application.createdAt,
        approvedAt: application.approvedAt,
        rejectedAt: application.rejectedAt,
        consumerNumber: user.consumerNumber,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Error fetching application status:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// ================= PUBLIC APPLICATION SUBMISSION =================

// Submit new connection application (public route)
router.post("/applications", async (req, res) => {
  console.log("Public application submission route hit");
  try {
    const {
      fullName,
      email,
      phone,
      address,
      region,
      idProof,
      addressProof,
      otherDocument,
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !address || !region || !idProof || !addressProof) {
      return res.status(400).json({
        success: false,
        error: "All required fields must be provided",
      });
    }

    // Check if user already exists
    let user = await User.findOne({ contactNumber: phone });

    if (!user) {
      // Create new user
      const meterNumber = "MTR" + Math.floor(100000 + Math.random() * 900000);
      const consumerNumber = await generateNextConsumerNumber();

      user = new User({
        name: fullName,
        email,
        password: Math.random().toString(36).slice(-8), // Temporary password
        contactNumber: phone,
        region: address, // Using address as region for now
        meterNumber,
        consumerNumber,
        role: "user",
        applicationStatus: "pending",
        isFirstLogin: true,
      });

      await user.save();
    }

    // Check if application already exists
    let application = await NewConnectionApplication.findOne({ userId: user._id });

    if (application) {
      // Update existing application
      application.idProof = idProof;
      application.addressProof = addressProof;
      application.otherDocument = otherDocument || "";
      application.status = "pending";
      application.approvedAt = null;
      application.rejectedAt = null;
      application.smsSentAt = null;
    } else {
      // Create new application
      application = new NewConnectionApplication({
        userId: user._id,
        idProof,
        addressProof,
        otherDocument: otherDocument || "",
        status: "pending",
      });
    }

    await application.save();

    // Send SMS notification
    await sendSms(
      phone,
      `Your new connection application has been submitted. Your reference number is ${user.consumerNumber}. You will receive your consumer number within 2 minutes after verification.`
    );

    // Simulate auto-approval after 2 minutes for demo
    setTimeout(async () => {
      try {
        const updatedApplication = await NewConnectionApplication.findById(application._id);
        if (updatedApplication && updatedApplication.status === "pending") {
          updatedApplication.status = "verified";
          updatedApplication.approvedAt = new Date();
          await updatedApplication.save();

          user.applicationStatus = "verified";
          await user.save();

          // Send approval SMS
          await sendSms(
            phone,
            `Your electricity connection has been approved! Consumer Number: ${user.consumerNumber}.`
          );

          console.log(`Application auto-approved for ${phone} after 2 minutes`);
        }
      } catch (error) {
        console.error("Error auto-approving application:", error);
      }
    }, 2 * 60 * 1000); // 2 minutes

    res.status(201).json({
      success: true,
      message: "New connection application submitted successfully",
      application: {
        id: application._id.toString(),
        status: application.status,
        consumerNumber: user.consumerNumber,
        createdAt: application.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// Approve / reject application
router.patch("/applications/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "verified", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status",
      });
    }

    const application = await NewConnectionApplication.findById(
      req.params.id
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        error: "Application not found",
      });
    }

    const user = await User.findById(application.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found for this application",
      });
    }

    application.status = status;

    if (status === "verified") {
      application.approvedAt = new Date();
      application.rejectedAt = null;

      // Ensure user has a consumer number (should already exist from registration)
      if (!user.consumerNumber) {
        user.consumerNumber = await generateNextConsumerNumber();
      }

      user.applicationStatus = "verified";

      // Simulate SMS send with consumer number
      await sendSms(
        user.contactNumber,
        `Your electricity connection has been approved. Consumer Number: ${user.consumerNumber}. You will receive SMS confirmation within 12 hours.`
      );

      application.smsSentAt = new Date();
    } else if (status === "rejected") {
      application.rejectedAt = new Date();
      application.approvedAt = null;
      user.applicationStatus = "rejected";
    }

    await application.save();
    await user.save();

    res.status(200).json({
      success: true,
      application: {
        id: application._id.toString(),
        status: application.status,
        approvedAt: application.approvedAt,
        rejectedAt: application.rejectedAt,
        smsSentAt: application.smsSentAt,
      },
    });
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// ================= GET USER BILLS =================
router.get("/bills/:userId", async (req, res) => {
  try {
    console.log("Fetching bills for user:", req.params.userId);

    const bills = await Bill.find({ userId: req.params.userId });

    res.status(200).json({
      success: true,
      bills,
    });
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// ================= PAY BILL =================
router.post("/bills/:billId/pay", async (req, res) => {
  try {
    const { billId } = req.params;
    const { userId, paidAmount } = req.body;

    if (!billId || !userId) {
      return res.status(400).json({
        success: false,
        error: "Bill ID and User ID are required",
      });
    }

    const bill = await Bill.findById(billId);

    if (!bill) {
      return res.status(404).json({
        success: false,
        error: "Bill not found",
      });
    }

    if (bill.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized",
      });
    }

    // Update bill status to Paid
    bill.billStatus = "Paid";
    bill.paidDate = new Date();
    bill.paidAmount = paidAmount || bill.billAmount;

    await bill.save();

    res.status(200).json({
      success: true,
      message: "Bill paid successfully",
      bill: {
        id: bill._id.toString(),
        month: bill.month,
        amount: bill.billAmount,
        status: bill.billStatus,
        paidAmount: bill.paidAmount,
        paidDate: bill.paidDate,
      },
    });
  } catch (error) {
    console.error("Error paying bill:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// ================= DOWNLOAD BILL =================
router.get("/bills/:billId/download", async (req, res) => {
  try {
    const { billId } = req.params;
    const { userId } = req.query;

    if (!billId || !userId) {
      return res.status(400).json({
        success: false,
        error: "Bill ID and User ID are required",
      });
    }
    if (billId.startsWith("bill-")) {
      return res.status(400).json({
        success: false,
        error: "Cannot download a mock bill. Please refresh to load your real bills."
      });
    }

    const bill = await Bill.findById(billId).populate("userId");

    if (!bill) {
      return res.status(404).json({
        success: false,
        error: "Bill not found",
      });
    }

    if (bill.userId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized",
      });
    }

    // Return bill data as downloadable JSON/CSV
    // In production, you would generate a PDF here
    const billData = {
      month: bill.month,
      amount: bill.billAmount,
      dueDate: bill.dueDate,
      status: bill.billStatus,
      consumerName: bill.consumerName,
      consumerNumber: bill.consumerNumber,
      email: bill.userId.email,
      phone: bill.userId.contactNumber,
      meterNumber: bill.userId.meterNumber,
      address: bill.userId.region,
      issuedDate: bill.createdAt || new Date(),
      paidDate: bill.paidDate,
      paidAmount: bill.paidAmount,
    };

    // Set response headers for file download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${bill.month}_Bill.json"`
    );
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(billData, null, 2));
  } catch (error) {
    console.error("Error downloading bill:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

module.exports = router;
