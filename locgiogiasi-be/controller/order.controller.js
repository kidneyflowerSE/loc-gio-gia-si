const Order = require('../models/order.model');
const Product = require('../models/product.model');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Create order from product list (new way to create orders)
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

    const validatedItems = req.validatedItems;
    
    if (!validatedItems || validatedItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid items provided for the order'
      });
    }

    // Create order from provided items
    const orderData = {
      customer: req.body.customer,
      items: validatedItems.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price
      })),
      notes: req.body.notes,
      paymentMethod: req.body.paymentMethod || 'cash'
    };

    const order = new Order(orderData);
    
    // Ensure orderNumber is generated before saving
    if (!order.orderNumber) {
      const date = new Date();
      const dateString = date.toISOString().slice(0, 10).replace(/-/g, '');
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      order.orderNumber = `ORD-${dateString}-${random}`;
    }
    
    console.log('Creating order with data:', {
      orderNumber: order.orderNumber,
      customerEmail: req.body.customer.email,
      itemsCount: order.items.length
    });
    
    await order.save();
    console.log('Order saved successfully:', order.orderNumber);

    // Populate product details for email
    await order.populate({
      path: 'items.product',
      select: 'name brand compatibleModels price images code',
      populate: {
        path: 'brand',
        select: 'name'
      }
    });

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
    console.error('Error creating order:', error);
    
    // Handle specific validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Order validation failed',
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Order number already exists. Please try again.',
        error: 'Duplicate order number'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Send order notification email
const sendOrderNotification = async (order) => {
  const customerEmail = {
    from: process.env.EMAIL_USER,
    to: order.customer.email,
    subject: `Xác nhận đơn hàng #${order.orderNumber} - LocGioGiaSi`,
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
                <p>Mã sản phẩm: ${item.product.code}</p>
                <p>Thương hiệu: ${item.product.brand ? item.product.brand.name : 'Chưa xác định'}</p>
                ${item.product.compatibleModels && item.product.compatibleModels.length > 0 ? 
                  `<p>Dòng xe tương thích: ${item.product.compatibleModels.map(model => 
                    `${model.carModelName} (${model.years.join(', ')})`
                  ).join(', ')}</p>` 
                  : ''
                }
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
      </div>
    `
  };

  // Admin notification email
  const adminEmail = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `Đơn hàng mới #${order.orderNumber} - LocGioGiaSi`,
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
                <p>Mã sản phẩm: ${item.product.code}</p>
                <p>ID: ${item.product._id}</p>
                <p>Thương hiệu: ${item.product.brand ? item.product.brand.name : 'Chưa xác định'}</p>
                ${item.product.compatibleModels && item.product.compatibleModels.length > 0 ? 
                  `<p>Dòng xe tương thích: ${item.product.compatibleModels.map(model => 
                    `${model.carModelName} (${model.years.join(', ')})`
                  ).join(', ')}</p>` 
                  : ''
                }
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
      .populate({
        path: 'items.product',
        select: 'name brand compatibleModels images code price',
        populate: {
          path: 'brand',
          select: 'name'
        }
      });

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
    const limit = parseInt(req.query.limit) || 12;
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
      .populate({
        path: 'items.product',
        select: 'name brand compatibleModels code',
        populate: {
          path: 'brand',
          select: 'name'
        }
      })
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
      .populate({
        path: 'items.product',
        select: 'name brand compatibleModels images specifications code price',
        populate: {
          path: 'brand',
          select: 'name'
        }
      });

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
  getOrderByNumber,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
};
