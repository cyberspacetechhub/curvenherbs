const Order = require('../models/Order');
const OrderTracking = require('../models/OrderTracking');
const Coupon = require('../models/Coupon');
const Product = require('../models/Products');
const { sendOrderStatusEmail } = require('./emailService');

const applyCoupon = async (code, totalAmount) => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) throw new Error('Invalid or inactive coupon code');
  if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new Error('Coupon has expired');
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) throw new Error('Coupon usage limit reached');
  if (totalAmount < coupon.minOrderAmount) throw new Error(`Minimum order amount is ₦${coupon.minOrderAmount}`);

  const discount = coupon.discountType === 'percentage'
    ? (totalAmount * coupon.discountValue) / 100
    : coupon.discountValue;

  return { discount: Math.min(discount, totalAmount), couponId: coupon._id };
};

const placeOrder = async (orderData, couponCode = null) => {
  // Fetch current prices from DB to prevent price tampering
  const items = await Promise.all(orderData.items.map(async (item) => {
    const product = await Product.findById(item.product);
    if (!product) throw new Error(`Product not found: ${item.product}`);
    if (!product.isInStock) throw new Error(`${product.name} is out of stock`);
    return {
      product: product._id,
      quantity: item.quantity,
      priceAtPurchase: product.discountedPrice || product.price
    };
  }));

  let totalAmount = items.reduce((sum, i) => sum + i.priceAtPurchase * i.quantity, 0);
  let appliedCoupon = null;

  if (couponCode) {
    const { discount, couponId } = await applyCoupon(couponCode, totalAmount);
    totalAmount -= discount;
    appliedCoupon = couponId;
    await Coupon.findByIdAndUpdate(couponId, { $inc: { usedCount: 1 } });
  }

  const order = await Order.create({ ...orderData, items, totalAmount });

  // Create initial tracking entry
  await OrderTracking.create({ order: order._id, status: 'Pending', note: 'Order placed' });

  // Send confirmation email — non-blocking, never crash the order
  try { await sendOrderStatusEmail(order, 'Pending'); } catch (e) { console.error('[Email] placeOrder:', e.message); }

  return order;
};

const updateOrderStatus = async (orderId, status, note, adminId) => {
  const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true }).populate('items.product', 'name price');
  if (!order) throw new Error('Order not found');
  await OrderTracking.create({ order: orderId, status, note, updatedBy: adminId });
  try { await sendOrderStatusEmail(order, status, note); } catch (e) { console.error('[Email] updateOrderStatus:', e.message); }
  return order;
};

const getOrderById = async (orderId) => {
  return await Order.findById(orderId).populate('items.product', 'name images price');
};

const getOrderTracking = async (orderId) => {
  return await OrderTracking.find({ order: orderId }).sort({ createdAt: 1 });
};

const getAllOrders = async (filters = {}) => {
  const query = {};
  if (filters.status) query.status = filters.status;
  return await Order.find(query).sort({ createdAt: -1 });
};

const markOrderReceived = async (orderId) => {
  const order = await Order.findById(orderId).populate('items.product', 'name price');
  if (!order) throw new Error('Order not found');
  if (order.status === 'Cancelled') throw new Error('Cannot update a cancelled order');
  if (order.status === 'Delivered') throw new Error('Order already marked as delivered');

  order.status = 'Delivered';
  await order.save();
  await OrderTracking.create({ order: orderId, status: 'Delivered', note: 'Delivery confirmed by customer' });
  try { await sendOrderStatusEmail(order, 'Delivered', 'You confirmed receipt of your order.'); } catch (e) { console.error('[Email] markOrderReceived:', e.message); }
  return order;
};

module.exports = { placeOrder, updateOrderStatus, markOrderReceived, getOrderById, getOrderTracking, getAllOrders, applyCoupon };
