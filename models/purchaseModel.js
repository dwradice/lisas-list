const mongoose = require('mongoose');

const purchaseSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'purchase must have a product'],
  },
  buyer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'purchase must have a buyer'],
  },
  price: {
    type: Number,
    required: [true, 'purchase must have a price'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

// purchaseSchema.pre(/^find/, function (next) {
//   this.populate('product');
// });

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
