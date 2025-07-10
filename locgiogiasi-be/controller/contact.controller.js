const Contact = require('../models/contact.model');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

// Configure nodemailer
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Create contact message
const createContact = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const contact = new Contact(req.body);
    await contact.save();

    // Send email notifications
    try {
      await sendContactNotification(contact);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the contact creation if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Contact message sent successfully. We will respond to you soon.',
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending contact message',
      error: error.message
    });
  }
};

// Send contact notification emails
const sendContactNotification = async (contact) => {
  // Customer confirmation email
  const customerEmail = {
    from: process.env.EMAIL_USER,
    to: contact.email,
    subject: 'Xác nhận liên hệ - Lốc Gio Gia Sĩ',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Cảm ơn bạn đã liên hệ với chúng tôi!</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">Thông tin liên hệ</h3>
          
          <div style="margin-bottom: 15px;">
            <strong>Họ tên:</strong> ${contact.name}
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong>Email:</strong> ${contact.email}
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong>Số điện thoại:</strong> ${contact.phone}
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong>Chủ đề:</strong> ${contact.subject}
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong>Nội dung:</strong>
            <div style="background-color: #fff; padding: 15px; border: 1px solid #dee2e6; border-radius: 3px; margin-top: 5px;">
              ${contact.message}
            </div>
          </div>
        </div>

        <p>Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong thời gian sớm nhất.</p>
        
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
    subject: `Tin nhắn liên hệ mới từ ${contact.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">Tin nhắn liên hệ mới!</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
          <h3 style="color: #007bff; margin-top: 0;">Thông tin khách hàng</h3>
          
          <div style="margin-bottom: 15px;">
            <strong>Họ tên:</strong> ${contact.name}
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong>Email:</strong> ${contact.email}
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong>Số điện thoại:</strong> ${contact.phone}
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong>Chủ đề:</strong> ${contact.subject}
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong>Nội dung:</strong>
            <div style="background-color: #fff; padding: 15px; border: 1px solid #dee2e6; border-radius: 3px; margin-top: 5px;">
              ${contact.message}
            </div>
          </div>
          
          <div style="margin-top: 20px;">
            <strong>Thời gian:</strong> ${new Date(contact.createdAt).toLocaleString('vi-VN')}
          </div>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107;">
          <p style="margin: 0; color: #856404;">
            <strong>Lưu ý:</strong> Hãy phản hồi tin nhắn này trong thời gian sớm nhất để đảm bảo trải nghiệm tốt nhất cho khách hàng.
          </p>
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

// Admin Controllers

// Get all contacts
const getContacts = async (req, res) => {
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

    // Search filter
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { subject: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalContacts = await Contact.countDocuments(filter);

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalContacts / limit),
          totalContacts,
          limit
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: error.message
    });
  }
};

// Get single contact by ID
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Mark as read if it's new
    if (contact.status === 'new') {
      contact.status = 'read';
      await contact.save();
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contact',
      error: error.message
    });
  }
};

// Update contact status
const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact status updated successfully',
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating contact status',
      error: error.message
    });
  }
};

// Reply to contact
const replyToContact = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { reply } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { 
        reply,
        status: 'replied',
        repliedAt: Date.now(),
        repliedBy: req.admin.fullName,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Send reply email
    try {
      await sendReplyEmail(contact);
    } catch (emailError) {
      console.error('Reply email sending failed:', emailError);
      // Don't fail the reply if email fails
    }

    res.json({
      success: true,
      message: 'Reply sent successfully',
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending reply',
      error: error.message
    });
  }
};

// Send reply email
const sendReplyEmail = async (contact) => {
  const replyEmail = {
    from: process.env.EMAIL_USER,
    to: contact.email,
    subject: `Phản hồi: ${contact.subject} - Lốc Gio Gia Sĩ`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Phản hồi từ Lốc Gio Gia Sĩ</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">Tin nhắn gốc của bạn</h3>
          
          <div style="margin-bottom: 15px;">
            <strong>Chủ đề:</strong> ${contact.subject}
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong>Nội dung:</strong>
            <div style="background-color: #fff; padding: 15px; border: 1px solid #dee2e6; border-radius: 3px; margin-top: 5px;">
              ${contact.message}
            </div>
          </div>
        </div>

        <div style="background-color: #e8f5e8; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #28a745; margin-top: 0;">Phản hồi của chúng tôi</h3>
          
          <div style="background-color: #fff; padding: 15px; border: 1px solid #c3e6cb; border-radius: 3px;">
            ${contact.reply}
          </div>
          
          <div style="margin-top: 15px; font-size: 14px; color: #6c757d;">
            <strong>Người phản hồi:</strong> ${contact.repliedBy}<br>
            <strong>Thời gian:</strong> ${new Date(contact.repliedAt).toLocaleString('vi-VN')}
          </div>
        </div>

        <p>Nếu bạn có thêm câu hỏi, vui lòng liên hệ với chúng tôi.</p>
        
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

  await transporter.sendMail(replyEmail);
};

// Delete contact
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting contact',
      error: error.message
    });
  }
};

module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContactStatus,
  replyToContact,
  deleteContact
};
