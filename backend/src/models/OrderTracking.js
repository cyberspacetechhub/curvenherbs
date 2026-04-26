const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderTrackingSchema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  status: {
    type: String,
    enum: ['Pending', 'Payment Received', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    required: true
  },
  note: String, // e.g., "Package handed to GIG Logistics"
  updatedBy: { type: Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true });

module.exports = mongoose.model('OrderTracking', orderTrackingSchema);
