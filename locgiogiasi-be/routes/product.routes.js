const express = require('express');
const router = express.Router();
const productController = require('../controller/product.controller');
const { uploadMultiple, handleUploadError, cleanupTempFiles } = require('../middleware/upload.middleware');
const { authMiddleware } = require('../middleware/auth.middleware');
const { body } = require('express-validator');
const mongoose = require('mongoose');

// Validation middleware
const validateProduct = [
    body('name').notEmpty().withMessage('Tên sản phẩm là bắt buộc'),
    body('code').notEmpty().withMessage('Mã lọc là bắt buộc'),
    body('brand')
        .notEmpty().withMessage('Hãng xe là bắt buộc')
        .custom(value => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error('Brand ID không hợp lệ');
            }
            return true;
        }),
    body('compatibleModels')
        .optional()
        .custom(value => {
            try {
                if (typeof value === 'string') {
                    const parsed = JSON.parse(value);
                    if (!Array.isArray(parsed)) {
                        throw new Error('compatibleModels phải là mảng');
                    }
                    for (const model of parsed) {
                        if (!model.carModelId || !mongoose.Types.ObjectId.isValid(model.carModelId)) {
                            throw new Error('carModelId trong compatibleModels không hợp lệ');
                        }
                        if (!model.carModelName || typeof model.carModelName !== 'string') {
                            throw new Error('carModelName trong compatibleModels là bắt buộc');
                        }
                        if (!model.years || !Array.isArray(model.years) || model.years.length === 0) {
                            throw new Error('years trong compatibleModels phải là mảng không rỗng');
                        }
                    }
                }
                return true;
            } catch (error) {
                throw new Error('compatibleModels không đúng định dạng: ' + error.message);
            }
        }),
    body('price').isFloat({ min: 0 }).withMessage('Giá bán phải là số dương'),
    body('description').notEmpty().withMessage('Mô tả là bắt buộc'),
    body('stock').isInt({ min: 0 }).withMessage('Số lượng tồn phải là số nguyên không âm'),
    body('origin').optional().isLength({ max: 100 }).withMessage('Xuất xứ không được quá 100 ký tự'),
    body('material').optional().isLength({ max: 100 }).withMessage('Chất liệu không được quá 100 ký tự'),
    body('dimensions').optional().isLength({ max: 100 }).withMessage('Kích thước không được quá 100 ký tự'),
    body('warranty').optional().isLength({ max: 50 }).withMessage('Thời gian bảo hành không được quá 50 ký tự')
];

// Routes công khai (không cần xác thực)
router.get('/', productController.getAllProducts);
router.get('/search/:code', productController.searchByCode);
router.get('/brand/:brand', productController.getProductsByBrand);
router.get('/brand/:brandId/car-models', productController.getCompatibleModelsByBrand);
router.get('/car-model/:carModel', productController.getProductsByCarModel);
router.get('/:id', productController.getProductById);

// Routes quản trị (cần xác thực)
router.post('/', 
    authMiddleware, 
    uploadMultiple, 
    cleanupTempFiles,
    validateProduct,
    handleUploadError,
    productController.createProduct
);

router.put('/:id', 
    authMiddleware, 
    uploadMultiple, 
    cleanupTempFiles,
    validateProduct,
    handleUploadError,
    productController.updateProduct
);

router.delete('/:id', 
    authMiddleware, 
    productController.deleteProduct
);

router.patch('/:id/status', 
    authMiddleware, 
    productController.updateProductStatus
);

module.exports = router;
