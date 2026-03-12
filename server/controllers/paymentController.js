const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const Bill = require("../models/Bill");
const Payment = require("../models/Payment");
const Activity = require("../models/Activity");

exports.createOrder = async (req, res) => {
  try {
    const { amount, billId } = req.body;
    console.log("Create Order Request:", { amount, billId });

    if (!amount || !billId) {
      return res.status(400).json({ success: false, error: "Amount and billId are required" });
    }

    const receiptId = `receipt_${billId.substring(0, 10)}_${Date.now()}`.substring(0, 40);

    const options = {
      amount: amount * 100, // rupees to paise
      currency: "INR",
      receipt: receiptId
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });

  } catch (error) {
    console.error("Error creating order", error);
    res.status(500).json({ success: false, error: "Error creating order" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      billId, 
      method 
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !billId) {
      return res.status(400).json({ success: false, error: "Missing required payment details" });
    }

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET || "ryXNNn9KB2DEQ6GCWWIifFAG";
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, error: "Invalid payment signature" });
    }

    // Signature is valid, update the bill
    const bill = await Bill.findById(billId);
    
    if (!bill) {
      // If mock bill, handle gracefully (for frontend compatibility if they pass mock IDs)
      if (billId.startsWith("bill-")) {
        return res.status(200).json({
          success: true,
          message: "Payment verified successfully (Mock Bill)",
          payment: {
            transactionId: razorpay_payment_id,
            billId,
            status: "success",
            method: method || "Razorpay"
          }
        });
      }
      return res.status(404).json({ success: false, error: "Bill not found" });
    }

    bill.billStatus = "Paid";
    bill.paidDate = new Date();
    bill.paidAmount = bill.billAmount;
    bill.razorpayOrderId = razorpay_order_id;
    bill.razorpayPaymentId = razorpay_payment_id;
    bill.paymentMethod = method || "Razorpay";
    
    await bill.save();

    // Create Payment Record
    const newPayment = new Payment({
      consumerNumber: bill.consumerNumber || "Unknown",
      billId: billId,
      amount: bill.billAmount,
      paymentDate: new Date(),
      paymentMethod: bill.paymentMethod,
      transactionId: razorpay_payment_id,
      status: "success"
    });
    await newPayment.save();
    
    
    // Log Activity
    try {
      const activity = new Activity({
        title: "Bill Payment Received",
        description: `Payment of ₹${bill.billAmount} received for consumer ${bill.consumerNumber} via ${bill.paymentMethod}`,
        type: "payment",
        consumerNumber: bill.consumerNumber || ""
      });
      await activity.save();
      
      const io = req.app.get("io");
      if (io) {
        io.emit("new-activity", activity);
      }
    } catch (actErr) {
      console.error("Activity log error:", actErr);
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment: {
        transactionId: razorpay_payment_id,
        billId,
        status: "success",
        method: bill.paymentMethod
      }
    });

  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ success: false, error: "Server error during verification" });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Fallback: If userId is passed as a consumerNumber directly, search that instead
    const query = userId.startsWith('CN-') ? { consumerNumber: userId } : { userId: userId };

    const payments = await Payment.find(query).sort({ paymentDate: -1 });

    res.status(200).json({
      success: true,
      payments: payments.map(p => ({
        id: p._id.toString(),
        userId: p.userId,
        billId: p.billId,
        amount: p.amount,
        paymentId: p.transactionId,
        date: p.paymentDate,
        method: p.paymentMethod,
        consumerNumber: p.consumerNumber
      }))
    });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({ success: false, error: "Server error fetching history" });
  }
};