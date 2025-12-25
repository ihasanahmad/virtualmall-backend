const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview,
    markHelpful
} = require('../controllers/reviewController');

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/helpful', protect, markHelpful);

module.exports = router;
