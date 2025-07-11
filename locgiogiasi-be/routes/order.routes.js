const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const orderController = require('../controller/order.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { validateCustomerInfo, validateOrderItems } = require('../middleware/order.middleware');

// Validation rules for creating order
const createOrderValidation = [
  body('customer.name').notEmpty().withMessage('Customer name is required'),
  body('customer.email').isEmail().withMessage('Valid email is required'),
  body('customer.phone').notEmpty().withMessage('Phone number is required'),
  body('customer.address').notEmpty().withMessage('Address is required'),
  body('customer.city').notEmpty().withMessage('City is required'),
  body('items').isArray({ min: 1 }).withMessage('Items array is required with at least one item'),
  body('items.*.productId').notEmpty().withMessage('Product ID is required for each item'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer for each item')
];

const updateOrderStatusValidation = [
  body('status').isIn(['pending', 'confirmed', 'processing', 'completed', 'cancelled']).withMessage('Valid status is required')
];

// Public routes - create order from product list
router.post('/', createOrderValidation, validateOrderItems, validateCustomerInfo, orderController.createOrder);
router.get('/track/:orderNumber', orderController.getOrderByNumber);

// Admin routes
router.get('/', authMiddleware, orderController.getOrders);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.put('/:id/status', authMiddleware, updateOrderStatusValidation, orderController.updateOrderStatus);
router.delete('/:id', authMiddleware, orderController.deleteOrder);

module.exports = router;
