const { promisify } = require('util');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const { decode } = require('punycode');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  const token = signToken(newUser._id);

  //const newUser = await User.save(req.body); for update
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1)check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  //2)checking email and passwords
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //3)after every check done! create token
  const token = signToken(user._id);
  res.status(200).json({
    status: 'Success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in ', 401));
  }

  //2) verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) check if user still exists
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(
      new AppError('The user belonging to this token does no longer exist', 401)
    );
  }

  //4) check if user changed password after issued the token
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! Log in again.'));
  }

  //grant access to protected route
  next();
});
