const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

router.route('/')
    .get(getProducts)
    .post(protect, authorize('vendor', 'admin'), upload.array('images', 5), createProduct);

router.route('/:id')
    .get(getProduct)
    .put(protect, authorize('vendor', 'admin'), updateProduct)
    .delete(protect, authorize('vendor', 'admin'), deleteProduct);

module.exports = router;
