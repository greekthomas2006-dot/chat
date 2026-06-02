import { body, validationResult } from 'express-validator';

export const validateInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Auth validation
export const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('username').trim().isLength({ min: 3, max: 30 }),
  validateInput
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validateInput
];

// Message validation
export const validateMessage = [
  body('text').trim().optional({ checkFalsy: true }).isLength({ min: 1, max: 5000 }),
  body('recipientId').isUUID(),
  validateInput
];

// Journal validation
export const validateJournalEntry = [
  body('title').trim().optional({ checkFalsy: true }).isLength({ max: 255 }),
  body('content').trim().isLength({ min: 1 }).withMessage('Content is required'),
  body('tags').optional().isArray(),
  validateInput
];

// Goal validation
export const validateGoal = [
  body('title').trim().isLength({ min: 1, max: 255 }).withMessage('Title is required'),
  body('description').trim().optional({ checkFalsy: true }),
  body('category').trim().optional(),
  body('priority').isIn(['low', 'medium', 'high']),
  body('endDate').optional().isISO8601(),
  validateInput
];

// Photo validation
export const validatePhoto = [
  body('caption').trim().optional({ checkFalsy: true }).isLength({ max: 500 }),
  body('tags').optional().isArray(),
  validateInput
];

// Event validation
export const validateEvent = [
  body('title').trim().isLength({ min: 1, max: 255 }).withMessage('Title is required'),
  body('eventDate').isISO8601().withMessage('Valid date is required'),
  body('eventType').trim().isLength({ min: 1 }).withMessage('Event type is required'),
  body('isRecurring').optional().isBoolean(),
  validateInput
];

// Question validation
export const validateAnswer = [
  body('answerText').trim().isLength({ min: 1 }).withMessage('Answer is required'),
  validateInput
];
