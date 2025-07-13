const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
    },
    quantity_available: {
        type: Number,
        required: true
    },
    last_updated: {
        type: Date,
        default: Date.now
    }
});
const Inventory = mongoose.model('Inventory', InventorySchema);

module.exports = { Inventory };