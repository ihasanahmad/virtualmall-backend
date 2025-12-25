const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Create new order
exports.createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod } = req.body;

        // Validate items and calculate totals
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product).populate('brand');

            if (!product) {
                return res.status(404).json({ message: `Product ${item.product} not found` });
            }

            if (product.inventory < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient inventory for ${product.name}`
                });
            }

            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;

            orderItems.push({
                product: product._id,
                brand: product.brand._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.images[0]?.url || ''
            });
        }

        // Calculate shipping (flat rate for now)
        const shippingCost = 200;
        const tax = subtotal * 0.05; // 5% tax
        const total = subtotal + shippingCost + tax;

        // Create order
        const order = await Order.create({
            customer: req.user.id,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            paymentStatus: 'pending',
            subtotal,
            shippingCost,
            tax,
            total,
            status: 'processing'
        });

        // Update inventory
        for (const item of items) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { inventory: -item.quantity } }
            );
        }

        // Clear cart if exists
        await Cart.findOneAndDelete({ user: req.user.id });

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user.id })
            .populate('items.product')
            .populate('items.brand')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product')
            .populate('items.brand')
            .populate('customer', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user owns this order or is admin
        if (order.customer._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update order status (admin/vendor only)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { paymentStatus, transactionId } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.paymentStatus = paymentStatus;
        if (transactionId) {
            order.transactionId = transactionId;
        }

        await order.save();

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Update payment status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
