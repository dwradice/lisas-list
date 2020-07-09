const Product = require('./../models/productModel');
const Purchase = require('./../models/purchaseModel');
const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // Get selected product
  const product = await Product.findById(req.params.productID);

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/me/purchases`,
    cancel_url: `${req.protocol}://${req.get('host')}/`,
    customer_email: req.user.email,
    client_reference_id: req.params.productID,
    line_items: [
      {
        name: product.name,
        description: 'Use Card # 4242-4242-4242-4242 for test purchase',
        amount: product.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });

  // Send to client
  res.status(200).json({
    status: 'success',
    session,
  });
});

createPurchaseCheckout = async session => {
  const product = session.client_reference_id;
  const buyer = (await User.findOne({ email: session.customer_email })).id;
  const price = session.display_items[0].amount / 100;

  await Purchase.create({ product, buyer, price });
};

updateProductCheckout = async session => {
  await Product.findByIdAndUpdate(session.client_reference_id, { sold: true });
};

exports.checkout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error : ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    updateProductCheckout(event.data.object);
    createPurchaseCheckout(event.data.object);
  }

  res.status(200).json({ received: true });
};
