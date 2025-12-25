const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide product name'],
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, 'Please provide product description']
    },
    barcode: {
        type: String,
        unique: true,
        sparse: true, // Allows multiple null values
        trim: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    images: [{
        url: String,
        publicId: String, // Cloudinary public ID for deletion
        isDefault: {
            type: Boolean,
            default: false
        }
    }],
    price: {
        type: Number,
        required: [true, 'Please provide product price'],
        min: 0
    },
    compareAtPrice: {
        type: Number, // Original price for showing discounts
        min: 0
    },
    inventory: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    lowStockThreshold: {
        type: Number,
        default: 10
    },
    variants: [{
        name: String, // e.g., "Size", "Color"
        options: [{
            value: String, // e.g., "Large", "Red"
            price: Number, // Price adjustment for this variant
            inventory: Number,
            sku: String
        }]
    }],
    specifications: [{
        key: String,
        value: String
    }],
    sku: {
        type: String,
        unique: true,
        sparse: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'out-of-stock', 'discontinued'],
        default: 'active'
    },
    isFlashSale: {
        type: Boolean,
        default: false
    },
    flashSaleDiscount: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    flashSaleEnds: Date,
    isFeatured: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    totalSales: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    tags: [String],
    seoTitle: String,
    seoDescription: String,
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Create slug before saving
productSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = this.name.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            + '-' + Date.now();
    }
    next();
});

// Virtual for final price (considering flash sale)
productSchema.virtual('finalPrice').get(function () {
    if (this.isFlashSale && this.flashSaleEnds > new Date()) {
        return this.price - (this.price * this.flashSaleDiscount / 100);
    }
    return this.price;
});

// Update stock status based on inventory
productSchema.pre('save', function (next) {
    if (this.inventory <= 0) {
        this.status = 'out-of-stock';
    } else if (this.status === 'out-of-stock' && this.inventory > 0) {
        this.status = 'active';
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);
