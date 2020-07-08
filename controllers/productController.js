const aws = require('aws-sdk');
const multer = require('multer');
const s3Storage = require('multer-sharp-s3');

const Product = require('./../models/productModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const s3Config = new aws.S3({
  accessKeyId: 'AKIAICLRL7CKWIEKTIRQ',
  secretAccessKey: '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',
});

const multerStorage = s3Storage({
  s3: s3Config,
  Bucket: 'lisaslist-assets/products',
  Key: function (req, file, cb) {
    const filename = `product-${req.user.id}-${Date.now()}.jpg`;
    req.body.photo = filename;
    cb(null, filename);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('File type must be an image', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProductPhoto = upload.single('photo');

// exports.resizeProductPhoto = (req, res, next) => {
//   if (!req.file) return next();

//   req.file.filename = `product-${req.user.id}-${Date.now()}.jpeg`;
//   req.body.photo = req.file.filename;

//   sharp(req.file.buffer)
//     .toFormat('jpeg')
//     .jpeg({ quality: 90 })
//     .toFile(`public/img/products/${req.file.filename}`);

//   next();
// };

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
