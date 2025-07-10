const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const contactController = require('../controller/contact.controller');
const { authMiddleware, checkPermission } = require('../middleware/auth.middleware');

// Validation rules
const createContactValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required')
];

const updateContactStatusValidation = [
  body('status').isIn(['new', 'read', 'replied', 'closed']).withMessage('Valid status is required')
];

const replyContactValidation = [
  body('reply').notEmpty().withMessage('Reply message is required')
];

// Public routes
router.post('/', createContactValidation, contactController.createContact);

// Admin routes
router.get('/', authMiddleware, checkPermission('settings'), contactController.getContacts);
router.get('/:id', authMiddleware, checkPermission('settings'), contactController.getContactById);
router.put('/:id/status', authMiddleware, checkPermission('settings'), updateContactStatusValidation, contactController.updateContactStatus);
router.post('/:id/reply', authMiddleware, checkPermission('settings'), replyContactValidation, contactController.replyToContact);
router.delete('/:id', authMiddleware, checkPermission('settings'), contactController.deleteContact);

module.exports = router;
