const { body, validationResult } = require('express-validator')

module.exports = {
  registerValidator: [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail()
      .toLowerCase(),
    body('password')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Password must be at least 3 characters long.'),
    body('password2').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match.')
      }
      return true
    }),
  ],
}
