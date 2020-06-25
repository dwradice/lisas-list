const mongoose = require('mongoose');

const User = require('./userModel');

const reviewSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Review must have content/description'],
    },
    rating: {
      type: Number,
      required: [true, 'Review must have a numerical rating'],
      min: [1, 'Rating must be greater than or equal to 1'],
      max: [5, 'Rating must be less than or equal to 5'],
    },
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must refer to seller'],
    },
    buyer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must refer to buyer'],
    },
    //   product: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Product',
    //     required: [true, 'Review must link to a product'],
    //   },
    createdAt: {
      type: Date,
      default: new Date(Date.now()).toLocaleString(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.statics.calcReputation = async function (userID) {
  const stats = await this.aggregate([
    {
      $match: { seller: userID },
    },
    {
      $group: {
        _id: '$seller',
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  await User.findByIdAndUpdate(userID, {
    numReviews: stats[0].nRatings,
    reputation: stats[0].avgRating,
  });
};

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'seller',
    select: 'name reputation',
  }).populate({
    path: 'buyer',
    select: 'name',
  });
  next();
});

reviewSchema.post('save', function () {
  this.constructor.calcReputation(this.seller);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
