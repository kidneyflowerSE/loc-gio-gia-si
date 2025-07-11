const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const contactController = require('../controller/contact.controller');

// Validation rules for contact form
const createContactValidation = [
  body('name').notEmpty().withMessage('Tên là bắt buộc').trim(),
  body('email').isEmail().withMessage('Email không hợp lệ').normalizeEmail(),
  body('phone').notEmpty().withMessage('Số điện thoại là bắt buộc').trim(),
  body('subject').notEmpty().withMessage('Chủ đề là bắt buộc').trim(),
  body('message').notEmpty().withMessage('Nội dung tin nhắn là bắt buộc').trim()
];

// Public route - Send contact email
router.post('/', createContactValidation, contactController.createContact);

module.exports = router;
