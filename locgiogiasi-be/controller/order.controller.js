const Order = require('../models/order.model');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

// Configure nodemailer
const transporter = nodemailer.createTransporter({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Create new order (quote request)
const createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    // Create order with validated data from middleware
    const orderData = {
      customer: req.body.customer,
      items: req.validatedItems,
      totalAmount: req.totalAmount,
      notes: req.body.notes,
      paymentMethod: req.body.paymentMethod || 'cash'
    };

    const order = new Order(orderData);
    await order.save();

    // Mark cart as converted if cart exists
    if (req.cart) {
      await req.cart.convertToOrder();
    }

    // Populate product details for email
    await order.populate('items.product', 'name brand model year price images');

    // Send email notification
    try {
      await sendOrderNotification(order);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the order creation if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully. We will contact you soon for quotation.',
      data: {
        orderNumber: order.orderNumber,
        order: order
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Create order from cart
const createOrderFromCart = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const cart = req.cart;
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Populate cart items with product details
    await cart.populate('items.product', 'name brand model year price images status');

    // Validate all items are still available
    for (const item of cart.items) {
      if (!item.product || item.product.status !== 'available') {
        return res.status(400).json({
          success: false,
          message: `Product ${item.product?.name || 'Unknown'} is no longer available`
        });
      }
    }

    // Create order from cart items
    const orderData = {
      customer: req.body.customer,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price // Use current price from product
      })),
      totalAmount: cart.items.reduce((sum, item) => sum + (item.quantity * item.product.price), 0),
      notes: req.body.notes,
      paymentMethod: req.body.paymentMethod || 'cash'
    };

    const order = new Order(orderData);
    await order.save();

    // Mark cart as converted
    await cart.convertToOrder();

    // Populate product details for email
    await order.populate('items.product', 'name brand model year price images');

    // Send email notification
    try {
      await sendOrderNotification(order);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the order creation if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully from cart. We will contact you soon for quotation.',
      data: {
        orderNumber: order.orderNumber,
        order: order
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating order from cart',
      error: error.message
    });
  }
};

// Send order notification email
const sendOrderNotification = async (order) => {
  const customerEmail = {
    from: process.env.EMAIL_USER,
    to: order.customer.email,
    subject: `Xác nhận đơn hàng #${order.orderNumber} - Lốc Gio Gia Sĩ`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Cảm ơn bạn đã gửi yêu cầu báo giá!</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">Thông tin đơn hàng #${order.orderNumber}</h3>
          
          <div style="margin-bottom: 20px;">
            <strong>Thông tin khách hàng:</strong>
            <p>Họ tên: ${order.customer.name}</p>
            <p>Email: ${order.customer.email}</p>
            <p>Số điện thoại: ${order.customer.phone}</p>
            <p>Địa chỉ: ${order.customer.address}, ${order.customer.city}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <strong>Sản phẩm:</strong>
            ${order.items.map(item => `
              <div style="border-bottom: 1px solid #dee2e6; padding: 10px 0;">
                <p><strong>${item.product.name}</strong></p>
                <p>Hãng: ${item.product.brand} | Model: ${item.product.model} | Năm: ${item.product.year}</p>
                <p>Giá: ${item.price.toLocaleString('vi-VN')} VND x ${item.quantity}</p>
                <p>Tổng: ${(item.price * item.quantity).toLocaleString('vi-VN')} VND</p>
              </div>
            `).join('')}
          </div>

          <div style="font-size: 18px; font-weight: bold; color: #28a745;">
            Tổng tiền: ${order.totalAmount.toLocaleString('vi-VN')} VND
          </div>

          ${order.notes ? `<div style="margin-top: 20px;"><strong>Ghi chú:</strong> ${order.notes}</div>` : ''}
        </div>

        <p>Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để cung cấp báo giá chi tiết.</p>
        
        <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0; color: #6c757d;">
            <strong>Lốc Gio Gia Sĩ</strong><br>
            Hotline: 0123.456.789<br>
            Email: info@locgiogiasi.com
          </p>
        </div>
      </div>
    `
  };

  // Admin notification email
  const adminEmail = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `Đơn hàng mới #${order.orderNumber} - Lốc Gio Gia Sĩ`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">Đơn hàng mới cần xử lý!</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
          <h3 style="color: #007bff; margin-top: 0;">Đơn hàng #${order.orderNumber}</h3>
          
          <div style="margin-bottom: 20px;">
            <strong>Thông tin khách hàng:</strong>
            <p>Họ tên: ${order.customer.name}</p>
            <p>Email: ${order.customer.email}</p>
            <p>Số điện thoại: ${order.customer.phone}</p>
            <p>Địa chỉ: ${order.customer.address}, ${order.customer.city}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <strong>Sản phẩm:</strong>
            ${order.items.map(item => `
              <div style="border-bottom: 1px solid #dee2e6; padding: 10px 0;">
                <p><strong>${item.product.name}</strong></p>
                <p>ID: ${item.product._id}</p>
                <p>Giá: ${item.price.toLocaleString('vi-VN')} VND x ${item.quantity}</p>
                <p>Tổng: ${(item.price * item.quantity).toLocaleString('vi-VN')} VND</p>
              </div>
            `).join('')}
          </div>

          <div style="font-size: 18px; font-weight: bold; color: #28a745;">
            Tổng tiền: ${order.totalAmount.toLocaleString('vi-VN')} VND
          </div>

          ${order.notes ? `<div style="margin-top: 20px;"><strong>Ghi chú:</strong> ${order.notes}</div>` : ''}
          
          <div style="margin-top: 20px;">
            <strong>Thời gian đặt:</strong> ${new Date(order.orderDate).toLocaleString('vi-VN')}
          </div>
        </div>
      </div>
    `
  };

  // Send both emails
  await Promise.all([
    transporter.sendMail(customerEmail),
    transporter.sendMail(adminEmail)
  ]);
};

// Get order by order number (for customer)
const getOrderByNumber = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate('items.product', 'name brand model year images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// Admin Controllers

// Get all orders
const getOrders = async (req, res) => {
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
      filter.orderDate = {};
      if (req.query.startDate) {
        filter.orderDate.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter.orderDate.$lte = new Date(req.query.endDate);
      }
    }

    // Search filter
    if (req.query.search) {
      filter.$or = [
        { orderNumber: { $regex: req.query.search, $options: 'i' } },
        { 'customer.name': { $regex: req.query.search, $options: 'i' } },
        { 'customer.email': { $regex: req.query.search, $options: 'i' } },
        { 'customer.phone': { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(filter)
      .populate('items.product', 'name brand model year')
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalOrders / limit),
          totalOrders,
          limit
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Get single order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name brand model year images specifications');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  createOrderFromCart,
  getOrderByNumber,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
};
