const express = require('express');
const userController = require('./../controllers/userController');

const router = express.Router();

router.get('/', userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.post('/signup', userController.createUser);

module.exports = router;
