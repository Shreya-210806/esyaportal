const mongoose = require("mongoose");

const newConnectionApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Base64 / data-URL representations of documents (for demo purposes)
  idProof: {
    type: String,
    required: true,
  },

  addressProof: {
    type: String,
    required: true,
  },

  otherDocument: {
    type: String,
  },

  status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  approvedAt: {
    type: Date,
  },

  rejectedAt: {
    type: Date,
  },

  smsSentAt: {
    type: Date,
  },
});

module.exports = mongoose.model(
  "NewConnectionApplication",
  newConnectionApplicationSchema
);

