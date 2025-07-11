const Brand = require('../models/brand.model');
const { validationResult } = require('express-validator');

const brandController = {
    // Lấy tất cả brands
    getAllBrands: async (req, res) => {
        try {
            const { 
                page = 1, 
                limit = 10, 
                search = '', 
                isActive,
                sortBy = 'name',
                sortOrder = 'asc'
            } = req.query;

            const query = {};
            
            // Filter theo trạng thái
            if (isActive !== undefined) {
                query.isActive = isActive === 'true';
            }

            // Filter theo search
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } }
                ];
            }

            const sortOptions = {};
            sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

            const skip = (parseInt(page) - 1) * parseInt(limit);

            const brands = await Brand.find(query)
                .sort(sortOptions)
                .skip(skip)
                .limit(parseInt(limit));

            const total = await Brand.countDocuments(query);
            const totalPages = Math.ceil(total / parseInt(limit));

            res.json({
                success: true,
                data: brands,
                pagination: {
                    current: parseInt(page),
                    pages: totalPages,
                    total,
                    limit: parseInt(limit)
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách hãng xe',
                error: error.message
            });
        }
    },

    // Lấy brand theo ID
    getBrandById: async (req, res) => {
        try {
            const brand = await Brand.findById(req.params.id);
            
            if (!brand) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy hãng xe'
                });
            }

            res.json({
                success: true,
                data: brand
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy thông tin hãng xe',
                error: error.message
            });
        }
    },

    // Tạo brand mới
    createBrand: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Dữ liệu không hợp lệ',
                    errors: errors.array()
                });
            }

            const brandData = req.body;
            
            // Check if brand already exists
            const existingBrand = await Brand.findOne({
                name: brandData.name
            });

            if (existingBrand) {
                return res.status(400).json({
                    success: false,
                    message: 'Hãng xe đã tồn tại'
                });
            }

            const brand = new Brand(brandData);
            await brand.save();

            res.status(201).json({
                success: true,
                message: 'Tạo hãng xe thành công',
                data: brand
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi tạo hãng xe',
                error: error.message
            });
        }
    },

    // Cập nhật brand
    updateBrand: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Dữ liệu không hợp lệ',
                    errors: errors.array()
                });
            }

            const brand = await Brand.findById(req.params.id);
            
            if (!brand) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy hãng xe'
                });
            }

            // Check if name already exists (except current brand)
            const existingBrand = await Brand.findOne({
                _id: { $ne: req.params.id },
                name: req.body.name
            });

            if (existingBrand) {
                return res.status(400).json({
                    success: false,
                    message: 'Tên hãng xe đã tồn tại'
                });
            }

            Object.assign(brand, req.body);
            await brand.save();

            res.json({
                success: true,
                message: 'Cập nhật hãng xe thành công',
                data: brand
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật hãng xe',
                error: error.message
            });
        }
    },

    // Xóa brand
    deleteBrand: async (req, res) => {
        try {
            const brand = await Brand.findById(req.params.id);
            
            if (!brand) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy hãng xe'
                });
            }

            await Brand.findByIdAndDelete(req.params.id);

            res.json({
                success: true,
                message: 'Xóa hãng xe thành công'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa hãng xe',
                error: error.message
            });
        }
    },

    // Thêm car model vào brand
    addCarModel: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Dữ liệu không hợp lệ',
                    errors: errors.array()
                });
            }

            const brand = await Brand.findById(req.params.id);
            
            if (!brand) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy hãng xe'
                });
            }

            const carModelData = req.body;

            brand.carModels.push(carModelData);
            await brand.save();

            res.json({
                success: true,
                message: 'Thêm dòng xe thành công',
                data: brand
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi thêm dòng xe',
                error: error.message
            });
        }
    },

    // Cập nhật car model
    updateCarModel: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Dữ liệu không hợp lệ',
                    errors: errors.array()
                });
            }

            const brand = await Brand.findById(req.params.id);
            
            if (!brand) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy hãng xe'
                });
            }

            const carModel = brand.carModels.id(req.params.modelId);
            if (!carModel) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy dòng xe'
                });
            }

            Object.assign(carModel, req.body);
            await brand.save();

            res.json({
                success: true,
                message: 'Cập nhật dòng xe thành công',
                data: brand
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật dòng xe',
                error: error.message
            });
        }
    },

    // Xóa car model
    deleteCarModel: async (req, res) => {
        try {
            const brand = await Brand.findById(req.params.id);
            
            if (!brand) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy hãng xe'
                });
            }

            const carModel = brand.carModels.id(req.params.modelId);
            if (!carModel) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy dòng xe'
                });
            }

            brand.carModels.pull(req.params.modelId);
            await brand.save();

            res.json({
                success: true,
                message: 'Xóa dòng xe thành công',
                data: brand
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa dòng xe',
                error: error.message
            });
        }
    },

    // Lấy tất cả car models của một brand
    getCarModelsByBrand: async (req, res) => {
        try {
            const brand = await Brand.findById(req.params.id);
            
            if (!brand) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy hãng xe'
                });
            }

            const { isActive } = req.query;
            let carModels = brand.carModels;

            // Filter theo trạng thái
            if (isActive !== undefined) {
                carModels = carModels.filter(model => model.isActive === (isActive === 'true'));
            }

            res.json({
                success: true,
                data: {
                    brand: {
                        _id: brand._id,
                        name: brand.name
                    },
                    carModels
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách dòng xe',
                error: error.message
            });
        }
    },

    // Thêm dòng xe vào hãng
    addCarModel: async (req, res) => {
        try {
            const { brandId } = req.params;
            const { name, years } = req.body;

            if (!name || !years || !Array.isArray(years)) {
                return res.status(400).json({
                    success: false,
                    message: 'Tên dòng xe và danh sách năm sản xuất là bắt buộc'
                });
            }

            const brand = await Brand.findById(brandId);
            if (!brand) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy hãng xe'
                });
            }

            // Kiểm tra trùng tên dòng xe
            const existingModel = brand.carModels.find(model => 
                model.name.toLowerCase() === name.toLowerCase()
            );

            if (existingModel) {
                return res.status(400).json({
                    success: false,
                    message: 'Dòng xe đã tồn tại trong hãng này'
                });
            }

            const newCarModel = {
                name,
                years,
                isActive: true,
                createdAt: new Date()
            };

            brand.carModels.push(newCarModel);
            await brand.save();

            res.json({
                success: true,
                message: 'Thêm dòng xe thành công',
                data: brand.carModels[brand.carModels.length - 1]
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi thêm dòng xe',
                error: error.message
            });
        }
    },

    // Cập nhật dòng xe
    updateCarModel: async (req, res) => {
        try {
            const { brandId, carModelId } = req.params;
            const { name, years, isActive } = req.body;

            const brand = await Brand.findById(brandId);
            if (!brand) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy hãng xe'
                });
            }

            const carModel = brand.carModels.id(carModelId);
            if (!carModel) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy dòng xe'
                });
            }

            if (name) carModel.name = name;
            if (years) carModel.years = years;
            if (isActive !== undefined) carModel.isActive = isActive;

            await brand.save();

            res.json({
                success: true,
                message: 'Cập nhật dòng xe thành công',
                data: carModel
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật dòng xe',
                error: error.message
            });
        }
    },

    // Xóa dòng xe
    deleteCarModel: async (req, res) => {
        try {
            const { brandId, carModelId } = req.params;

            const brand = await Brand.findById(brandId);
            if (!brand) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy hãng xe'
                });
            }

            const carModel = brand.carModels.id(carModelId);
            if (!carModel) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy dòng xe'
                });
            }

            // Kiểm tra xem có sản phẩm nào đang sử dụng dòng xe này không
            const Product = require('../models/product.model');
            const productCount = await Product.countDocuments({
                'compatibleModels.carModelId': carModelId
            });

            if (productCount > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Không thể xóa dòng xe vì có ${productCount} sản phẩm đang sử dụng`
                });
            }

            brand.carModels.pull(carModelId);
            await brand.save();

            res.json({
                success: true,
                message: 'Xóa dòng xe thành công'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa dòng xe',
                error: error.message
            });
        }
    }
};

module.exports = brandController;
