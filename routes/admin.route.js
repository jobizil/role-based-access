const { Router } = require('express')
const mongooose = require('mongoose')

const User = require('../models/user.model')
const { roles } = require('../utils/constants')
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
router.post('/update-role', async (req, res, next) => {
  const { id, role } = req.body

  //checks for id and role
  try {
    if (!id || !role) {
      req.flash('error', 'Invalid Request')
      return res.redirect('back')
      res.redirect('/admin/users')
    }
    // checks if id is valid
    if (!mongooose.Types.ObjectId.isValid(id)) {
      req.flash('error', 'Invalid ID')
      return res.redirect('back')
    }

    //Checks for role
    const rolesArr = Object.values(roles)

    if (!rolesArr.includes(role)) {
      req.flash('error', 'Invalid Role')
      return res.redirect('back')
    }
    // Admin cannot remove admin role
    if (req.user.id === id) {
      req.flash('error', 'Admin cannot remove themselves from admin role.')
      return res.redirect('back')
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    )
    req.flash(
      'success',
      `${user.email}'s role has been updated to ${user.role}`
    )
    res.redirect('back')
  } catch (error) {
    next(error)
  }
})

module.exports = router
