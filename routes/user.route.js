const { Router } = require('express')

const router = Router()

router.get('/profile', async (req, res, next) => {
  const person = req.user
  res.render('profile', { person })
})

module.exports = router
