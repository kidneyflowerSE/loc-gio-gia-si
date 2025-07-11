const express = require('express');
const router = express.Router();
const productController = require('../controller/product.controller');
const { uploadMultiple, handleUploadError, cleanupTempFiles } = require('../middleware/upload.middleware');
const { authMiddleware } = require('../middleware/auth.middleware');
const { body } = require('express-validator');

// Validation middleware
const validateProduct = [
    body('name').notEmpty().withMessage('Tên sản phẩm là bắt buộc'),
    body('code').notEmpty().withMessage('Mã lọc là bắt buộc'),
    body('brand').notEmpty().withMessage('Hãng xe là bắt buộc'),
    body('compatibleModels').optional().isArray().withMessage('Danh sách dòng xe tương thích phải là mảng'),
    body('price').isFloat({ min: 0 }).withMessage('Giá bán phải là số dương'),
    body('description').notEmpty().withMessage('Mô tả là bắt buộc'),
    body('stock').isInt({ min: 0 }).withMessage('Số lượng tồn phải là số nguyên không âm')
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
