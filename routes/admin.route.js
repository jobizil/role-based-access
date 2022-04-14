const { Router } = require('express')
const User = require('../models/user.model')
const router = Router()

router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find({})
    res.send(users)
    // res.render('users', { users })
  } catch (error) {
    next(error)
  }
})

module.exports = router
