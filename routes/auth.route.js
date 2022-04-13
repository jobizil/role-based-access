const router = require('express').Router()
const User = require('../models/user.model')
const { body, validationResult } = require('express-validator')

router.get('/login', async (req, res, next) => {
  res.render('login')
})

router.post('/login', async (req, res, next) => {
  res.send(' Login Post 🌍!')
})

//Register
router.get('/register', async (req, res, next) => {
  res.render('register')
})

router.post(
  '/register',
  [
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
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        errors.array().forEach(error => req.flash('error', error.msg))
        res.render('register', {
          email: req.body.email,
          messages: req.flash(),
        })
        return
      }

      const { email } = req.body
      const user = await User.findOne({ email })
      if (user) {
        res.redirect('/auth/register')
        return
      }
      const newUser = new User(req.body)
      await newUser.save()
      req.flash(
        'success',
        `${newUser.email} has been registered. You can now login`
      )
      res.redirect('/auth/login')
    } catch (error) {
      next(error)
    }
  }
)

router.post('/logout', async (req, res, next) => {
  res.send(' Login Post 🌍!')
})
module.exports = router
