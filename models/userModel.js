const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell your name'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'A user must have a email'],
    lowercase: true,
    validate: [validator.isEmail, 'Please enter valid Email'],
  },
  photo: { type: String },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //works only when we CREATE & SAVE not when we use UPDATE reqest
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
