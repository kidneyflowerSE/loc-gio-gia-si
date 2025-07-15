const Product = require('../models/product.model');
const { uploadToCloudinary, uploadMultipleToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Lấy tất cả sản phẩm
const getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 12, search, brand, minPrice, maxPrice, year, carModel, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        
        // Tạo filter object
        const filter = { isActive: true };
        
        if (search) {
            // Tìm kiếm trong nhiều trường khác nhau
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { code: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { origin: { $regex: search, $options: 'i' } },
                { material: { $regex: search, $options: 'i' } },
                { dimensions: { $regex: search, $options: 'i' } },
                { warranty: { $regex: search, $options: 'i' } },
                { 'compatibleModels.carModelName': { $regex: search, $options: 'i' } },
                { 'compatibleModels.years': search }
            ];
        }
        
        // Handle brand filter - support both ObjectId and brand name
        if (brand) {
            const Brand = require('../models/brand.model');
            // Check if brand is ObjectId format
            if (mongoose.Types.ObjectId.isValid(brand)) {
                filter.brand = brand;
            } else {
                // Find brand by name
                const brandDoc = await Brand.findOne({ name: { $regex: brand, $options: 'i' }, isActive: true });
                if (brandDoc) {
                    filter.brand = brandDoc._id;
                } else {
                    // If brand not found, return empty result
                    return res.json({
                        success: true,
                        data: [],
                        pagination: {
                            page: parseInt(page),
                            limit: parseInt(limit),
                            total: 0,
                            pages: 0
                        }
                    });
                }
            }
        }
        
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }
        
        if (year) {
            filter['compatibleModels.years'] = year;
        }
        
        if (carModel) {
            filter['compatibleModels.carModelName'] = { $regex: carModel, $options: 'i' };
        }
        
        // Tạo object sort dựa trên tham số sortBy và sortOrder
        const sortOptions = {};
        const validSortFields = ['createdAt', 'updatedAt', 'name', 'price', 'code'];
        const validSortOrders = ['asc', 'desc'];
        
        // Validate sortBy field
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
        // Validate sortOrder
        const order = validSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder.toLowerCase() : 'desc';
        
        sortOptions[sortField] = order === 'asc' ? 1 : -1;
        
        // Thực hiện query với populate brand
        const products = await Product.find(filter)
            .populate('brand', 'name isActive')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort(sortOptions);
        
        const total = await Product.countDocuments(filter);
        
        res.json({
            success: true,
            data: products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách sản phẩm',
            error: error.message
        });
    }
};

// Lấy sản phẩm theo ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('brand', 'name isActive');
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }
        
        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin sản phẩm',
            error: error.message
        });
    }
};

// Tạo sản phẩm mới
const createProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors: errors.array()
            });
        }
        
        const { name, code, brand, compatibleModels, price, description, stock, origin, material, dimensions, warranty } = req.body;
        
        // Validate brand exists
        const Brand = require('../models/brand.model');
        const brandDoc = await Brand.findById(brand);
        if (!brandDoc || !brandDoc.isActive) {
            return res.status(400).json({
                success: false,
                message: 'Hãng xe không hợp lệ hoặc đã bị vô hiệu hóa'
            });
        }
        
        // Validate compatibleModels if provided
        if (compatibleModels) {
            const parsedModels = JSON.parse(compatibleModels);
            for (const model of parsedModels) {
                const carModel = brandDoc.carModels.find(cm => 
                    cm._id.toString() === model.carModelId && cm.isActive
                );
                if (!carModel) {
                    return res.status(400).json({
                        success: false,
                        message: `Dòng xe với ID ${model.carModelId} không tồn tại trong hãng ${brandDoc.name} hoặc đã bị vô hiệu hóa`
                    });
                }
            }
        }
        
        // Xử lý upload ảnh lên Cloudinary
        let images = [];
        if (req.files && req.files.length > 0) {
            const uploadResults = await uploadMultipleToCloudinary(req.files, 'products');
            images = uploadResults.map(result => ({
                public_id: result.public_id,
                url: result.url,
                width: result.width,
                height: result.height,
                alt: name
            }));
        }
        
        // Tạo sản phẩm mới
        const product = new Product({
            name,
            code,
            brand,
            compatibleModels: compatibleModels ? JSON.parse(compatibleModels) : [],
            price,
            description,
            stock: stock || 0,
            origin: origin || '',
            material: material || '',
            dimensions: dimensions || '',
            warranty: warranty || '',
            images
        });
        
        await product.save();
        
        // Populate brand info before returning
        await product.populate('brand', 'name isActive');
        
        res.status(201).json({
            success: true,
            message: 'Tạo sản phẩm thành công',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo sản phẩm',
            error: error.message
        });
    }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors: errors.array()
            });
        }
        
        const productId = req.params.id;
        const { name, code, brand, compatibleModels, price, description, stock, origin, material, dimensions, warranty, removeImages } = req.body;
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }
        
        // Xử lý xóa ảnh cũ nếu có
        if (removeImages && removeImages.length > 0) {
            const imagesToRemove = Array.isArray(removeImages) ? removeImages : [removeImages];
            
            for (const publicId of imagesToRemove) {
                await deleteFromCloudinary(publicId);
                product.images = product.images.filter(img => img.public_id !== publicId);
            }
        }
        
        // Xử lý upload ảnh mới
        if (req.files && req.files.length > 0) {
            const uploadResults = await uploadMultipleToCloudinary(req.files, 'products');
            const newImages = uploadResults.map(result => ({
                public_id: result.public_id,
                url: result.url,
                width: result.width,
                height: result.height,
                alt: name || product.name
            }));
            
            product.images = [...product.images, ...newImages];
        }
        
        // Cập nhật thông tin sản phẩm
        if (name) product.name = name;
        if (code) product.code = code;
        if (brand) {
            // Validate brand exists
            const Brand = require('../models/brand.model');
            const brandDoc = await Brand.findById(brand);
            if (!brandDoc || !brandDoc.isActive) {
                return res.status(400).json({
                    success: false,
                    message: 'Hãng xe không hợp lệ hoặc đã bị vô hiệu hóa'
                });
            }
            product.brand = brand;
        }
        if (compatibleModels) {
            const parsedModels = JSON.parse(compatibleModels);
            // Validate compatibleModels with current brand
            const Brand = require('../models/brand.model');
            const brandDoc = await Brand.findById(product.brand);
            
            for (const model of parsedModels) {
                const carModel = brandDoc.carModels.find(cm => 
                    cm._id.toString() === model.carModelId && cm.isActive
                );
                if (!carModel) {
                    return res.status(400).json({
                        success: false,
                        message: `Dòng xe với ID ${model.carModelId} không tồn tại trong hãng ${brandDoc.name} hoặc đã bị vô hiệu hóa`
                    });
                }
            }
            product.compatibleModels = parsedModels;
        }
        if (price) product.price = price;
        if (description) product.description = description;
        if (stock !== undefined) product.stock = stock;
        if (origin !== undefined) product.origin = origin;
        if (material !== undefined) product.material = material;
        if (dimensions !== undefined) product.dimensions = dimensions;
        if (warranty !== undefined) product.warranty = warranty;
        
        await product.save();
        
        // Populate brand info before returning
        await product.populate('brand', 'name isActive');
        
        res.json({
            success: true,
            message: 'Cập nhật sản phẩm thành công',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật sản phẩm',
            error: error.message
        });
    }
};

// Xóa sản phẩm
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }
        
        // Xóa tất cả ảnh trên Cloudinary
        if (product.images && product.images.length > 0) {
            for (const image of product.images) {
                await deleteFromCloudinary(image.public_id);
            }
        }
        
        await Product.findByIdAndDelete(req.params.id);
        
        res.json({
            success: true,
            message: 'Xóa sản phẩm thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa sản phẩm',
            error: error.message
        });
    }
};

// Tìm kiếm sản phẩm theo mã lọc
const searchByCode = async (req, res) => {
    try {
        const { code } = req.params;
        
        const product = await Product.findOne({ code, isActive: true })
            .populate('brand', 'name isActive');
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm với mã lọc này'
            });
        }
        
        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tìm kiếm sản phẩm',
            error: error.message
        });
    }
};

// Lấy sản phẩm theo hãng xe
const getProductsByBrand = async (req, res) => {
    try {
        const { brand } = req.params;
        const { page = 1, limit = 12 } = req.query;
        
        // Handle brand parameter - support both ObjectId and brand name
        let brandFilter;
        if (mongoose.Types.ObjectId.isValid(brand)) {
            brandFilter = brand;
        } else {
            // Find brand by name
            const Brand = require('../models/brand.model');
            const brandDoc = await Brand.findOne({ name: { $regex: brand, $options: 'i' }, isActive: true });
            if (!brandDoc) {
                return res.json({
                    success: true,
                    data: [],
                    pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total: 0,
                        pages: 0
                    }
                });
            }
            brandFilter = brandDoc._id;
        }
        
        const products = await Product.find({ brand: brandFilter, isActive: true })
            .populate('brand', 'name isActive')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });
        
        const total = await Product.countDocuments({ brand: brandFilter, isActive: true });
        
        res.json({
            success: true,
            data: products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy sản phẩm theo hãng',
            error: error.message
        });
    }
};

// Lấy sản phẩm theo dòng xe
const getProductsByCarModel = async (req, res) => {
    try {
        const { carModel } = req.params;
        const { page = 1, limit = 12 } = req.query;
        
        const products = await Product.find({ 
                'compatibleModels.carModelName': { $regex: carModel, $options: 'i' }, 
                isActive: true 
            })
            .populate('brand', 'name isActive')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });
        
        const total = await Product.countDocuments({ 
            'compatibleModels.carModelName': { $regex: carModel, $options: 'i' }, 
            isActive: true 
        });
        
        res.json({
            success: true,
            data: products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy sản phẩm theo dòng xe',
            error: error.message
        });
    }
};

// Cập nhật trạng thái sản phẩm
const updateProductStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        
        const product = await Product.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        ).populate('brand', 'name isActive');
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }
        
        res.json({
            success: true,
            message: 'Cập nhật trạng thái sản phẩm thành công',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật trạng thái sản phẩm',
            error: error.message
        });
    }
};

// Helper function để lấy compatible models từ brand
const getCompatibleModelsByBrand = async (req, res) => {
    try {
        const { brandId } = req.params;
        const Brand = require('../models/brand.model');
        
        const brand = await Brand.findById(brandId);
        if (!brand) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy hãng xe'
            });
        }

        const activeCarModels = brand.carModels.filter(model => model.isActive);
        
        res.json({
            success: true,
            data: {
                brandId: brand._id,
                brandName: brand.name,
                carModels: activeCarModels
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách dòng xe',
            error: error.message
        });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchByCode,
    getProductsByBrand,
    getProductsByCarModel,
    updateProductStatus,
    getCompatibleModelsByBrand
};
