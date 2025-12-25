const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true,
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand'
        },
        name: String,
        image: String,
        price: Number,
        quantity: Number,
        variant: {
            name: String,
            value: String
        },
        vendorStatus: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending'
        },
        shippedAt: Date,
        deliveredAt: Date
    }],
    shippingAddress: {
        fullName: String,
        phone: String,
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        postalCode: String
    },
    subtotal: {
        type: Number,
        required: true
    },
    shippingCost: {
        type: Number,
        default: 0
    },
    tax: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['jazzcash', 'easypaisa', 'stripe'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentDetails: {
        transactionId: String,
        provider: String,
        paidAt: Date
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    commissionRecords: [{
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand'
        },
        itemsTotal: Number,
        commissionRate: Number,
        commissionAmount: Number,
        status: {
            type: String,
            enum: ['pending', 'paid'],
            default: 'pending'
        },
        paidAt: Date
    }],
    trackingNumber: String,
    notes: String,
    cancelledAt: Date,
    cancelReason: String,
    deliveredAt: Date
}, {
    timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', function (next) {
    if (!this.orderNumber) {
        this.orderNumber = 'VMM' + Date.now() + Math.floor(Math.random() * 1000);
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
