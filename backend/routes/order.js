const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus
} = require('../controllers/orderController');

// Public routes
router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);
router.get('/:id', protect, getOrderById);

// Admin/Vendor routes
router.put('/:id/status', protect, updateOrderStatus);
router.put('/:id/payment', protect, updatePaymentStatus);

module.exports = router;
