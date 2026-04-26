const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  customerName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  verified: { type: Boolean, default: false }, // verified purchase
  approved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
