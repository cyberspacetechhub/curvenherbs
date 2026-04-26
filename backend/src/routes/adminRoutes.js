const express = require('express');
const router = express.Router();
const { handleCreateAdmin, handleGetAllAdmins, handleGetAdmin, handleUpdateAdmin, handleToggleAdminActive, handleDeleteAdmin } = require('../controllers/adminController');
const verifyJwt = require('../middlewares/verifyJwt');
const verifyRoles = require('../middlewares/verifyRoles');

router.use(verifyJwt, verifyRoles('superadmin'));
router.post('/', handleCreateAdmin);
router.get('/', handleGetAllAdmins);
router.get('/:id', handleGetAdmin);
router.put('/:id', handleUpdateAdmin);
router.patch('/:id/toggle-active', handleToggleAdminActive);
router.delete('/:id', handleDeleteAdmin);

module.exports = router;
