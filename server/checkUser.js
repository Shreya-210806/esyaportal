const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

(async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    await mongoose.connect(MONGO_URI);
    const u = await User.findOne({ consumerNumber: 'CN-99999' }).lean();
    console.log('result:', u);
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
})();
