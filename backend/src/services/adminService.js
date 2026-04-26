const Admin = require('../models/Admin');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const createAdmin = async ({ firstName, lastName, email, phone, password, role }) => {
  const exists = await User.findOne({ email });
  if (exists) throw new Error('Email already in use');

  const hashed = await bcrypt.hash(password, 10);
  return await Admin.create({ firstName, lastName, email, phone, password: hashed, role });
};

const getAllAdmins = async () => {
  return await Admin.find({ type: 'Admin' }).select('-password -refreshToken');
};

const getAdminById = async (id) => {
  return await Admin.findById(id).select('-password -refreshToken');
};

const updateAdmin = async (id, data) => {
  const { password, refreshToken, type, ...safeData } = data;
  return await Admin.findByIdAndUpdate(id, safeData, { new: true }).select('-password -refreshToken');
};

const toggleAdminActive = async (id) => {
  const admin = await Admin.findById(id);
  if (!admin) throw new Error('Admin not found');
  admin.isActive = !admin.isActive;
  return await admin.save();
};

const deleteAdmin = async (id) => {
  return await Admin.findByIdAndDelete(id);
};

const updateLastLogin = async (id) => {
  return await Admin.findByIdAndUpdate(id, { lastLogin: new Date() });
};

module.exports = {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  toggleAdminActive,
  deleteAdmin,
  updateLastLogin
};
