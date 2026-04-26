const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactMessageSchema = new Schema({
  name: { type: String, required: true },
  phone: String,
  email: String,
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
