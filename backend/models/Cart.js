const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand'
        },
        name: String, // Store product name at time of adding
        price: Number, // Store price at time of adding
        image: String,
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        variant: {
            name: String,
            value: String
        }
    }],
    subtotal: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Calculate subtotal before saving
cartSchema.pre('save', function (next) {
    this.subtotal = this.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
    next();
});

module.exports = mongoose.model('Cart', cartSchema);
