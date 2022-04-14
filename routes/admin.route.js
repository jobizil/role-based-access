const { Router } = require('express')
const mongooose = require('mongoose')

const User = require('../models/user.model')
const router = Router()

router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find({})
    res.render('manage-users', { users })
    // res.render('users', { users })
  } catch (error) {
    next(error)
  }
})
router.get('/user/:id', async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongooose.Types.ObjectId.isValid(id)) {
      req.flash('error', 'Invalid ID')
      res.redirect('/admin/users')
      return
    }

    const person = await User.findById(id)

    res.render('profile', { person })
  } catch (error) {
    next(error)
  }
})

module.exports = router
