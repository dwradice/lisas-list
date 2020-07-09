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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    createdAt: {
      type: Date,
      default: new Date().toLocaleString(),
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
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Encrypt and store password on save
userSchema.pre('save', async function (next) {
  // Only will run if password has been modified
  if (!this.isModified('password')) return next();

  // Hash Password
  this.password = await bcrypt.hash(this.password, 12);

  // Remove passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// If password has been edited on existing user, set passwordChangedAt value
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Creates slug for user on save
userSchema.pre('save', function (next) {
  this.slug = slugify(this.email, { lower: true });

  next();
});

// Hides inactive user accounts
userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimetamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimetamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.virtual('purchases', {
  ref: 'Purchase',
  foreignField: 'buyer',
  localField: '_id',
});

userSchema.virtual('products', {
  ref: 'Product',
  foreignField: 'seller',
  localField: '_id',
});

userSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'seller',
  localField: '_id',
});

const User = mongoose.model('User', userSchema);

module.exports = User;
