const express = require('express');
const router = express.Router();
const brandController = require('../controller/brand.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { body } = require('express-validator');

// Validation rules
const brandValidation = [
    body('name')
        .notEmpty()
        .withMessage('Tên hãng xe không được để trống')
        .isLength({ min: 2, max: 100 })
        .withMessage('Tên hãng xe phải từ 2-100 ký tự'),
    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('Trạng thái phải là boolean')
];

const carModelValidation = [
    body('name')
        .notEmpty()
        .withMessage('Tên dòng xe không được để trống')
        .isLength({ min: 2, max: 100 })
        .withMessage('Tên dòng xe phải từ 2-100 ký tự'),
    body('years')
        .isArray({ min: 1 })
        .withMessage('Phải có ít nhất một năm sản xuất'),
    body('years.*')
        .matches(/^\d{4}$/)
        .withMessage('Năm sản xuất phải là số 4 chữ số'),
    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('Trạng thái phải là boolean')
];

// Public routes
router.get('/', brandController.getAllBrands);
router.get('/:id', brandController.getBrandById);
router.get('/:id/car-models', brandController.getCarModelsByBrand);

// Protected routes (require admin authentication)
router.post('/', authMiddleware, ...brandValidation, brandController.createBrand);
router.put('/:id', authMiddleware, ...brandValidation, brandController.updateBrand);
router.delete('/:id', authMiddleware, brandController.deleteBrand);

// Car model routes
router.post('/:brandId/car-models', authMiddleware, ...carModelValidation, brandController.addCarModel);
router.put('/:brandId/car-models/:carModelId', authMiddleware, ...carModelValidation, brandController.updateCarModel);
router.delete('/:brandId/car-models/:carModelId', authMiddleware, brandController.deleteCarModel);

module.exports = router;
