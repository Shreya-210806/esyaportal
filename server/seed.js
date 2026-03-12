const mongoose = require("mongoose");
const User = require("./models/User");
const Bill = require("./models/Bill");
require("dotenv").config();

const dummyUsers = [
  {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@gmail.com",
    password: "password123",
    confirmPassword: "password123",
    contactNumber: "9876543210",
    region: "Thane, Maharashtra",
    consumerNumber: "CN-10001",
    meterNumber: "MTR100001"
  },
  {
    name: "Priya Singh",
    email: "priya.singh@gmail.com",
    password: "password123",
    confirmPassword: "password123",
    contactNumber: "9876543211",
    region: "Mumbai, Maharashtra",
    consumerNumber: "CN-10002",
    meterNumber: "MTR100002"
  },
  {
    name: "Amit Patel",
    email: "amit.patel@gmail.com",
    password: "password123",
    confirmPassword: "password123",
    contactNumber: "9876543212",
    region: "Pune, Maharashtra",
    consumerNumber: "CN-10003",
    meterNumber: "MTR100003"
  },
  {
    name: "Neha Gupta",
    email: "neha.gupta@gmail.com",
    password: "password123",
    confirmPassword: "password123",
    contactNumber: "9876543213",
    region: "Thane, Maharashtra",
    consumerNumber: "CN-10004",
    meterNumber: "MTR100004"
  },
  {
    name: "Vikram Shah",
    email: "vikram.shah@gmail.com",
    password: "password123",
    confirmPassword: "password123",
    contactNumber: "9876543214",
    region: "Mumbai, Maharashtra",
    consumerNumber: "CN-10005",
    meterNumber: "MTR100005"
  },
  {
    name: "Anjali Desai",
    email: "anjali.desai@gmail.com",
    password: "password123",
    confirmPassword: "password123",
    contactNumber: "9876543215",
    region: "Pune, Maharashtra",
    consumerNumber: "CN-10006",
    meterNumber: "MTR100006"
  },
  {
    name: "Rohit Verma",
    email: "rohit.verma@gmail.com",
    password: "password123",
    confirmPassword: "password123",
    contactNumber: "9876543216",
    region: "Thane, Maharashtra",
    consumerNumber: "CN-10007",
    meterNumber: "MTR100007"
  },
  {
    name: "Sneha Joshi",
    email: "sneha.joshi@gmail.com",
    password: "password123",
    confirmPassword: "password123",
    contactNumber: "9876543217",
    region: "Mumbai, Maharashtra",
    consumerNumber: "CN-10008",
    meterNumber: "MTR100008"
  },
  {
    name: "Arjun Reddy",
    email: "arjun.reddy@gmail.com",
    password: "password123",
    confirmPassword: "password123",
    contactNumber: "9876543218",
    region: "Pune, Maharashtra",
    consumerNumber: "CN-10009",
    meterNumber: "MTR100009"
  },
  {
    name: "Kavya Nair",
    email: "kavya.nair@gmail.com",
    password: "password123",
    confirmPassword: "password123",
    contactNumber: "9876543219",
    region: "Thane, Maharashtra",
    consumerNumber: "CN-10010",
    meterNumber: "MTR100010"
  }
];

const generateThreeMonthsBills = async (userId, consumerNumber) => {
  const billingMonths = [
    { month: "January", daysBack: 60 },
    { month: "February", daysBack: 30 },
    { month: "Current", daysBack: 0 },
  ];

  for (const monthData of billingMonths) {
    const bill = {
      userId: userId,
      billNumber: `BILL-${consumerNumber}-${monthData.month}`,
      amount: Math.floor(800 + Math.random() * 2200),
      dueDate: new Date(Date.now() + (30 - monthData.daysBack) * 24 * 60 * 60 * 1000),
      status: "Pending",
      createdAt: new Date(Date.now() - monthData.daysBack * 24 * 60 * 60 * 1000),
    };
    await Bill.create(bill);
  }
};

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/test";
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    let createdCount = 0;

    for (const userData of dummyUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [
          { email: userData.email },
          { consumerNumber: userData.consumerNumber }
        ]
      });

      if (existingUser) {
        console.log(`User ${userData.email} (${userData.consumerNumber}) already exists, skipping...`);
        continue;
      }

      // Create new user
      const newUser = new User({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        contactNumber: userData.contactNumber,
        region: userData.region,
        consumerNumber: userData.consumerNumber,
        meterNumber: userData.meterNumber,
        role: "user",
        applicationStatus: "none",
        isFirstLogin: true
      });

      await newUser.save();
      console.log(`Created user: ${userData.name} (${userData.consumerNumber})`);

      // Generate 3 months of bills
      await generateThreeMonthsBills(newUser._id, userData.consumerNumber);
      console.log(`Generated 3 months of bills for ${userData.consumerNumber}`);

      createdCount++;
    }

    console.log(`\n✅ Successfully created ${createdCount} dummy users with 3 months of bills each!`);
    console.log("\n📋 Dummy Users Created:");
    dummyUsers.forEach(user => {
      console.log(`   ${user.consumerNumber}: ${user.name} - ${user.email} (Password: ${user.password})`);
    });

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
};

// Run the seed function
seedDatabase();