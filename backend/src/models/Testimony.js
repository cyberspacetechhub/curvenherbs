const mongoose = require('mongoose');
const { Schema } = mongoose;

const testimonialSchema = new Schema({
  customerName: { type: String, required: true },
  location: String, // e.g., "Enugu", "Abakaliki", "Lagos"
  beforeImage: String,
  afterImage: String,
  timeTaken: String, // "6 weeks", "2 months"
  testimonial: { type: String, required: true },
  productUsed: { type: Schema.Types.ObjectId, ref: 'Product' },
  rating: { type: Number, min: 1, max: 5 },
  approved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Testimony', testimonialSchema);
