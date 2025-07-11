const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "userModel", required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
    quantity: { type: Number, default: 1 }
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = { Cart };
