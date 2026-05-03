const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// @desc  Create order from cart
// @route POST /api/orders
// @access Private
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod = 'Card' } = req.body;

  if (!shippingAddress) throw new ApiError(400, 'Shipping address is required');

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) throw new ApiError(400, 'Cart is empty');

  // Build order items snapshot + reduce stock
  const orderItems = [];
  for (const item of cart.items) {
    const product = item.product;
    if (!product || !product.isActive) throw new ApiError(400, `Product "${product?.title}" is no longer available`);
    if (product.stock < item.quantity) throw new ApiError(400, `Insufficient stock for "${product.title}"`);

    product.stock -= item.quantity;
    await product.save();

    orderItems.push({
      product: product._id,
      title: product.title,
      image: product.image,
      price: item.price,
      quantity: item.quantity,
    });
  }

  const totalAmount = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    totalAmount,
  });

  // Clear cart after order
  cart.items = [];
  await cart.save();

  res.status(201).json({ success: true, message: 'Order placed successfully', order });
});

// @desc  Get logged-in user orders
// @route GET /api/orders
// @access Private
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, orders });
});

// @desc  Get order by ID
// @route GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to view this order');
  }
  res.json({ success: true, order });
});

// @desc  Get all orders (admin)
// @route GET /api/orders/all
// @access Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = status ? { status } : {};
  const skip = (Number(page) - 1) * Number(limit);
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.json({ success: true, total, totalPages: Math.ceil(total / Number(limit)), currentPage: Number(page), orders });
});

// @desc  Update order status (admin)
// @route PUT /api/orders/:id/status
// @access Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!allowed.includes(status)) throw new ApiError(400, 'Invalid status value');

  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('user', 'name email');
  if (!order) throw new ApiError(404, 'Order not found');

  res.json({ success: true, message: 'Order status updated', order });
});

// @desc  Get admin dashboard stats
// @route GET /api/orders/stats
// @access Admin
const getOrderStats = asyncHandler(async (req, res) => {
  const [totalOrders, totalProducts, totalUsers, revenueData, recentOrders] = await Promise.all([
    Order.countDocuments(),
    Product.countDocuments({ isActive: true }),
    User.countDocuments({ role: 'user' }),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(5),
  ]);

  const statusCounts = await Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
  const byStatus = {};
  statusCounts.forEach((s) => (byStatus[s._id] = s.count));

  res.json({
    success: true,
    stats: {
      totalOrders,
      totalRevenue: revenueData[0]?.total || 0,
      totalProducts,
      totalUsers,
      byStatus,
      recentOrders,
    },
  });
});

module.exports = { createOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus, getOrderStats };
