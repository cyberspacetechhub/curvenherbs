const mongoose = require('mongoose');
const { Schema } = mongoose;

const newsletterSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  isSubscribed: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Newsletter', newsletterSchema);
