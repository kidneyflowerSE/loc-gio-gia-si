const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  fingerprint: {
    type: String,
    required: true,
    index: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'abandoned', 'converted'],
    default: 'active'
  },
  userAgent: {
    type: String,
    trim: true
  },
  ipAddress: {
    type: String,
    trim: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    expires: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update lastActivity before saving
cartSchema.pre('save', function(next) {
  this.lastActivity = new Date();
  this.updatedAt = new Date();
  next();
});

// Method to add item to cart
cartSchema.methods.addItem = function(productId, quantity, price) {
  const existingItemIndex = this.items.findIndex(
    item => item.product.toString() === productId.toString()
  );

  if (existingItemIndex > -1) {
    // Update existing item
    this.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    this.items.push({
      product: productId,
      quantity: quantity,
      price: price
    });
  }

  return this.save();
};

// Method to update item quantity
cartSchema.methods.updateItem = function(productId, quantity) {
  const item = this.items.find(item => item.product.toString() === productId.toString());
  
  if (item) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      this.items = this.items.filter(item => item.product.toString() !== productId.toString());
    } else {
      item.quantity = quantity;
    }
  }

  return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(item => item.product.toString() !== productId.toString());
  return this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.status = 'abandoned';
  return this.save();
};

// Method to convert cart to order
cartSchema.methods.convertToOrder = function() {
  this.status = 'converted';
  return this.save();
};

// Static method to clean up expired carts
cartSchema.statics.cleanupExpiredCarts = function() {
  return this.deleteMany({
    expiresAt: { $lt: new Date() }
  });
};

// Static method to get cart by session and fingerprint
cartSchema.statics.getOrCreateCart = async function(sessionId, fingerprint, userAgent = '', ipAddress = '') {
  let cart = await this.findOne({ sessionId, fingerprint });
  
  if (!cart) {
    cart = new this({
      sessionId,
      fingerprint,
      userAgent,
      ipAddress
    });
    await cart.save();
  }
  
  return cart;
};

// Index for efficient queries
cartSchema.index({ sessionId: 1, fingerprint: 1 });
cartSchema.index({ lastActivity: 1 });
cartSchema.index({ status: 1 });

module.exports = mongoose.model('Cart', cartSchema);
