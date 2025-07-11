const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comments: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});
const Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = { Feedback };