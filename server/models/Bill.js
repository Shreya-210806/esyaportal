const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  consumerNumber: { type: String, required: true },
  consumerName: { type: String, required: true },
  month: { type: String, required: true },
  unitsConsumed: { type: Number, required: true },
  billAmount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  billStatus: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
  
  // Optional tracking
  paidDate: { type: Date, default: null },
  paidAmount: { type: Number, default: null },
  razorpayOrderId: { type: String, default: null },
  razorpayPaymentId: { type: String, default: null },
  paymentMethod: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Bill", billSchema);