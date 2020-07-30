const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const multer = require('multer');
const path = require('path');
const catchAsync = require('./../utils/catchAsync');

//const upload = multer({ dest: 'public/img/users' });

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cd) {
    cd(null, 'public/img/users');
  },

  filename: function (req, file, cd) {
    cd(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
    console.log(req.file);
  },
});

const upload = multer({
  storage: storage,
  preservePath: true,
});

// router.param('id', (req, res, next, val) => {
//   console.log(`User id is ${val}`);
//   next();
// });

router.post('/signup', upload.single('photo'), authController.signup);
router.post('/login', authController.login);

router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

// router.patch(
//   '/updateMe',
//   userController.uploadUserPhoto,
//   userController.resizeUserPhoto,
//   userController.updateMe
// );
router.patch(
  '/updateMe',
  upload.single('photo'),
  authController.protect,
  userController.updateMe
);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.patchUser)
  .delete(userController.deleteUser);

module.exports = router;
