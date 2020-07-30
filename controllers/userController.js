const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

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

exports.updateMe = catchAsync(async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);

  //1)create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not password upadtes. Please use /updateMyPassword',
        400
      )
    );
  }

  //2)update user document
  const filterBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    dats: null,
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
