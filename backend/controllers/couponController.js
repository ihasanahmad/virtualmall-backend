const Coupon = require('../models/Coupon');

exports.validateCoupon = async (req, res) => {
    try {
        const { code, cartTotal } = req.body;

        const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });

        if (!coupon) {
            return res.status(404).json({ message: 'Invalid coupon code' });
        }

        // Check expiration
        if (new Date() > new Date(coupon.validUntil)) {
            return res.status(400).json({ message: 'Coupon has expired' });
        }

        if (new Date() < new Date(coupon.validFrom)) {
            return res.status(400).json({ message: 'Coupon is not yet valid' });
        }

        // Check usage limit
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ message: 'Coupon usage limit reached' });
        }

        // Check minimum purchase
        if (cartTotal < coupon.minPurchase) {
            return res.status(400).json({
                message: `Minimum purchase of Rs. ${coupon.minPurchase} required`
            });
        }

        // Calculate discount
        let discount = 0;
        if (coupon.discountType === 'percentage') {
            discount = (cartTotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount) {
                discount = Math.min(discount, coupon.maxDiscount);
            }
        } else {
            discount = coupon.discountValue;
        }

        res.json({
            success: true,
            data: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                discount: Math.round(discount)
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
