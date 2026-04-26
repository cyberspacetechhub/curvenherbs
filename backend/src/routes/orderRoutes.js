const express = require('express');
const router = express.Router();
const { handlePlaceOrder, handleGetAllOrders, handleGetOrder, handleUpdateOrderStatus, handleGetOrderTracking, handleValidateCoupon, handleMarkReceived } = require('../controllers/orderController');
const verifyJwt = require('../middlewares/verifyJwt');
const verifyRoles = require('../middlewares/verifyRoles');

// Public
router.post('/', handlePlaceOrder);
router.post('/validate-coupon', handleValidateCoupon);
router.get('/:id/tracking', handleGetOrderTracking);
router.patch('/:id/mark-received', handleMarkReceived);

// Admin only
router.use(verifyJwt, verifyRoles('Admin', 'superadmin', 'manager', 'support'));
router.get('/', handleGetAllOrders);
router.get('/:id', handleGetOrder);
router.put('/:id/status', handleUpdateOrderStatus);

module.exports = router;
