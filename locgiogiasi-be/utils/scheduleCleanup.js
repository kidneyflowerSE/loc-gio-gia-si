const Cart = require('../models/cart.model');

// Schedule cleanup of expired carts
const scheduleCartCleanup = () => {
  // Run cleanup every 24 hours (86400000 ms)
  setInterval(async () => {
    try {
      const result = await Cart.cleanupExpiredCarts();
      console.log(`Cart cleanup completed: ${result.deletedCount} expired carts removed`);
    } catch (error) {
      console.error('Cart cleanup failed:', error);
    }
  }, 24 * 60 * 60 * 1000); // 24 hours

  // Run initial cleanup on startup
  setTimeout(async () => {
    try {
      const result = await Cart.cleanupExpiredCarts();
      console.log(`Initial cart cleanup: ${result.deletedCount} expired carts removed`);
    } catch (error) {
      console.error('Initial cart cleanup failed:', error);
    }
  }, 5000); // 5 seconds after startup
};

module.exports = { scheduleCartCleanup };
