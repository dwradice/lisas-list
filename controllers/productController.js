const Product = require('./../models/productModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product);

exports.createProduct = factory.createOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);

exports.myPostings = (req, res, next) => {
  req.body.seller = req.user.id;
  next();
};

exports.getMyProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({ seller: req.user.id });

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      data: products,
    },
  });
});
