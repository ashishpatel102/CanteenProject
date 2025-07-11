const Razorpay = require("razorpay");
const { Payment } = require("../Models/Pyment");
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});


const PymentHandler = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const receiptId = "receipt_" + new Date().getTime();



    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, error: "Invalid amount" });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: receiptId,
    });

    console.log(order);

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("❌ Error Creating Order:", error);
    res.status(500).json({ success: false, error: "Order creation failed" });
  }
};

const setPayment = async (req, res) => {
  try {
    console.log("📌 Received Payment Data:", req.body);

    const {
      orderId,
      paymentId,
      amount,
      currency,
      status,
      method,
      receipt
    } = req.body;
    const userId = req.userId;

    if (!orderId || !paymentId || !amount || !userId || !currency || !method || !receipt) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newPayment = await Payment.create({
      orderId,
      paymentId,
      amount: Math.round(amount),
      currency,
      status,
      userId,
      method,
      receipt,
    });


    res.json({ success: true, message: "Payment saved successfully!", payment: newPayment });
  } catch (error) {
    console.error("❌ Error Saving Payment:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


async function getPymentHandler(req, res) {
  try {

    if (!Payment) {
      throw new Error("Database connection issue: Payment model is undefined.");
    }

    const payments = await Payment.find({});

    if (payments.length === 0) {
      return res.status(404).json({ message: "No payments found" });
    }

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);

    if (error.name === "MongoNetworkError") {
      return res.status(500).json({ message: "Database connection failed", error: error.message });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Invalid request data", error: error.message });
    }

    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}



module.exports = { PymentHandler, setPayment, getPymentHandler };
