const Product = require('../models/productModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');

const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');

exports.getOverview = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Product.find().populate('seller'), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;

  res.status(200).render('overview', {
    title: "Lisa's List",
    products,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log in',
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign Up',
  });
};

exports.getMyPage = catchAsync(async (req, res) => {
  const detailedUser = await User.findOne({ _id: res.locals.user.id })
    .populate('products')
    .populate('reviews');
  res.status(200).render('myPage', {
    title: 'My Page',
    user: detailedUser,
  });
});
