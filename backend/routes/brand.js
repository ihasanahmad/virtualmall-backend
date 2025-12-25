const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
    getBrands,
    getBrand,
    createBrand,
    updateBrand,
    approveBrand,
    rejectBrand
} = require('../controllers/brandController');

router.route('/')
    .get(getBrands)
    .post(protect, authorize('vendor'), upload.single('logo'), createBrand);

router.route('/:id')
    .get(getBrand)
    .put(protect, authorize('vendor', 'admin'), updateBrand);

router.put('/:id/approve', protect, authorize('admin'), approveBrand);
router.put('/:id/reject', protect, authorize('admin'), rejectBrand);

module.exports = router;
