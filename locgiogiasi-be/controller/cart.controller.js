const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

// Helper function to calculate cart totals
const calculateCartTotals = (cart) => {
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  return { totalItems, totalAmount };
};

// Get cart contents
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.cart._id).populate('items.product', 'name brand model year price images status');
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const filteredItems = cart.items.filter(item => item.product && item.product.status === 'available');
    const { totalItems, totalAmount } = calculateCartTotals({ items: filteredItems });

    res.json({
      success: true,
      data: {
        cart: {
          id: cart._id,
          sessionId: cart.sessionId,
          items: filteredItems,
          totalAmount,
          totalItems,
          lastActivity: cart.lastActivity,
          expiresAt: cart.expiresAt
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = req.cart;
    const product = req.validatedProduct;
    const validQuantity = req.validatedQuantity;

    // Add item to cart
    await cart.addItem(productId, validQuantity, product.price);
    
    // Populate the updated cart
    const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name brand model year price images');
    const { totalItems, totalAmount } = calculateCartTotals(updatedCart);

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: {
        cart: {
          id: updatedCart._id,
          sessionId: updatedCart.sessionId,
          items: updatedCart.items,
          totalAmount,
          totalItems
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
};

// Update item quantity in cart
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = req.cart;
    const validQuantity = parseInt(quantity) || 0;

    // Update item quantity
    await cart.updateItem(productId, validQuantity);
    
    // Populate the updated cart
    const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name brand model year price images');
    const { totalItems, totalAmount } = calculateCartTotals(updatedCart);

    res.json({
      success: true,
      message: validQuantity > 0 ? 'Cart item updated successfully' : 'Item removed from cart',
      data: {
        cart: {
          id: updatedCart._id,
          sessionId: updatedCart.sessionId,
          items: updatedCart.items,
          totalAmount,
          totalItems
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating cart item',
      error: error.message
    });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = req.cart;

    // Check if product exists in cart
    const itemExists = cart.items.some(item => item.product.toString() === productId);
    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Remove item from cart
    await cart.removeItem(productId);
    
    // Populate the updated cart
    const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name brand model year price images');
    const { totalItems, totalAmount } = calculateCartTotals(updatedCart);

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: {
        cart: {
          id: updatedCart._id,
          sessionId: updatedCart.sessionId,
          items: updatedCart.items,
          totalAmount,
          totalItems
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const cart = req.cart;

    // Clear all items from cart
    await cart.clearCart();

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: {
        cart: {
          id: cart._id,
          sessionId: cart.sessionId,
          items: [],
          totalAmount: 0,
          totalItems: 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
};

// Get cart summary
const getCartSummary = async (req, res) => {
  try {
    const cart = req.cart;
    const { totalItems, totalAmount } = calculateCartTotals(cart);

    res.json({
      success: true,
      data: {
        sessionId: cart.sessionId,
        totalItems,
        totalAmount,
        itemCount: cart.items.length,
        lastActivity: cart.lastActivity
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cart summary',
      error: error.message
    });
  }
};

// Sync cart with frontend (for cases where frontend cart might be out of sync)
const syncCart = async (req, res) => {
  try {
    const { items } = req.body;
    const cart = req.cart;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required'
      });
    }

    // Clear existing items
    cart.items = [];

    // Add each item after validation
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product && product.status === 'available') {
        const quantity = parseInt(item.quantity) || 1;
        if (quantity > 0) {
          cart.items.push({
            product: product._id,
            quantity: quantity,
            price: product.price
          });
        }
      }
    }

    await cart.save();

    // Populate the updated cart
    const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name brand model year price images');
    const { totalItems, totalAmount } = calculateCartTotals(updatedCart);

    res.json({
      success: true,
      message: 'Cart synchronized successfully',
      data: {
        cart: {
          id: updatedCart._id,
          sessionId: updatedCart.sessionId,
          items: updatedCart.items,
          totalAmount,
          totalItems
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error synchronizing cart',
      error: error.message
    });
  }
};

// Admin: Get all carts (for analytics)
const getAllCarts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    
    // Status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) {
        filter.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter.createdAt.$lte = new Date(req.query.endDate);
      }
    }

    const carts = await Cart.find(filter)
      .populate('items.product', 'name brand model year price')
      .sort({ lastActivity: -1 })
      .skip(skip)
      .limit(limit);

    const totalCarts = await Cart.countDocuments(filter);

    res.json({
      success: true,
      data: {
        carts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCarts / limit),
          totalCarts,
          limit
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching carts',
      error: error.message
    });
  }
};

// Admin: Clean up expired carts
const cleanupExpiredCarts = async (req, res) => {
  try {
    const result = await Cart.cleanupExpiredCarts();
    
    res.json({
      success: true,
      message: `Cleaned up ${result.deletedCount} expired carts`,
      data: {
        deletedCount: result.deletedCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cleaning up expired carts',
      error: error.message
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartSummary,
  syncCart,
  getAllCarts,
  cleanupExpiredCarts
};
