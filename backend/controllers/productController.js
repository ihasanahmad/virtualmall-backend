const Product = require('../models/Product');
const Brand = require('../models/Brand');
const cloudinary = require('../config/cloudinary');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Build query
        let query = { isActive: true };

        // Filter by category
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Filter by brand
        if (req.query.brand) {
            query.brand = req.query.brand;
        }

        // Filter by price range
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
        }

        // Search by name
        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // Sort
        let sortBy = {};
        if (req.query.sort) {
            switch (req.query.sort) {
                case 'price-asc':
                    sortBy.price = 1;
                    break;
                case 'price-desc':
                    sortBy.price = -1;
                    break;
                case 'newest':
                    sortBy.createdAt = -1;
                    break;
                case 'popular':
                    sortBy.totalSales = -1;
                    break;
                default:
                    sortBy.createdAt = -1;
            }
        } else {
            sortBy.createdAt = -1;
        }

        const products = await Product.find(query)
            .populate('brand', 'name logo slug')
            .populate('category', 'name slug')
            .sort(sortBy)
            .limit(limit)
            .skip(skip);

        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('brand', 'name logo slug storeCustomization')
            .populate('category', 'name slug');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Increment views
        product.views += 1;
        await product.save();

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private (Vendor only)
exports.createProduct = async (req, res) => {
    try {
        // Get vendor's brand
        const brand = await Brand.findOne({ owner: req.user.id, status: 'approved' });

        if (!brand) {
            return res.status(403).json({
                success: false,
                message: 'You must have an approved brand to create products'
            });
        }

        // Add brand to product data
        req.body.brand = brand._id;

        // Handle image uploads if present
        if (req.files && req.files.length > 0) {
            const imageUploads = req.files.map(file => {
                return new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { folder: 'virtual-mega-mall/products' },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve({
                                url: result.secure_url,
                                publicId: result.public_id,
                                isDefault: false
                            });
                        }
                    ).end(file.buffer);
                });
            });

            const images = await Promise.all(imageUploads);
            if (images.length > 0) {
                images[0].isDefault = true;
            }
            req.body.images = images;
        }

        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Vendor only)
exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id).populate('brand');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check ownership
        if (product.brand.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this product'
            });
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Vendor only)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('brand');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check ownership
        if (product.brand.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this product'
            });
        }

        // Delete images from Cloudinary
        if (product.images && product.images.length > 0) {
            const deletePromises = product.images.map(img =>
                cloudinary.uploader.destroy(img.publicId)
            );
            await Promise.all(deletePromises);
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
