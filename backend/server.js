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
app.use(helmet()); // Set security headers
app.use(xss()); // Prevent XSS attacks
app.use(mongoSanitize()); // Prevent NoSQL injection


// CORS configuration
const corsOptions = {
    origin: [
        process.env.FRONTEND_URL,
        process.env.ADMIN_URL,
        process.env.VENDOR_URL,
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'https://virtualmegamall.vercel.app'
    ],
    credentials: true,
    optionsSuccessStatus: 200
