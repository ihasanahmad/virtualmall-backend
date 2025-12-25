const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Create product review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
    try {
        const { product, rating, comment } = req.body;

        // Check if product exists
        const productExists = await Product.findById(product);
        if (!productExists) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            user: req.user.id,
            product
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        // Check if user purchased this product (verified purchase)
        const hasPurchased = await Order.findOne({
            customer: req.user.id,
            'items.product': product,
            status: 'delivered'
        });

        const review = await Review.create({
            user: req.user.id,
            product,
            rating,
            comment,
            isVerifiedPurchase: !!hasPurchased
        });

        // Update product rating
        await updateProductRating(product);

        const populatedReview = await Review.findById(review._id)
            .populate('user', 'name');

        res.status(201).json({
            success: true,
            data: populatedReview
        });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = { product: req.params.productId };

        // Sort options
        let sort = { createdAt: -1 }; // Default: newest first
        if (req.query.sort === 'highest') sort = { rating: -1 };
        if (req.query.sort === 'lowest') sort = { rating: 1 };
        if (req.query.sort === 'helpful') sort = { helpfulCount: -1 };

        const reviews = await Review.find(query)
            .populate('user', 'name')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const total = await Review.countDocuments(query);

        // Calculate rating distribution
        const ratingDistribution = await Review.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$rating',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: reviews,
            pagination: {
                page,
                pages: Math.ceil(total / limit),
                total
            },
            ratingDistribution
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res) => {
    try {
        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check ownership
        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this review' });
        }

        const { rating, comment } = req.body;
        review.rating = rating || review.rating;
        review.comment = comment || review.comment;
        await review.save();

        // Update product rating
        await updateProductRating(review.product);

        res.json({
            success: true,
            data: review
        });
    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check ownership or admin
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }

        const productId = review.product;
        await review.deleteOne();

        // Update product rating
        await updateProductRating(productId);

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
exports.markHelpful = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        review.helpfulCount = (review.helpfulCount || 0) + 1;
        await review.save();

        res.json({
            success: true,
            data: review
        });
    } catch (error) {
        console.error('Mark helpful error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Helper function to update product rating
async function updateProductRating(productId) {
    const stats = await Review.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: null,
                avgRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            rating: Math.round(stats[0].avgRating * 10) / 10, // Round to 1 decimal
            totalReviews: stats[0].totalReviews
        });
    } else {
        await Product.findByIdAndUpdate(productId, {
            rating: 0,
            totalReviews: 0
        });
    }
}

module.exports = {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview,
    markHelpful
};
