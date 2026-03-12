const Bill = require("../models/Bill");

const generateBillsForUser = async (userId) => {
  try {
    console.log("=== BILL GENERATION STARTED ===");
    console.log("Generating 3 months of bills for user:", userId);

    // Check if user already has bills
    const existingBills = await Bill.find({ userId: userId });
    if (existingBills.length > 0) {
      console.log("User already has bills, skipping generation");
      return;
    }

    // Get user details to get consumer number
    const User = require("../models/User");
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found, skipping bill generation");
      return;
    }

    // Generate 3 months of bills
    const billingMonths = [
      { month: "January", daysBack: 60 },
      { month: "February", daysBack: 30 },
      { month: "Current", daysBack: 0 },
    ];

    for (const monthData of billingMonths) {
      const unitsConsumed = Math.floor(100 + Math.random() * 400); // Random units between 100-500
      const billAmount = unitsConsumed * 8; // Assuming ₹8 per unit

      const bill = {
        userId: userId,
        consumerNumber: user.consumerNumber || "Pending",
        consumerName: user.name || "Unknown User",
        month: monthData.month,
        unitsConsumed: unitsConsumed,
        billAmount: billAmount,
        dueDate: new Date(Date.now() + (30 - monthData.daysBack) * 24 * 60 * 60 * 1000),
        billStatus: "Pending",
        createdAt: new Date(Date.now() - monthData.daysBack * 24 * 60 * 60 * 1000),
      };

      console.log("Creating bill:", bill);
      await Bill.create(bill);
    }

    console.log("=== BILL GENERATION COMPLETED ===");
  } catch (error) {
    console.error("=== BILL GENERATION ERROR ===");
    console.error("Error generating bills:", error);
    console.error("=== BILL GENERATION ERROR END ===");
  }
};

module.exports = generateBillsForUser;