const User = require('./User');

const Admin = User.discriminator('Admin', new (require('mongoose').Schema)({
  role: {
    type: String,
    enum: ['superadmin', 'manager', 'support'],
    default: 'support'
  },
  isActive: { type: Boolean, default: true },
  lastLogin: Date
}));

module.exports = Admin;
