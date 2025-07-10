const express = require('express');
const router = express.Router();

// Import route modules
const productRoutes = require('./product.routes');
const orderRoutes = require('./order.routes');
const blogRoutes = require('./blog.routes');
const adminRoutes = require('./admin.routes');
const contactRoutes = require('./contact.routes');
const cartRoutes = require('./cart.routes');
const statisticsRoutes = require('./statistics.routes');
const settingsRoutes = require('./settings.routes');

// API routes
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/blogs', blogRoutes);
router.use('/admin', adminRoutes);
router.use('/contacts', contactRoutes);
router.use('/cart', cartRoutes);
router.use('/statistics', statisticsRoutes);
router.use('/settings', settingsRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Lốc Gio Gia Sĩ API is running',
    timestamp: new Date().toISOString()
  });
});

// API documentation route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Lốc Gio Gia Sĩ API',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      orders: '/api/orders',
      blogs: '/api/blogs',
      admin: '/api/admin',
      contacts: '/api/contacts',
      cart: '/api/cart',
      statistics: '/api/statistics',
      settings: '/api/settings'
    }
  });
});

module.exports = router;
