const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user.model')
const bcrypt = require('bcryptjs')

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email })
        if (!user) {
          done(null, false, { message: 'Invalid credentials' })
        }
        // Verify Password
        const isMatch = await user.isValidPassword(password)
        return isMatch
          ? done(null, user)
          : done(null, false, { message: 'Invalid credentials ' })
      } catch (error) {
        console.log(error)
        done(error)
      }
    }
  )
)

// Automatically sets user id into session and creates cookie
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user)
  })
})
