const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const createHttpError = require('http-errors')
const { roles } = require('../utils/constants')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [roles.admin, roles.moderator, roles.client],
    default: roles.client,
  },
})

userSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      // Hash the password with cost of 10
      const salt = await bcrypt.genSalt(10)
      this.password = await bcrypt.hash(this.password, salt)

      if (this.email === process.env.ADMIN_EMAIL.toLowerCase()) {
        this.role = roles.admin
      }
    }
    next()
  } catch (error) {
    next(error)
  }
})

userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (error) {
    throw createHttpError.InternalServerError(error.message)
  }
}

module.exports = mongoose.model('User', userSchema)
