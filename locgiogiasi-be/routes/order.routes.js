const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const orderController = require('../controller/order.controller');
const { authMiddleware, checkPermission } = require('../middleware/auth.middleware');
const { getOrCreateCart, validateCartItems, validateCustomerInfo } = require('../middleware/cart.middleware');

// Validation rules
const createOrderValidation = [
  body('customer.name').notEmpty().withMessage('Customer name is required'),
  body('customer.email').isEmail().withMessage('Valid email is required'),
  body('customer.phone').notEmpty().withMessage('Phone number is required'),
  body('customer.address').notEmpty().withMessage('Address is required'),
  body('customer.city').notEmpty().withMessage('City is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.product').notEmpty().withMessage('Product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Valid quantity is required')
];

const createOrderFromCartValidation = [
  body('customer.name').notEmpty().withMessage('Customer name is required'),
  body('customer.email').isEmail().withMessage('Valid email is required'),
  body('customer.phone').notEmpty().withMessage('Phone number is required'),
  body('customer.address').notEmpty().withMessage('Address is required'),
  body('customer.city').notEmpty().withMessage('City is required')
];

const updateOrderStatusValidation = [
  body('status').isIn(['pending', 'confirmed', 'processing', 'completed', 'cancelled']).withMessage('Valid status is required')
];

// Public routes
router.post('/', createOrderValidation, validateCartItems, validateCustomerInfo, orderController.createOrder);
router.post('/from-cart', getOrCreateCart, createOrderFromCartValidation, validateCustomerInfo, orderController.createOrderFromCart);
router.get('/track/:orderNumber', orderController.getOrderByNumber);

// Admin routes
router.get('/', authMiddleware, checkPermission('orders'), orderController.getOrders);
router.get('/:id', authMiddleware, checkPermission('orders'), orderController.getOrderById);
router.put('/:id/status', authMiddleware, checkPermission('orders'), updateOrderStatusValidation, orderController.updateOrderStatus);
router.delete('/:id', authMiddleware, checkPermission('orders'), orderController.deleteOrder);

module.exports = router;
