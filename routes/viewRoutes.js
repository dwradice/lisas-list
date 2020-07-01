const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');

const router = express.Router();
router.use(authController.isLoggedIn);

router.get('/', viewController.getOverview);

router.get(
  '/me/settings',
  authController.protect,
  viewController.getMySettings
);

router.get(
  '/me/settings',
  authController.protect,
  viewController.getMySettings
);

router.get(
  '/me/listings',
  authController.protect,
  viewController.getMyListings
);

router.get(
  '/me/listings/:id',
  authController.protect,
  viewController.getMyListingsEditPage
);

router.get('/login', viewController.getLoginForm);
router.get('/signup', viewController.getSignupForm);

module.exports = router;
