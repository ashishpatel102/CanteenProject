const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    payment_method: {
        type: String,
        enum: ['Cash', 'Card', 'UPI'],
        required: true
    },
    payment_status: {
        type: String,
        enum: ['success', 'failed', 'pending'],
        default: 'pending'
    },
    transaction_date: {
        type: Date,
        default: Date.now
    }
});
const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = { Transaction };