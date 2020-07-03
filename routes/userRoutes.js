const express = require('express');
const userController = require('./../controllers/userController');

const router = express.Router();

router.param('id', (req, res, next, val) => {
  console.log(`User id is ${val}`);
  next();
});

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
