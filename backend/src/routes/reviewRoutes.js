const express = require('express');
const router = express.Router();
const { handleAddReview, handleGetProductReviews, handleGetPendingReviews, handleApproveReview, handleDeleteReview } = require('../controllers/reviewController');
const verifyJwt = require('../middlewares/verifyJwt');
const verifyRoles = require('../middlewares/verifyRoles');

// Public
router.post('/products/:productId', handleAddReview);
router.get('/products/:productId', handleGetProductReviews);

// Admin only
router.use(verifyJwt, verifyRoles('Admin', 'superadmin', 'manager'));
router.get('/pending', handleGetPendingReviews);
router.put('/:id/approve', handleApproveReview);
router.delete('/:id', handleDeleteReview);

module.exports = router;
