const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

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
})

userSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      // Hash the password with cost of 10
      const salt = await bcrypt.genSalt(10)
      this.password = await bcrypt.hash(this.password, salt)
    }
    next()
  } catch (error) {
    next(error)
  }
})

module.exports = mongoose.model('User', userSchema)