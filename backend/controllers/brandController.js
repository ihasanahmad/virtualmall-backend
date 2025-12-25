const Brand = require('../models/Brand');
const cloudinary = require('../config/cloudinary');

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
exports.getBrands = async (req, res) => {
    try {
        let query = { isActive: true };

        // Filter by status (admin can see all statuses)
        if (req.query.status && req.user && req.user.role === 'admin') {
            query.status = req.query.status;
        } else {
            query.status = 'approved'; // Public only sees approved brands
        }

        const brands = await Brand.find(query)
            .select('-bankDetails -businessInfo') // Hide sensitive info
            .populate('owner', 'name email')
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: brands.length,
            data: brands
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single brand
// @route   GET /api/brands/:id
// @access  Public
exports.getBrand = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id)
            .select('-bankDetails -businessInfo')
            .populate('owner', 'name email');

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: 'Brand not found'
            });
        }

        res.status(200).json({
            success: true,
            data: brand
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Register/create brand
// @route   POST /api/brands
// @access  Private (Vendor role)
exports.createBrand = async (req, res) => {
    try {
        // Check if user already has a brand
        const existingBrand = await Brand.findOne({ owner: req.user.id });
        if (existingBrand) {
            return res.status(400).json({
                success: false,
                message: 'You already have a brand registered. Each vendor can only have one brand.'
            });
        }

        // Set owner to current user
        req.body.owner = req.user.id;

        // Handle logo upload if present
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: 'virtual-mega-mall/brands' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(req.file.buffer);
            });
            req.body.logo = result.secure_url;
        }

        const brand = await Brand.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Brand registration submitted for approval',
            data: brand
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update brand
// @route   PUT /api/brands/:id
// @access  Private (Vendor owner or Admin)
exports.updateBrand = async (req, res) => {
    try {
        let brand = await Brand.findById(req.params.id);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: 'Brand not found'
            });
        }

        // Check ownership (vendor can only update their own brand, admin can update any)
        if (brand.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this brand'
            });
        }

        // Vendors cannot change their own status or commission rate
        if (req.user.role !== 'admin') {
            delete req.body.status;
            delete req.body.commissionRate;
            delete req.body.categoryCommissions;
        }

        brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: brand
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Approve brand (Admin only)
// @route   PUT /api/brands/:id/approve
// @access  Private/Admin
exports.approveBrand = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: 'Brand not found'
            });
        }

        brand.status = 'approved';
        brand.approvedAt = Date.now();
        await brand.save();

        // TODO: Send approval email to vendor

        res.status(200).json({
            success: true,
            message: 'Brand approved successfully',
            data: brand
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Reject brand (Admin only)
// @route   PUT /api/brands/:id/reject
// @access  Private/Admin
exports.rejectBrand = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: 'Brand not found'
            });
        }

        brand.status = 'rejected';
        brand.rejectedReason = req.body.reason || 'Not specified';
        await brand.save();

        // TODO: Send rejection email to vendor

        res.status(200).json({
            success: true,
            message: 'Brand rejected',
            data: brand
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
