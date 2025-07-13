const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true
  },
  OrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true
  },
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  fullAddress: {
    type: String,
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  stock_quantity: {
    type: Number,
    required: true
  },
  image_url: {
    type: String,
    required: true
  },
  finalPrice: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  orderNotes: {
    type: String,
    default: ""
  },
  deliveryDate: {
    type: Date
  },
  paymentMethod: String,
  status: {
    type: String,
    default: "Pending"
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = { Order };



