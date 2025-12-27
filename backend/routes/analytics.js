const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getAdminOverview,
    getRevenueAnalytics,
    getTopProducts,
    getVendorOverview,
    getVendorProductPerformance,
    getVendorSalesTrends
} = require('../controllers/analyticsController');

// Admin analytics routes
router.get('/admin/overview', protect, authorize('admin'), getAdminOverview);
router.get('/admin/revenue', protect, authorize('admin'), getRevenueAnalytics);
router.get('/admin/top-products', protect, authorize('admin'), getTopProducts);

// Vendor analytics routes
router.get('/vendor/overview', protect, authorize('vendor'), getVendorOverview);
router.get('/vendor/products', protect, authorize('vendor'), getVendorProductPerformance);
router.get('/vendor/sales-trends', protect, authorize('vendor'), getVendorSalesTrends);

module.exports = router;
