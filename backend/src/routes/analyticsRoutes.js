const express = require('express');
const router = express.Router();
const {
  handleOverview,
  handleRevenueChart,
  handleTopProducts,
  handleOrdersByStatus,
  handleOrdersByPaymentMethod,
  handleRevenueComparison,
  handleCustomerGrowth,
  handleCategoryBreakdown
} = require('../controllers/analyticsController');
const verifyJwt = require('../middlewares/verifyJwt');
const verifyRoles = require('../middlewares/verifyRoles');

router.use(verifyJwt, verifyRoles('Admin', 'superadmin', 'manager', 'support'));

router.get('/overview', handleOverview);
router.get('/revenue', handleRevenueChart);           // ?period=week|month|year
router.get('/revenue/comparison', handleRevenueComparison);
router.get('/top-products', handleTopProducts);       // ?limit=5
router.get('/orders/status', handleOrdersByStatus);
router.get('/orders/payment-method', handleOrdersByPaymentMethod);
router.get('/customers/growth', handleCustomerGrowth); // ?period=week|month|year
router.get('/categories', handleCategoryBreakdown);

module.exports = router;
