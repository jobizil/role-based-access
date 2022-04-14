const Express = require('express')
const createHttpError = require('http-errors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const session = require('express-session')
const connectFlash = require('connect-flash')
const passport = require('passport')
const connectMongo = require('connect-mongo')
const { ensureLoggedIn } = require('connect-ensure-login')

const indexRoute = require('./routes/index.route')
const authRoute = require('./routes/auth.route')
const userRoute = require('./routes/user.route')
const adminRoute = require('./routes/admin.route')
const { roles } = require('./utils/constants')

require('dotenv').config()

// Initialization and View engine setup
const app = Express()
app.use(morgan('dev'))
app.set('view engine', 'ejs')
app.use(Express.static('public'))
app.use(Express.urlencoded({ extended: false }))
app.use(Express.json())

// Init Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      // secure: false
      httpOnly: true,
    },
    store: connectMongo.create({ mongoUrl: process.env.MONGODB_URI }),
  })
)
// Init Passport for Authentication
app.use(passport.initialize())
app.use(passport.session())
require('./utils/passport.auth')

//
app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})

app.use(connectFlash())
app.use((req, res, next) => {
  res.locals.messages = req.flash()
  next()
})

// Routes
app.use('/', indexRoute)
app.use('/auth', authRoute)
app.use(
  '/user',
  ensureLoggedIn({
    redirectTo: '/auth/login',
  }),
  userRoute
)
app.use(
  '/admin',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureAdmin,
  adminRoute
)

//Error handlers
app.use((req, res, next) => {
  next(createHttpError.NotFound())
})

app.use((error, req, res, next) => {
  error.status = error.status || 500
  res.status(error.status)
  res.render('error_40x', { error })
})

const PORT = process.env.PORT || 3000

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
    console.log('💽 Connected to MongoDB')
  })
  .catch(err => {
    console.log(err.message)
  })

//From Passport
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next()
//   }
//   res.redirect('/auth/login')
// }

function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === roles.admin) {
    return next()
  }
  req.flash('warning', 'You are not authorized to view this page.')
  res.redirect('/')
}

function ensureModerator(req, res, next) {
  if (req.isAuthenticated() && req.user.role === roles.moderator) {
    return next()
  }
  req.flash('warning', 'You are not authorized to view this page.')
  res.redirect('/')
}
