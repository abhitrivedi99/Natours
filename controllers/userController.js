const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  //send response
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    ststus: 'error',
    message: 'This route has not yed defined!',
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    ststus: 'error',
    message: 'This route has not yed defined!',
  });
};

exports.patchUser = (req, res) => {
  res.status(500).json({
    ststus: 'error',
    message: 'This route has not yed defined!',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    ststus: 'error',
    message: 'This route has not yed defined!',
  });
};
