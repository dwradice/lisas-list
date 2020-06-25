const User = require('./../models/userModel');
const factory = require('./handlerFactory');

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User, { path: 'reviews' });

exports.createUser = factory.createOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);
