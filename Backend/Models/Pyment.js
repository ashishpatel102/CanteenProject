const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    paymentId: {
        type: String,
        required: true
    },
    receipt: {
        type: String,
        required: true
    }, // Razorpay का receipt ID

    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: "INR"
    },
    status: {
        type: String,
        enum: ["success", "failed", "pending"],
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
        required: true
    },


    method: {
        type: String,
        required: true
    },

    bank: {
        type: String
    },

    captured: {
        type: Boolean,
        default: false
    },

    refundStatus: {
        type: String,
        enum: ["not_requested", "requested", "processed"],
        default: "not_requested"
    },

    refundId: {
        type: String
    },

    notes: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Payment = mongoose.model("Payments", paymentSchema);

module.exports = { Payment };
