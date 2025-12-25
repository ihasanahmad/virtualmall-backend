const Wishlist = require('../models/Wishlist');

exports.getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user.id })
            .populate('products.product');

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user.id, products: [] });
        }

        res.json({ success: true, data: wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        let wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user.id,
                products: [{ product: productId }]
            });
        } else {
            const exists = wishlist.products.find(p => p.product.toString() === productId);
            if (exists) {
                return res.status(400).json({ message: 'Product already in wishlist' });
            }
            wishlist.products.push({ product: productId });
            await wishlist.save();
        }

        wishlist = await wishlist.populate('products.product');
        res.json({ success: true, data: wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        wishlist.products = wishlist.products.filter(
            p => p.product.toString() !== req.params.productId
        );
        await wishlist.save();

        res.json({ success: true, data: wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.clearWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user.id });

        if (wishlist) {
            wishlist.products = [];
            await wishlist.save();
        }

        res.json({ success: true, data: wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
