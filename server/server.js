import bodyParser from "body-parser";
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const paymentRoutes = require("./routes/paymentRoutes");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
  }
});
app.set("io", io);

io.on("connection", (socket) => {
  console.log("New Admin client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Admin client disconnected:", socket.id);
  });
});

const allowedOrigins = [
  "https://esyaportal.onrender.com",
  // add dev origin if you test locally:
  "http://localhost:5173",
  "http://localhost:3000"
];


// ================= CORS =================
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ================= BODY LIMIT FIX =================
// Increase payload size so PDF/JPG can be uploaded
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// ================= ROUTES =================
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// ✅ ADD THIS LINE FOR RAZORPAY PAYMENT
app.use("/api/payment", paymentRoutes);

// ================= ROOT CHECK =================
app.get("/", (req, res) => {
  res.send("API Running");
});

// ================= SEED DUMMY DATA =================
app.get("/api/seed-dummy-consumers", async (req, res) => {
  try {
    const User = require("./models/User");
    const Bill = require("./models/Bill");

    

    let createdCount = 0;

    for (let i = 0; i < dummyConsumers.length; i++) {
      const consumerNum = `CN-${10001 + i}`;
      
      // Check if consumer already exists
      const existingConsumer = await User.findOne({ consumerNumber: consumerNum });
      if (existingConsumer) {
        console.log(`Consumer ${consumerNum} already exists, skipping...`);
        continue;
      }

      const consumer = dummyConsumers[i];
      const meterNumber = `MTR${Math.floor(100000 + Math.random() * 900000)}`;

      // Create user
      const newUser = new User({
        name: consumer.name,
        email: consumer.email,
        password: "password123", // default password for demo
        contactNumber: consumer.phone,
        region: consumer.region,
        meterNumber,
        consumerNumber: consumerNum,
      });

      await newUser.save();
      createdCount++;

      // Generate 3 months of bills
      const months = ["January", "February", "Current"];
      const daysBack = [60, 30, 0];

      for (let j = 0; j < months.length; j++) {
        const bill = {
          userId: newUser._id,
          billNumber: `BILL-${consumerNum}-${months[j]}`,
          amount: Math.floor(800 + Math.random() * 2200),
          dueDate: new Date(Date.now() + (30 - daysBack[j]) * 24 * 60 * 60 * 1000),
          status: "Pending",
          createdAt: new Date(Date.now() - daysBack[j] * 24 * 60 * 60 * 1000),
        };
        await Bill.create(bill);
      }

      console.log(`Created consumer ${consumerNum} with 3 months of bills`);
    }

    res.status(200).json({
      success: true,
      message: `Successfully created ${createdCount} dummy consumers with 3 months of bills each`,
      consumersCreated: createdCount,
    });
  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// ================= MONGODB =================
const PORT = process.env.PORT || 5001;
const DEFAULT_DB_NAME = "test";

const MONGO_URI =
  process.env.MONGO_URI || `mongodb://localhost:27017/${DEFAULT_DB_NAME}`;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    const dbName = mongoose.connection.db.databaseName;

    console.log("MongoDB Connected Successfully");
    console.log(`Database: ${dbName}`);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);

    // start server even if DB fails (for testing)
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (without DB)`);
    });

  });

