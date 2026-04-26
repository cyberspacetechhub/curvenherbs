const mongoose = require('mongoose');
const { Schema } = mongoose;

const couponSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true }, // % or ₦ amount
  minOrderAmount: { type: Number, default: 0 },
  maxUses: { type: Number, default: null }, // null = unlimited
  usedCount: { type: Number, default: 0 },
  expiresAt: Date,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
