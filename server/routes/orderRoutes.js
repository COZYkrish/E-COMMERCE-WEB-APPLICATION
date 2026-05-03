const express = require('express');
const { createOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus, getOrderStats } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/stats', protect, adminOnly, getOrderStats);
router.get('/all', protect, adminOnly, getAllOrders);
router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
