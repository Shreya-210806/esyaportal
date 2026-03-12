const mongoose = require('mongoose');

const masterDataSchema = new mongoose.Schema({
  ConsumerNumber: {
    type: String,
    required: true,
    unique: true
  },
  Email: {
    type: String,
    required: true
  },
  Phone: {
    type: String,
    required: true
  }
}, { timestamps: true });

const MasterData = mongoose.model('MasterData', masterDataSchema, 'master_data');

module.exports = MasterData;
