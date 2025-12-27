const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Brand = require('../models/Brand');
const Payment = require('../models/Payment');

// @desc    Get admin dashboard overview
// @route   GET /api/analytics/admin/overview
// @access  Private/Admin
exports.getAdminOverview = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Total counts
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalBrands = await Brand.countDocuments({ status: 'approved' });
        const totalOrders = await Order.countDocuments(dateFilter);

        // Revenue calculation
        const revenueData = await Order.aggregate([
            { $match: { ...dateFilter, paymentStatus: 'paid' } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' },
                    totalCommission: { $sum: '$commission' }
                }
            }
        ]);

        const revenue = revenueData[0] || { totalRevenue: 0, totalCommission: 0 };

        // Order status breakdown
        const ordersByStatus = await Order.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: '$orderStatus',
                    count: { $sum: 1 }
                }
            }
        ]);

        // User breakdown by role
        const usersByRole = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalUsers,
                    totalProducts,
                    totalBrands,
                    totalOrders,
                    totalRevenue: revenue.totalRevenue,
                    totalCommission: revenue.totalCommission
                },
                ordersByStatus,
                usersByRole
            }
        });
    } catch (error) {
        console.error('Admin overview error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Get revenue analytics
// @route   GET /api/analytics/admin/revenue
// @access  Private/Admin
exports.getRevenueAnalytics = async (req, res) => {
    try {
        const { period = 'month', year, month } = req.query;

        let groupBy;
        let matchFilter = { paymentStatus: 'paid' };

        if (period === 'month' && year && month) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);
            matchFilter.createdAt = { $gte: startDate, $lte: endDate };
            groupBy = { $dayOfMonth: '$createdAt' };
        } else if (period === 'year' && year) {
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31);
            matchFilter.createdAt = { $gte: startDate, $lte: endDate };
            groupBy = { $month: '$createdAt' };
        } else {
            // Last 30 days
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);
            matchFilter.createdAt = { $gte: startDate };
            groupBy = { $dayOfMonth: '$createdAt' };
        }

        const revenueByPeriod = await Order.aggregate([
            { $match: matchFilter },
            {
                $group: {
                    _id: groupBy,
                    revenue: { $sum: '$totalAmount' },
                    commission: { $sum: '$commission' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Top brands by revenue
        const topBrands = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: '$productInfo' },
            {
                $lookup: {
                    from: 'brands',
                    localField: 'productInfo.brand',
                    foreignField: '_id',
                    as: 'brandInfo'
                }
            },
            { $unwind: '$brandInfo' },
            {
                $group: {
                    _id: '$brandInfo._id',
                    brandName: { $first: '$brandInfo.name' },
                    totalRevenue: {
                        $sum: { $multiply: ['$items.price', '$items.quantity'] }
                    },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: 10 }
        ]);

        res.status(200).json({
            success: true,
            data: {
                revenueByPeriod,
                topBrands
            }
        });
    } catch (error) {
        console.error('Revenue analytics error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Get top selling products
// @route   GET /api/analytics/admin/top-products
// @access  Private/Admin
exports.getTopProducts = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const topProducts = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    totalSold: { $sum: '$items.quantity' },
                    totalRevenue: {
                        $sum: { $multiply: ['$items.price', '$items.quantity'] }
                    }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: '$productInfo' },
            {
                $project: {
                    productId: '$_id',
                    productName: '$productInfo.name',
                    totalSold: 1,
                    totalRevenue: 1
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: parseInt(limit) }
        ]);

        res.status(200).json({ success: true, data: topProducts });
    } catch (error) {
        console.error('Top products error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Get vendor dashboard overview
// @route   GET /api/analytics/vendor/overview
// @access  Private/Vendor
exports.getVendorOverview = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Get vendor's brand
        const brand = await Brand.findOne({ user: req.user.id });
        if (!brand) {
            return res.status(404).json({ success: false, message: 'Brand not found' });
        }

        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Get vendor's products
        const products = await Product.find({ brand: brand._id });
        const productIds = products.map(p => p._id);

        // Total products
        const totalProducts = products.length;

        // Get orders containing vendor's products
        const orders = await Order.find({
            ...dateFilter,
            'items.product': { $in: productIds }
        });

        // Calculate vendor-specific revenue
        let totalRevenue = 0;
        let totalOrders = 0;
        let totalItemsSold = 0;

        orders.forEach(order => {
            let vendorItemsInOrder = false;
            order.items.forEach(item => {
                if (productIds.some(id => id.equals(item.product))) {
                    vendorItemsInOrder = true;
                    totalRevenue += item.price * item.quantity;
                    totalItemsSold += item.quantity;
                }
            });
            if (vendorItemsInOrder) totalOrders++;
        });

        // Products out of stock
        const outOfStockProducts = products.filter(p => p.inventory === 0).length;

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalProducts,
                    totalOrders,
                    totalRevenue,
                    totalItemsSold,
                    outOfStockProducts
                }
            }
        });
    } catch (error) {
        console.error('Vendor overview error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Get vendor product performance
// @route   GET /api/analytics/vendor/products
// @access  Private/Vendor
exports.getVendorProductPerformance = async (req, res) => {
    try {
        const brand = await Brand.findOne({ user: req.user.id });
        if (!brand) {
            return res.status(404).json({ success: false, message: 'Brand not found' });
        }

        const products = await Product.find({ brand: brand._id });
        const productIds = products.map(p => p._id);

        const productPerformance = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $unwind: '$items' },
            { $match: { 'items.product': { $in: productIds } } },
            {
                $group: {
                    _id: '$items.product',
                    totalSold: { $sum: '$items.quantity' },
                    totalRevenue: {
                        $sum: { $multiply: ['$items.price', '$items.quantity'] }
                    },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: '$productInfo' },
            {
                $project: {
                    productId: '$_id',
                    productName: '$productInfo.name',
                    currentInventory: '$productInfo.inventory',
                    totalSold: 1,
                    totalRevenue: 1,
                    orderCount: 1
                }
            },
            { $sort: { totalRevenue: -1 } }
        ]);

        res.status(200).json({ success: true, data: productPerformance });
    } catch (error) {
        console.error('Vendor product performance error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Get vendor sales trends
// @route   GET /api/analytics/vendor/sales-trends
// @access  Private/Vendor
exports.getVendorSalesTrends = async (req, res) => {
    try {
        const { period = 'month' } = req.query;

        const brand = await Brand.findOne({ user: req.user.id });
        if (!brand) {
            return res.status(404).json({ success: false, message: 'Brand not found' });
        }

        const products = await Product.find({ brand: brand._id });
        const productIds = products.map(p => p._id);

        let groupBy;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - (period === 'year' ? 365 : 30));

        if (period === 'year') {
            groupBy = {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
            };
        } else {
            groupBy = {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
                day: { $dayOfMonth: '$createdAt' }
            };
        }

        const salesTrends = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    paymentStatus: 'paid'
                }
            },
            { $unwind: '$items' },
            { $match: { 'items.product': { $in: productIds } } },
            {
                $group: {
                    _id: groupBy,
                    revenue: {
                        $sum: { $multiply: ['$items.price', '$items.quantity'] }
                    },
                    itemCount: { $sum: '$items.quantity' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);

        res.status(200).json({ success: true, data: salesTrends });
    } catch (error) {
        console.error('Vendor sales trends error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
