const express = require('express');
const router = express.Router();
const productController = require('../controller/product.controller');
const { uploadMultiple, handleUploadError, cleanupTempFiles } = require('../middleware/upload.middleware');
const { authenticateToken } = require('../middleware/auth.middleware');
const { body } = require('express-validator');

// Validation middleware
const validateProduct = [
    body('name').notEmpty().withMessage('Tên sản phẩm là bắt buộc'),
    body('code').notEmpty().withMessage('Mã lọc là bắt buộc'),
    body('brand').notEmpty().withMessage('Hãng xe là bắt buộc'),
    body('carModels').notEmpty().withMessage('Dòng xe là bắt buộc'),
    body('year').isInt({ min: 1900, max: new Date().getFullYear() + 5 }).withMessage('Năm không hợp lệ'),
    body('price').isFloat({ min: 0 }).withMessage('Giá bán phải là số dương'),
    body('costPrice').isFloat({ min: 0 }).withMessage('Giá vốn phải là số dương'),
    body('description').notEmpty().withMessage('Mô tả là bắt buộc'),
    body('stock').isInt({ min: 0 }).withMessage('Số lượng tồn phải là số nguyên không âm')
];

// Routes công khai (không cần xác thực)
router.get('/', productController.getAllProducts);
router.get('/search/:code', productController.searchByCode);
router.get('/brand/:brand', productController.getProductsByBrand);
router.get('/car-model/:carModel', productController.getProductsByCarModel);
router.get('/:id', productController.getProductById);

// Routes quản trị (cần xác thực)
router.post('/', 
    authenticateToken, 
    uploadMultiple, 
    cleanupTempFiles,
    validateProduct,
    handleUploadError,
    productController.createProduct
);

router.put('/:id', 
    authenticateToken, 
    uploadMultiple, 
    cleanupTempFiles,
    validateProduct,
    handleUploadError,
    productController.updateProduct
);

router.delete('/:id', 
    authenticateToken, 
    productController.deleteProduct
);

router.patch('/:id/status', 
    authenticateToken, 
    productController.updateProductStatus
);

module.exports = router;
