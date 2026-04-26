const User = require('../models/User');
const bcrypt = require('bcrypt');

const registerUser = async ({ firstName, lastName, email, phone, password }) => {
  const exists = await User.findOne({ email }).exec();
  if (exists) throw new Error('Email already registered');

  const hashed = await bcrypt.hash(password, 10);
  return await User.create({ firstName, lastName, email, phone, password: hashed });
};

const getUserById = async (id) => {
  return await User.findById(id).select('-password -refreshToken');
};

const updateUser = async (id, data) => {
  // Prevent password or sensitive fields from being updated here
  const { password, refreshToken, type, ...safeData } = data;
  return await User.findByIdAndUpdate(id, safeData, { new: true }).select('-password -refreshToken');
};

const changePassword = async (id, oldPassword, newPassword) => {
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');

  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) throw new Error('Incorrect current password');

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
};

module.exports = { registerUser, getUserById, updateUser, changePassword };
