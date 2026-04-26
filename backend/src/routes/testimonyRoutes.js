const express = require('express');
const router = express.Router();
const { handleSubmitTestimony, handleGetApprovedTestimonies, handleGetPendingTestimonies, handleApproveTestimony, handleDeleteTestimony } = require('../controllers/testimonyController');
const verifyJwt = require('../middlewares/verifyJwt');
const verifyRoles = require('../middlewares/verifyRoles');

// Public
router.post('/', handleSubmitTestimony);
router.get('/', handleGetApprovedTestimonies);

// Admin only
router.use(verifyJwt, verifyRoles('Admin', 'superadmin', 'manager'));
router.get('/pending', handleGetPendingTestimonies);
router.put('/:id/approve', handleApproveTestimony);
router.delete('/:id', handleDeleteTestimony);

module.exports = router;
