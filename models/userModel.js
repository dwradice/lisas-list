const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const slugify = require('slugify');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User must have a name'],
    },
    email: {
      type: String,
      required: [true, 'user must have a valid email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please enter a valid email'],
    },
    photo: {
      type: String,
      default: 'default-user.jpg',
    },
    password: {
      type: String,
      required: [true, 'Enter password'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Reenter password to confirm'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords must match',
      },
    },
    createdAt: {
      type: Date,
      default: new Date(Date.now()).toLocaleString(),
    },
    slug: String,
    numReviews: {
      type: Number,
      default: 0,
    },
    reputation: {
      type: Number,
      default: -1,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'seller',
  localField: '_id',
});

// userSchema.virtual('products', {
//   ref: 'Product',
//   foreignField: 'seller',
//   localField: '_id',
// });

// userSchema.virtual('purchases', {
//   ref: 'Purchase',
//   foreignField: 'buyer',
//   localField: '_id',
// });

userSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
