const Order = require('../models/Order');
const Product = require('../models/Products');
const User = require('../models/User');
const Review = require('../models/Review');
const Testimony = require('../models/Testimony');
const Newsletter = require('../models/Newsletter');
const ContactMessage = require('../models/ContactMessage');

// Helper: get start of a date period
const periodStart = (period) => {
  const now = new Date();
  if (period === 'week') return new Date(now.setDate(now.getDate() - 7));
  if (period === 'month') return new Date(now.setMonth(now.getMonth() - 1));
  if (period === 'year') return new Date(now.setFullYear(now.getFullYear() - 1));
  return new Date(0); // all time
};

const getOverviewStats = async () => {
  const [
    totalOrders,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    totalRevenueResult,
    totalProducts,
    outOfStockProducts,
    totalCustomers,
    totalSubscribers,
    unreadMessages,
    pendingReviews,
    pendingTestimonies
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: 'Pending' }),
    Order.countDocuments({ status: 'Processing' }),
    Order.countDocuments({ status: 'Shipped' }),
    Order.countDocuments({ status: 'Delivered' }),
    Order.countDocuments({ status: 'Cancelled' }),
    Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]),
    Product.countDocuments(),
    Product.countDocuments({ isInStock: false }),
    User.countDocuments({ type: { $ne: 'Admin' } }),
    Newsletter.countDocuments({ isSubscribed: true }),
    ContactMessage.countDocuments({ isRead: false }),
    Review.countDocuments({ approved: false }),
    Testimony.countDocuments({ approved: false })
  ]);

  return {
    orders: { total: totalOrders, pending: pendingOrders, processing: processingOrders, shipped: shippedOrders, delivered: deliveredOrders, cancelled: cancelledOrders },
    revenue: { total: totalRevenueResult[0]?.total || 0 },
    products: { total: totalProducts, outOfStock: outOfStockProducts },
    customers: { total: totalCustomers },
    newsletter: { subscribers: totalSubscribers },
    inbox: { unread: unreadMessages },
    moderation: { pendingReviews, pendingTestimonies }
  };
};

const getRevenueChart = async (period = 'month') => {
  const start = periodStart(period);

  const groupFormat = period === 'year'
    ? { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }
    : { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, day: { $dayOfMonth: '$createdAt' } };

  const data = await Order.aggregate([
    { $match: { createdAt: { $gte: start }, status: { $ne: 'Cancelled' } } },
    { $group: { _id: groupFormat, revenue: { $sum: '$totalAmount' }, orders: { $sum: 1 } } },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);

  return data.map(d => ({
    label: period === 'year'
      ? `${d._id.year}-${String(d._id.month).padStart(2, '0')}`
      : `${d._id.year}-${String(d._id.month).padStart(2, '0')}-${String(d._id.day).padStart(2, '0')}`,
    revenue: d.revenue,
    orders: d.orders
  }));
};

const getTopProducts = async (limit = 5) => {
  const data = await Order.aggregate([
    { $match: { status: { $ne: 'Cancelled' } } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        totalSold: { $sum: '$items.quantity' },
        totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.priceAtPurchase'] } }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: limit },
    { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
    { $unwind: '$product' },
    { $project: { name: '$product.name', slug: '$product.slug', totalSold: 1, totalRevenue: 1 } }
  ]);

  return data;
};

const getOrdersByStatus = async () => {
  const data = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  return data.map(d => ({ status: d._id, count: d.count }));
};

const getOrdersByPaymentMethod = async () => {
  const data = await Order.aggregate([
    { $group: { _id: '$paymentMethod', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } }
  ]);
  return data.map(d => ({ method: d._id, count: d.count, revenue: d.revenue }));
};

const getRevenueComparison = async () => {
  const now = new Date();

  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - now.getDay());

  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(thisWeekStart.getDate() - 7);
  const lastWeekEnd = new Date(thisWeekStart);
  lastWeekEnd.setDate(thisWeekStart.getDate() - 1);

  const [thisMonth, lastMonth, thisWeek, lastWeek] = await Promise.all([
    Order.aggregate([{ $match: { createdAt: { $gte: thisMonthStart }, status: { $ne: 'Cancelled' } } }, { $group: { _id: null, total: { $sum: '$totalAmount' }, orders: { $sum: 1 } } }]),
    Order.aggregate([{ $match: { createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }, status: { $ne: 'Cancelled' } } }, { $group: { _id: null, total: { $sum: '$totalAmount' }, orders: { $sum: 1 } } }]),
    Order.aggregate([{ $match: { createdAt: { $gte: thisWeekStart }, status: { $ne: 'Cancelled' } } }, { $group: { _id: null, total: { $sum: '$totalAmount' }, orders: { $sum: 1 } } }]),
    Order.aggregate([{ $match: { createdAt: { $gte: lastWeekStart, $lte: lastWeekEnd }, status: { $ne: 'Cancelled' } } }, { $group: { _id: null, total: { $sum: '$totalAmount' }, orders: { $sum: 1 } } }])
  ]);

  const calc = (current, previous) => {
    const curr = current[0]?.total || 0;
    const prev = previous[0]?.total || 0;
    const change = prev === 0 ? 100 : (((curr - prev) / prev) * 100).toFixed(1);
    return { current: curr, previous: prev, changePercent: parseFloat(change) };
  };

  return {
    monthly: calc(thisMonth, lastMonth),
    weekly: calc(thisWeek, lastWeek),
    thisMonthOrders: thisMonth[0]?.orders || 0,
    lastMonthOrders: lastMonth[0]?.orders || 0
  };
};

const getCustomerGrowth = async (period = 'month') => {
  const start = periodStart(period);

  const groupFormat = period === 'year'
    ? { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }
    : { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, day: { $dayOfMonth: '$createdAt' } };

  const data = await User.aggregate([
    { $match: { createdAt: { $gte: start }, type: { $ne: 'Admin' } } },
    { $group: { _id: groupFormat, newCustomers: { $sum: 1 } } },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);

  return data.map(d => ({
    label: period === 'year'
      ? `${d._id.year}-${String(d._id.month).padStart(2, '0')}`
      : `${d._id.year}-${String(d._id.month).padStart(2, '0')}-${String(d._id.day).padStart(2, '0')}`,
    newCustomers: d.newCustomers
  }));
};

const getCategoryBreakdown = async () => {
  const data = await Order.aggregate([
    { $match: { status: { $ne: 'Cancelled' } } },
    { $unwind: '$items' },
    { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'product' } },
    { $unwind: '$product' },
    { $group: { _id: '$product.category', totalSold: { $sum: '$items.quantity' }, totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.priceAtPurchase'] } } } },
    { $sort: { totalRevenue: -1 } }
  ]);
  return data.map(d => ({ category: d._id, totalSold: d.totalSold, totalRevenue: d.totalRevenue }));
};

module.exports = { getOverviewStats, getRevenueChart, getTopProducts, getOrdersByStatus, getOrdersByPaymentMethod, getRevenueComparison, getCustomerGrowth, getCategoryBreakdown };
