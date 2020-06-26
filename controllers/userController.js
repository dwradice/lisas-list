const User = require('./../models/userModel');
const factory = require('./handlerFactory');

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(
  User,
  { path: 'products' },
  { path: 'reviews' }
);

exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
