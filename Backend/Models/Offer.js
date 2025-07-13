const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {  // ✅ Category field added
    type: String,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {  // ✅ Auto-update based on expiration date
    type: Boolean,
    default: true
  },
  image: {  // ✅ Image path (uploaded file)
    type: String,
    required: true
  },
});

// ✅ Middleware to auto-update `isActive`
OfferSchema.pre("save", function (next) {
  const today = new Date();
  this.isActive = this.endDate >= today;
  next();
});

const Offer = mongoose.model("Offer", OfferSchema);
module.exports = { Offer };
