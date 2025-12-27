const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

// CORS configuration
const corsOptions = {
    origin: [
        process.env.FRONTEND_URL,
        process.env.ADMIN_URL,
        process.env.VENDOR_URL,
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'https://virtualmegamall.vercel.app',
        'https://virtualmall-admin.vercel.app',
        'https://virtualmall-vendor.vercel.app'
    ],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const categoryRoutes = require('./routes/category');
const brandRoutes = require('./routes/brand');
const orderRoutes = require('./routes/order');
const reviewRoutes = require('./routes/review');
const wishlistRoutes = require('./routes/wishlist');
const couponRoutes = require('./routes/coupon');
const paymentRoutes = require('./routes/payment');
const analyticsRoutes = require('./routes/analytics');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Virtual Mega Mall API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            products: '/api/products',
            categories: '/api/categories',
            brands: '/api/brands',
            orders: '/api/orders',
            reviews: '/api/reviews',
            wishlist: '/api/wishlist',
            coupons: '/api/coupons',
            payments: '/api/payments',
            analytics: '/api/analytics'
        }
    });
});

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║       🏢 Virtual Mega Mall API Server Running        ║
║                                                       ║
║       Environment: ${process.env.NODE_ENV?.toUpperCase() || 'DEVELOPMENT'}                          ║
║       Port: ${PORT}                                       ║
║       Database: Connected to MongoDB                 ║
║                                                       ║
║       API Base: http://localhost:${PORT}/api           ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);

    // Initialize Socket.io
    const socketHandler = require('./socket/socketHandler');
    socketHandler.init(server);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});

module.exports = app;
