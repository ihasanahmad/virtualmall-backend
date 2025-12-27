const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    initiateJazzCashPayment,
    jazzCashCallback,
    initiateEasyPaisaPayment,
    easyPaisaCallback,
    initiateStripePayment,
    stripeWebhook,
    getPaymentStatus,
    processRefund
} = require('../controllers/paymentController');

// JazzCash routes
router.post('/jazzcash/initiate', protect, initiateJazzCashPayment);
router.post('/jazzcash/callback', jazzCashCallback);

// EasyPaisa routes
router.post('/easypaisa/initiate', protect, initiateEasyPaisaPayment);
router.post('/easypaisa/callback', easyPaisaCallback);

// Stripe routes
router.post('/stripe/initiate', protect, initiateStripePayment);
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Payment status and refund
router.get('/:paymentId', protect, getPaymentStatus);
router.post('/:paymentId/refund', protect, processRefund);

module.exports = router;
