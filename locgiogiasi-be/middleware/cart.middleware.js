const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const crypto = require('crypto');

// Generate device fingerprint
const generateFingerprint = (req) => {
  const userAgent = req.get('User-Agent') || '';
  const acceptLanguage = req.get('Accept-Language') || '';
  const acceptEncoding = req.get('Accept-Encoding') || '';
  const ip = req.ip || req.connection.remoteAddress || '';
  
  const fingerprint = crypto
    .createHash('md5')
    .update(userAgent + acceptLanguage + acceptEncoding + ip)
    .digest('hex');
    
  return fingerprint;
};

// Generate session ID
const generateSessionId = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Get or create cart middleware
const getOrCreateCart = async (req, res, next) => {
  try {
    let sessionId = req.get('X-Session-ID') || req.cookies?.sessionId;
    const fingerprint = generateFingerprint(req);
    const userAgent = req.get('User-Agent') || '';
    const ipAddress = req.ip || req.connection.remoteAddress || '';

    // If no session ID, generate a new one
    if (!sessionId) {
      sessionId = generateSessionId();
      res.setHeader('X-Session-ID', sessionId);
    }

    // Get or create cart
    const cart = await Cart.getOrCreateCart(sessionId, fingerprint, userAgent, ipAddress);
    
    // Attach cart to request
    req.cart = cart;
    req.sessionId = sessionId;
    req.fingerprint = fingerprint;
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error managing cart session',
      error: error.message
    });
  }
};

// Validate cart items middleware (for checkout)
const validateCartItems = async (req, res, next) => {
  try {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart items are required and must be an array'
      });
    }

    // Validate each item
    const validatedItems = [];
    let totalAmount = 0;

    for (const item of items) {
      // Check if product exists
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${item.product} not found`
        });
      }

      // Check if product is available
      if (product.status !== 'available') {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is not available`
        });
      }

      // Validate quantity
      const quantity = parseInt(item.quantity) || 1;
      if (quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be greater than 0'
        });
      }

      // Calculate total price for this item
      const totalPrice = product.price * quantity;
      totalAmount += totalPrice;

      validatedItems.push({
        product: product._id,
        quantity: quantity,
        price: product.price,
        totalPrice: totalPrice
      });
    }

    // Add validated items and total amount to request
    req.validatedItems = validatedItems;
    req.totalAmount = totalAmount;
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error validating cart items',
      error: error.message
    });
  }
};

// Validate single item for cart operations
const validateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if product is available
    if (product.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: `Product ${product.name} is not available`
      });
    }

    // Validate quantity
    const validQuantity = parseInt(quantity) || 1;
    if (validQuantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than 0'
      });
    }

    // Attach validated data to request
    req.validatedProduct = product;
    req.validatedQuantity = validQuantity;
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error validating cart item',
      error: error.message
    });
  }
};

// Validate customer info middleware
const validateCustomerInfo = (req, res, next) => {
  const { customer } = req.body;
  
  if (!customer) {
    return res.status(400).json({
      success: false,
      message: 'Customer information is required'
    });
  }

  const requiredFields = ['name', 'email', 'phone', 'address', 'city'];
  const missingFields = requiredFields.filter(field => !customer[field]?.trim());
  
  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required customer fields: ${missingFields.join(', ')}`
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customer.email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }

  // Validate phone format (basic validation)
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  if (!phoneRegex.test(customer.phone)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid phone number format'
    });
  }

  next();
};

module.exports = { 
  getOrCreateCart,
  validateCartItems, 
  validateCartItem,
  validateCustomerInfo 
};
