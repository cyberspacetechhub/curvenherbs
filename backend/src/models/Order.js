const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema({
  customer: {
    name: String,
    email: String,
    phone: String,
    whatsappNumber: String,
    location: String,
    address: String
  },

  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    priceAtPurchase: Number
  }],

  totalAmount: Number,
  status: { 
    type: String, 
    enum: ["Pending", "Payment Received", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending"
  },

  paymentMethod: { 
    type: String, 
    enum: ["Bank Transfer", "POS", "Cash on Delivery", "WhatsApp Order"],
    default: "Bank Transfer"
  },

  orderSource: { type: String, default: "Website" }, // or "WhatsApp"

  notes: String, // e.g., "Customer requested combo with Suppository 3"

  trackingNumber: String, // For shipped orders

}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);