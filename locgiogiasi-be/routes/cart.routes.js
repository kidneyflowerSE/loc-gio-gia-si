const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const cartController = require('../controller/cart.controller');
const { getOrCreateCart, validateCartItem } = require('../middleware/cart.middleware');
const { authMiddleware, checkPermission } = require('../middleware/auth.middleware');

// Validation rules
const addToCartValidation = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
];

const updateCartValidation = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer')
];

const syncCartValidation = [
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.productId').notEmpty().withMessage('Product ID is required for each item'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer for each item')
];

// Apply cart middleware to all routes
router.use(getOrCreateCart);

// Public cart routes
router.get('/', cartController.getCart);
router.get('/summary', cartController.getCartSummary);
router.post('/add', addToCartValidation, validateCartItem, cartController.addToCart);
router.put('/update', updateCartValidation, cartController.updateCartItem);
router.delete('/remove/:productId', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);
router.post('/sync', syncCartValidation, cartController.syncCart);

// Admin routes
router.get('/admin/all', authMiddleware, checkPermission('orders'), cartController.getAllCarts);
router.delete('/admin/cleanup', authMiddleware, checkPermission('orders'), cartController.cleanupExpiredCarts);

module.exports = router;
