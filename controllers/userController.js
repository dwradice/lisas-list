const aws = require('aws-sdk');
const multer = require('multer');
const s3Storage = require('multer-sharp-s3');

const User = require('./../models/userModel');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const catchAsync = require('../utils/catchAsync');

const s3Config = new aws.S3({
  accessKeyId: 'AKIAICLRL7CKWIEKTIRQ',
  secretAccessKey: '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',
});

const multerStorage = s3Storage({
  s3: s3Config,
  Bucket: 'lisaslist-assets/users',
  Key: function (req, file, cb) {
    const filename = `user-${req.user.id}-${Date.now()}.jpg`;
    req.body.photo = filename;
    cb(null, filename);
  },
  resize: {
    width: 500,
    height: 500,
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

exports.uploadUserPhoto = upload.single('photo');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(
  User,
  { path: 'products' },
  { path: 'reviews' }
);

exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('Use /updateMyPassword for updating password', 400)
    );
  }

  const filteredBody = filterObj(req.body, 'name', 'email', 'photo');
  // if (req.file) filteredBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
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
    data: null,
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
