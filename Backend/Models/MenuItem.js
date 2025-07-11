const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    default: 'none',
    required: true,
  },
  stock_quantity: {
    type: Number,
    default: 0,
  },
  image_url: {
    type: String,
    default: "/uploads/default.png",
  },
  available: {
    type: Boolean,
    default: true,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  finalPrice: {
    type: Number,
    default: function () {
      return this.price;
    },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

MenuItemSchema.pre("save", function (next) {
  this.finalPrice = this.price - (this.price * this.discount) / 100;
  next();
});

const MenuItem = mongoose.model("MenuItem", MenuItemSchema);

module.exports = { MenuItem };
