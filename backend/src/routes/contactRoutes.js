const express = require('express');
const router = express.Router();
const { handleSubmitMessage, handleGetAllMessages, handleMarkAsRead, handleDeleteMessage } = require('../controllers/contactController');
const verifyJwt = require('../middlewares/verifyJwt');
const verifyRoles = require('../middlewares/verifyRoles');

// Public
router.post('/', handleSubmitMessage);

// Admin only
router.use(verifyJwt, verifyRoles('Admin', 'superadmin', 'manager', 'support'));
router.get('/', handleGetAllMessages);
router.put('/:id/read', handleMarkAsRead);
router.delete('/:id', handleDeleteMessage);

module.exports = router;
