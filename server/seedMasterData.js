const mongoose = require("mongoose");
const MasterData = require("./models/MasterData");
require("dotenv").config();

const masterDataEntries = [
  {
    ConsumerNumber: "CN-10001",
    Email: "rajesh.kumar@gmail.com",
    Phone: "9876543210"
  },
  {
    ConsumerNumber: "CN-10002",
    Email: "priya.singh@gmail.com",
    Phone: "9876543211"
  },
  {
    ConsumerNumber: "CN-10003",
    Email: "amit.patel@gmail.com",
    Phone: "9876543212"
  },
  {
    ConsumerNumber: "CN-10004",
    Email: "neha.gupta@gmail.com",
    Phone: "9876543213"
  },
  {
    ConsumerNumber: "CN-10005",
    Email: "vikram.shah@gmail.com",
    Phone: "9876543214"
  },
  {
    ConsumerNumber: "CN-10006",
    Email: "anjali.desai@gmail.com",
    Phone: "9876543215"
  },
  {
    ConsumerNumber: "CN-10007",
    Email: "rohit.verma@gmail.com",
    Phone: "9876543216"
  },
  {
    ConsumerNumber: "CN-10008",
    Email: "sneha.joshi@gmail.com",
    Phone: "9876543217"
  },
  {
    ConsumerNumber: "CN-10009",
    Email: "arjun.reddy@gmail.com",
    Phone: "9876543218"
  },
  {
    ConsumerNumber: "CN-10010",
    Email: "kavya.nair@gmail.com",
    Phone: "9876543219"
  },
  // Additional entries for testing
  {
    ConsumerNumber: "CN-20001",
    Email: "test.user1@gmail.com",
    Phone: "9876543220"
  },
  {
    ConsumerNumber: "CN-20002",
    Email: "test.user2@gmail.com",
    Phone: "9876543221"
  },
  {
    ConsumerNumber: "CN-20003",
    Email: "test.user3@gmail.com",
    Phone: "9876543222"
  },
  {
    ConsumerNumber: "CN-20004",
    Email: "test.user4@gmail.com",
    Phone: "9876543223"
  }
];

const seedMasterData = async () => {
  try {
    console.log("Connecting to MongoDB...");
    const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/test";
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    let createdCount = 0;

    for (const entry of masterDataEntries) {
      // Check if entry already exists
      const existingEntry = await MasterData.findOne({
        $or: [
          { ConsumerNumber: entry.ConsumerNumber },
          { Email: entry.Email }
        ]
      });

      if (existingEntry) {
        console.log(`Entry ${entry.ConsumerNumber} (${entry.Email}) already exists, skipping...`);
        continue;
      }

      // Create new entry
      const newEntry = new MasterData({
        ConsumerNumber: entry.ConsumerNumber,
        Email: entry.Email,
        Phone: entry.Phone
      });

      await newEntry.save();
      console.log(`Created master data entry: ${entry.ConsumerNumber} - ${entry.Email}`);
      createdCount++;
    }

    console.log(`\n✅ Successfully created ${createdCount} master data entries!`);
    console.log("\n📋 Master Data Entries:");
    masterDataEntries.forEach(entry => {
      console.log(`   ${entry.ConsumerNumber}: ${entry.Email} (${entry.Phone})`);
    });

  } catch (error) {
    console.error("Error seeding master data:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
};

// Run the seed function
seedMasterData();