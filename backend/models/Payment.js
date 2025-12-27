const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    method: {
        type: String,
        enum: ['cod', 'jazzcash', 'easypaisa', 'stripe'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    transactionId: String,
    paymentData: {
        // Store gateway-specific data
        type: mongoose.Schema.Types.Mixed
    },
    refundData: {
        refundId: String,
        refundedAt: Date,
        refundAmount: Number,
        reason: String
    },
    metadata: {
        ipAddress: String,
        userAgent: String
    }
}, {
    timestamps: true
});

// Index for faster queries
paymentSchema.index({ order: 1 });
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ transactionId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
