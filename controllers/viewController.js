const Product = require('../models/productModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const Purchase = require('../models/purchaseModel');

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
    query: req.query,
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

exports.getMySettings = catchAsync(async (req, res) => {
  res.status(200).render('mySettings', {
    title: 'My Page',
  });
});

exports.getMyListings = catchAsync(async (req, res) => {
  const detailedUser = await User.findOne({ _id: res.locals.user.id })
    .populate('products')
    .populate('reviews');

  res.status(200).render('myListings', {
    title: 'My Listings',
    user: detailedUser,
  });
});

exports.getMyPurchases = catchAsync(async (req, res) => {
  const detailedUser = await User.findOne({ _id: res.locals.user.id }).populate(
    {
      path: 'purchases',
      populate: {
        path: 'product',
      },
    }
  );

  res.status(200).render('myPurchases', {
    title: 'My Purchases',
    user: detailedUser,
  });
});

exports.getMyReview = catchAsync(async (req, res) => {
  const purchase = await Purchase.findById(req.params.id).populate('product');

  res.status(200).render('myReview', {
    title: 'Leave a review',
    purchase,
  });
});

exports.getMyListingsEditPage = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);

  res.status(200).render('myListingsEditPage', {
    title: 'Edit My Product',
    product,
  });
});

exports.getForgotPassword = (req, res) => {
  res.status(200).render('forgotPassword', {
    title: 'Forgot Password',
  });
};

exports.getResetPassword = (req, res) => {
  res.status(200).render('resetPassword', {
    title: 'Reset Password',
  });
};
