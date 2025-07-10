const express = require('express');
const router = express.Router();
const statisticsController = require('../controller/statistics.controller');
const { authMiddleware, checkPermission } = require('../middleware/auth.middleware');

// Admin routes - all statistics require authentication and statistics permission
router.get('/dashboard', authMiddleware, checkPermission('statistics'), statisticsController.getDashboardStats);
router.get('/products', authMiddleware, checkPermission('statistics'), statisticsController.getProductStats);
router.get('/orders', authMiddleware, checkPermission('statistics'), statisticsController.getOrderStats);
router.get('/blogs', authMiddleware, checkPermission('statistics'), statisticsController.getBlogStats);

module.exports = router;
