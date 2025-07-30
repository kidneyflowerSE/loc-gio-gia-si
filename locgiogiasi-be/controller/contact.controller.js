const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

// Helper function to validate email
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Create contact message (only send emails, no database storage)
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

    const contactData = {
      ...req.body,
      createdAt: new Date()
    };

    // Send email notifications
    try {
      await sendContactNotification(contactData);
      
      res.status(200).json({
        success: true,
        message: 'Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất có thể.',
        data: {
          name: contactData.name,
          email: contactData.email,
          subject: contactData.subject,
          sentAt: contactData.createdAt
        }
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.',
        error: 'Email service unavailable'
      });
    }
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
    subject: 'Xác nhận liên hệ - LocGioGiaSi',
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
            <strong>LocGioGiaSi</strong><br>
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
      </div>
    `
  };

  // Send emails - always send admin email, only send customer email if email is valid
  const emailPromises = [transporter.sendMail(adminEmail)];
  
  // Only send customer email if email is valid
  if (isValidEmail(contact.email)) {
    emailPromises.push(transporter.sendMail(customerEmail));
  } else {
    console.log('Skipping customer email - invalid or missing email:', contact.email);
  }
  
  await Promise.all(emailPromises);
};

module.exports = {
  createContact
};
