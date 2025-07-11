const express = require("express");
const { PymentHandler, setPayment, getPymentHandler } = require("../Controllers/PymentHandler");
const { authMiddleware } = require("../Middleware/authMiddleware");
const { authAdminMiddleware } = require("../Middleware/authAdminMiddleware");
require("dotenv").config();

const PymentRouter = express.Router();

PymentRouter.post("/save-payment", authMiddleware, setPayment);

PymentRouter.post("/create-order", authMiddleware, PymentHandler);
PymentRouter.get("/payments", authAdminMiddleware, getPymentHandler);

PymentRouter.get("/get-razorpay-key", authMiddleware, (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});

module.exports = { PymentRouter };


