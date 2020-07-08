const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product must have a name'],
      minlength: [3, 'Product name must be at least 3 characters'],
      maxlength: [40, 'Product name must be less than 40 characters'],
    },
    photo: {
      type: String,
      default: 'default-product.jpg',
    },
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Product must be associated with user id'],
    },
    price: {
      type: Number,
      required: [true, 'Product must have a price'],
      min: [1, 'Price must be greater than 0'],
    },
    createdAt: {
      type: Date,
      default: new Date(Date.now()).toLocaleString(),
    },
    slug: String,
    category: {
      type: String,
      required: [true, 'Product must be sorted into category'],
      enum: {
        values: ['Art', 'Clothing', 'Electronics', 'Auto', 'Home'],
        message:
          'Product must fit into either "Art, Clothing, Electronics, Auto, or Home"',
      },
    },
    sold: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.index({ price: 1 });
productSchema.index({ category: 1 });

productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'seller',
    select: 'name photo reputation createdAt',
  });
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
