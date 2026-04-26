const { placeOrder, updateOrderStatus, markOrderReceived, getOrderById, getOrderTracking, getAllOrders, applyCoupon } = require('../services/orderService');

const handlePlaceOrder = async (req, res) => {
  const { couponCode, ...orderData } = req.body;
  const order = await placeOrder(orderData, couponCode);
  res.status(201).json({ success: true, data: order });
};

const handleGetAllOrders = async (req, res) => {
  const orders = await getAllOrders(req.query);
  res.json({ success: true, data: orders });
};

const handleGetOrder = async (req, res) => {
  const order = await getOrderById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, data: order });
};

const handleUpdateOrderStatus = async (req, res) => {
  const { status, note } = req.body;
  const order = await updateOrderStatus(req.params.id, status, note, req.user.id);
  res.json({ success: true, data: order });
};

const handleGetOrderTracking = async (req, res) => {
  const tracking = await getOrderTracking(req.params.id);
  res.json({ success: true, data: tracking });
};

const handleValidateCoupon = async (req, res) => {
  const { code, totalAmount } = req.body;
  const result = await applyCoupon(code, totalAmount);
  res.json({ success: true, data: result });
};

const handleMarkReceived = async (req, res) => {
  const order = await markOrderReceived(req.params.id);
  res.json({ success: true, message: 'Order marked as received. Thank you!', data: order });
};

module.exports = { handlePlaceOrder, handleGetAllOrders, handleGetOrder, handleUpdateOrderStatus, handleGetOrderTracking, handleValidateCoupon, handleMarkReceived };
