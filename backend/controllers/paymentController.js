const Payment = require('../models/Payment');
const Order = require('../models/Order');
const paymentConfig = require('../config/payment');
const crypto = require('crypto');
const axios = require('axios');

// Initialize Stripe
const stripe = require('stripe')(paymentConfig.stripe.secretKey);

// @desc    Initiate JazzCash payment
// @route   POST /api/payments/jazzcash/initiate
// @access  Private
exports.initiateJazzCashPayment = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        // Generate transaction reference
        const txnRefNo = 'T' + Date.now();
        const amount = Math.round(order.totalAmount * 100); // Convert to paisa

        // Calculate secure hash
        const hashString = `${paymentConfig.jazzcash.integritySalt}&${amount}&${paymentConfig.jazzcash.merchantId}&${txnRefNo}`;
        const ppSecureHash = crypto.createHmac('sha256', paymentConfig.jazzcash.integritySalt)
            .update(hashString)
            .digest('hex');

        // Create payment record
        const payment = await Payment.create({
            order: orderId,
            user: req.user.id,
            amount: order.totalAmount,
            method: 'jazzcash',
            status: 'pending',
            transactionId: txnRefNo,
            paymentData: {
                pp_Amount: amount,
                pp_TxnRefNo: txnRefNo,
                pp_SecureHash: ppSecureHash
            }
        });

        // Return payment form data
        res.status(200).json({
            success: true,
            data: {
                paymentId: payment._id,
                formUrl: paymentConfig.jazzcash.apiUrl,
                formData: {
                    pp_Version: '1.1',
                    pp_TxnType: 'MWALLET',
                    pp_Language: 'EN',
                    pp_MerchantID: paymentConfig.jazzcash.merchantId,
                    pp_Password: paymentConfig.jazzcash.password,
                    pp_TxnRefNo: txnRefNo,
                    pp_Amount: amount,
                    pp_TxnCurrency: 'PKR',
                    pp_TxnDateTime: new Date().toISOString().replace(/[-:]/g, '').split('.')[0],
                    pp_BillReference: orderId,
                    pp_Description: `Payment for Order ${orderId}`,
                    pp_ReturnURL: paymentConfig.jazzcash.returnUrl,
                    pp_SecureHash: ppSecureHash
                }
            }
        });
    } catch (error) {
        console.error('JazzCash initiation error:', error);
        res.status(500).json({ success: false, message: 'Payment initiation failed', error: error.message });
    }
};

// @desc    JazzCash webhook/callback handler
// @route   POST /api/payments/jazzcash/callback
// @access  Public
exports.jazzCashCallback = async (req, res) => {
    try {
        const { pp_TxnRefNo, pp_ResponseCode, pp_SecureHash } = req.body;

        // Verify hash
        // In production, properly verify the hash

        const payment = await Payment.findOne({ transactionId: pp_TxnRefNo });
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        if (pp_ResponseCode === '000') {
            // Payment successful
            payment.status = 'completed';
            payment.paymentData.response = req.body;
            await payment.save();

            // Update order status
            await Order.findByIdAndUpdate(payment.order, {
                paymentStatus: 'paid',
                orderStatus: 'processing'
            });

            res.redirect(`${process.env.FRONTEND_URL}/orders/${payment.order}?payment=success`);
        } else {
            // Payment failed
            payment.status = 'failed';
            payment.paymentData.response = req.body;
            await payment.save();

            res.redirect(`${process.env.FRONTEND_URL}/orders/${payment.order}?payment=failed`);
        }
    } catch (error) {
        console.error('JazzCash callback error:', error);
        res.status(500).json({ success: false, message: 'Payment verification failed' });
    }
};

// @desc    Initiate EasyPaisa payment
// @route   POST /api/payments/easypaisa/initiate
// @access  Private
exports.initiateEasyPaisaPayment = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const orderId_EP = 'EP' + Date.now();
        const amount = order.totalAmount.toFixed(2);

        // Create payment record
        const payment = await Payment.create({
            order: orderId,
            user: req.user.id,
            amount: order.totalAmount,
            method: 'easypaisa',
            status: 'pending',
            transactionId: orderId_EP
        });

        // Return payment form data
        res.status(200).json({
            success: true,
            data: {
                paymentId: payment._id,
                formUrl: paymentConfig.easypaisa.apiUrl,
                formData: {
                    storeId: paymentConfig.easypaisa.storeId,
                    amount: amount,
                    postBackURL: `${process.env.BACKEND_URL}/api/payments/easypaisa/callback`,
                    orderRefNum: orderId_EP,
                    merchantTx: orderId_EP,
                    expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
                    emailAddress: req.user.email,
                    mobileNumber: order.shippingAddress.phone
                }
            }
        });
    } catch (error) {
        console.error('EasyPaisa initiation error:', error);
        res.status(500).json({ success: false, message: 'Payment initiation failed', error: error.message });
    }
};

// @desc    EasyPaisa webhook/callback handler
// @route   POST /api/payments/easypaisa/callback
// @access  Public
exports.easyPaisaCallback = async (req, res) => {
    try {
        const { orderRefNumber, paymentToken, status } = req.body;

        const payment = await Payment.findOne({ transactionId: orderRefNumber });
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        if (status === '0000') {
            // Payment successful
            payment.status = 'completed';
            payment.paymentData = { response: req.body };
            await payment.save();

            await Order.findByIdAndUpdate(payment.order, {
                paymentStatus: 'paid',
                orderStatus: 'processing'
            });

            res.json({ success: true, message: 'Payment successful' });
        } else {
            payment.status = 'failed';
            payment.paymentData = { response: req.body };
            await payment.save();

            res.json({ success: false, message: 'Payment failed' });
        }
    } catch (error) {
        console.error('EasyPaisa callback error:', error);
        res.status(500).json({ success: false, message: 'Payment verification failed' });
    }
};

// @desc    Initiate Stripe payment
// @route   POST /api/payments/stripe/initiate
// @access  Private
exports.initiateStripePayment = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId).populate('items.product');
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        // Create Stripe Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(order.totalAmount * 100), // Convert to paisa/cents
            currency: 'pkr',
            metadata: {
                orderId: orderId.toString(),
                userId: req.user.id
            },
            description: `Order #${orderId}`
        });

        // Create payment record
        const payment = await Payment.create({
            order: orderId,
            user: req.user.id,
            amount: order.totalAmount,
            method: 'stripe',
            status: 'pending',
            transactionId: paymentIntent.id,
            paymentData: {
                clientSecret: paymentIntent.client_secret
            }
        });

        res.status(200).json({
            success: true,
            data: {
                paymentId: payment._id,
                clientSecret: paymentIntent.client_secret,
                publishableKey: paymentConfig.stripe.publishableKey
            }
        });
    } catch (error) {
        console.error('Stripe initiation error:', error);
        res.status(500).json({ success: false, message: 'Payment initiation failed', error: error.message });
    }
};

// @desc    Stripe webhook handler
// @route   POST /api/payments/stripe/webhook
// @access  Public
exports.stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            paymentConfig.stripe.webhookSecret
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;

        const payment = await Payment.findOne({ transactionId: paymentIntent.id });
        if (payment) {
            payment.status = 'completed';
            payment.paymentData.webhookData = paymentIntent;
            await payment.save();

            await Order.findByIdAndUpdate(payment.order, {
                paymentStatus: 'paid',
                orderStatus: 'processing'
            });
        }
    } else if (event.type === 'payment_intent.payment_failed') {
        const paymentIntent = event.data.object;

        const payment = await Payment.findOne({ transactionId: paymentIntent.id });
        if (payment) {
            payment.status = 'failed';
            payment.paymentData.webhookData = paymentIntent;
            await payment.save();
        }
    }

    res.json({ received: true });
};

// @desc    Get payment status
// @route   GET /api/payments/:paymentId
// @access  Private
exports.getPaymentStatus = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.paymentId)
            .populate('order')
            .populate('user', 'name email');

        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        if (payment.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        res.status(200).json({ success: true, data: payment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Process refund
// @route   POST /api/payments/:paymentId/refund
// @access  Private (Admin only)
exports.processRefund = async (req, res) => {
    try {
        const { reason, amount } = req.body;

        const payment = await Payment.findById(req.params.paymentId);
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        if (payment.status !== 'completed') {
            return res.status(400).json({ success: false, message: 'Can only refund completed payments' });
        }

        const refundAmount = amount || payment.amount;

        // Process refund based on payment method
        if (payment.method === 'stripe') {
            const refund = await stripe.refunds.create({
                payment_intent: payment.transactionId,
                amount: Math.round(refundAmount * 100)
            });

            payment.status = 'refunded';
            payment.refundData = {
                refundId: refund.id,
                refundedAt: new Date(),
                refundAmount: refundAmount,
                reason: reason
            };
            await payment.save();

            await Order.findByIdAndUpdate(payment.order, {
                paymentStatus: 'refunded',
                orderStatus: 'refunded'
            });
        } else {
            // For JazzCash and EasyPaisa, mark as refunded (manual process)
            payment.status = 'refunded';
            payment.refundData = {
                refundedAt: new Date(),
                refundAmount: refundAmount,
                reason: reason
            };
            await payment.save();
        }

        res.status(200).json({
            success: true,
            message: 'Refund processed successfully',
            data: payment
        });
    } catch (error) {
        console.error('Refund error:', error);
        res.status(500).json({ success: false, message: 'Refund failed', error: error.message });
    }
};
