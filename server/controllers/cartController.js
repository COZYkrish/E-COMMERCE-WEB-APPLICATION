const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// @desc  Get user cart
// @route GET /api/cart
// @access Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'title image price stock isActive');
  if (!cart) return res.json({ success: true, cart: { items: [], total: 0 } });

  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({ success: true, cart: { ...cart.toObject(), total } });
});

// @desc  Add item to cart
// @route POST /api/cart
// @access Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product || !product.isActive) throw new ApiError(404, 'Product not found');
  if (product.stock < quantity) throw new ApiError(400, 'Insufficient stock');

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const existingIndex = cart.items.findIndex((i) => i.product.toString() === productId);

  if (existingIndex >= 0) {
    cart.items[existingIndex].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity, price: product.price });
  }

  await cart.save();
  const populatedCart = await Cart.findById(cart._id).populate('items.product', 'title image price stock');
  const total = populatedCart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  res.status(201).json({ success: true, message: 'Item added to cart', cart: { ...populatedCart.toObject(), total } });
});

// @desc  Update cart item quantity
// @route PUT /api/cart/:productId
// @access Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  if (!quantity || quantity < 1) throw new ApiError(400, 'Quantity must be at least 1');

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, 'Cart not found');

  const item = cart.items.find((i) => i.product.toString() === req.params.productId);
  if (!item) throw new ApiError(404, 'Item not in cart');

  const product = await Product.findById(req.params.productId);
  if (product.stock < quantity) throw new ApiError(400, 'Insufficient stock');

  item.quantity = quantity;
  await cart.save();

  const populatedCart = await Cart.findById(cart._id).populate('items.product', 'title image price stock');
  const total = populatedCart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({ success: true, message: 'Cart updated', cart: { ...populatedCart.toObject(), total } });
});

// @desc  Remove item from cart
// @route DELETE /api/cart/:productId
// @access Private
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, 'Cart not found');

  cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  await cart.save();

  const populatedCart = await Cart.findById(cart._id).populate('items.product', 'title image price stock');
  const total = populatedCart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({ success: true, message: 'Item removed', cart: { ...populatedCart.toObject(), total } });
});

// @desc  Clear entire cart
// @route DELETE /api/cart
// @access Private
const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.json({ success: true, message: 'Cart cleared' });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
