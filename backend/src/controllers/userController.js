const { registerUser, getUserById, updateUser, changePassword } = require('../services/userService');

const handleRegister = async (req, res) => {
  const user = await registerUser(req.body);
  res.status(201).json({ success: true, data: { _id: user._id, email: user.email, firstName: user.firstName } });
};

const handleGetProfile = async (req, res) => {
  const user = await getUserById(req.user.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user });
};

const handleUpdateProfile = async (req, res) => {
  const user = await updateUser(req.user.id, req.body);
  res.json({ success: true, data: user });
};

const handleChangePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  await changePassword(req.user.id, oldPassword, newPassword);
  res.json({ success: true, message: 'Password updated successfully' });
};

module.exports = { handleRegister, handleGetProfile, handleUpdateProfile, handleChangePassword };
