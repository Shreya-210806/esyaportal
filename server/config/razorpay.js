require("dotenv").config();
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: "rzp_test_SOm16fzaZX7qFh",
  key_secret: "ryXNNn9KB2DEQ6GCWWIifFAG",

});

module.exports = razorpay;
