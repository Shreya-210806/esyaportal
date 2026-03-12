const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  consumerNumber: {
    type: String,
    required: true
  },
  billId: {
    type: String, // Kept as String so mock bills from frontend don't crash
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    required: true
  },
  transactionId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'success'
  }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
