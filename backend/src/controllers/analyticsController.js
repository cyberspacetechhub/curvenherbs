const {
  getOverviewStats,
  getRevenueChart,
  getTopProducts,
  getOrdersByStatus,
  getOrdersByPaymentMethod,
  getRevenueComparison,
  getCustomerGrowth,
  getCategoryBreakdown
} = require('../services/analyticsService');

const handleOverview = async (req, res) => {
  const data = await getOverviewStats();
  res.json({ success: true, data });
};

const handleRevenueChart = async (req, res) => {
  const data = await getRevenueChart(req.query.period);
  res.json({ success: true, data });
};

const handleTopProducts = async (req, res) => {
  const data = await getTopProducts(parseInt(req.query.limit) || 5);
  res.json({ success: true, data });
};

const handleOrdersByStatus = async (req, res) => {
  const data = await getOrdersByStatus();
  res.json({ success: true, data });
};

const handleOrdersByPaymentMethod = async (req, res) => {
  const data = await getOrdersByPaymentMethod();
  res.json({ success: true, data });
};

const handleRevenueComparison = async (req, res) => {
  const data = await getRevenueComparison();
  res.json({ success: true, data });
};

const handleCustomerGrowth = async (req, res) => {
  const data = await getCustomerGrowth(req.query.period);
  res.json({ success: true, data });
};

const handleCategoryBreakdown = async (req, res) => {
  const data = await getCategoryBreakdown();
  res.json({ success: true, data });
};

module.exports = {
  handleOverview,
  handleRevenueChart,
  handleTopProducts,
  handleOrdersByStatus,
  handleOrdersByPaymentMethod,
  handleRevenueComparison,
  handleCustomerGrowth,
  handleCategoryBreakdown
};
