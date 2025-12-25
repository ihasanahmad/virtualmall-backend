const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide brand name'],
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, 'Please provide brand description']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    logo: {
        type: String,
        required: [true, 'Please provide brand logo']
    },
    banner: {
        type: String,
        default: '/images/default-banner.jpg'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'suspended'],
        default: 'pending'
    },
    commissionRate: {
        type: Number,
        default: 15, // Default 15% commission
        min: 0,
        max: 100
    },
    categoryCommissions: [{
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        },
        rate: {
            type: Number,
            min: 0,
            max: 100
        }
    }],
    businessInfo: {
        legalName: String,
        taxId: String,
        registrationNumber: String,
        businessType: String
    },
    bankDetails: {
        accountName: String,
        accountNumber: String,
        bankName: String,
        branchCode: String,
        iban: String
    },
    contactInfo: {
        email: String,
        phone: String,
        website: String,
        socialMedia: {
            facebook: String,
            instagram: String,
            twitter: String
        }
    },
    storeCustomization: {
        primaryColor: {
            type: String,
            default: '#1a1a1a'
        },
        accentColor: {
            type: String,
            default: '#d4af37'
        },
        aboutUs: String
    },
    totalSales: {
        type: Number,
        default: 0
    },
    totalRevenue: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    approvedAt: Date,
    rejectedReason: String
}, {
    timestamps: true
});

// Create slug before saving
brandSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }
    next();
});

module.exports = mongoose.model('Brand', brandSchema);
