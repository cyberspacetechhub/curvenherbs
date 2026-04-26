const { createAdmin, getAllAdmins, getAdminById, updateAdmin, toggleAdminActive, deleteAdmin } = require('../services/adminService');

const handleCreateAdmin = async (req, res) => {
  const admin = await createAdmin(req.body);
  res.status(201).json({ success: true, data: { _id: admin._id, email: admin.email, role: admin.role } });
};

const handleGetAllAdmins = async (req, res) => {
  const admins = await getAllAdmins();
  res.json({ success: true, data: admins });
};

const handleGetAdmin = async (req, res) => {
  const admin = await getAdminById(req.params.id);
  if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });
  res.json({ success: true, data: admin });
};

const handleUpdateAdmin = async (req, res) => {
  const admin = await updateAdmin(req.params.id, req.body);
  if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });
  res.json({ success: true, data: admin });
};

const handleToggleAdminActive = async (req, res) => {
  const admin = await toggleAdminActive(req.params.id);
  res.json({ success: true, data: admin });
};

const handleDeleteAdmin = async (req, res) => {
  await deleteAdmin(req.params.id);
  res.json({ success: true, message: 'Admin deleted' });
};

module.exports = { handleCreateAdmin, handleGetAllAdmins, handleGetAdmin, handleUpdateAdmin, handleToggleAdminActive, handleDeleteAdmin };
