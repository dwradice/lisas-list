const express = require('express');
const productController = require('./../controllers/productController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/myProducts')
  .get(authController.protect, productController.getMyProducts);

router.post(
  '/postProduct',
  authController.protect,
  productController.uploadProductPhoto,
  productController.resizeProductPhoto,
  productController.myPostings,
  productController.createProduct
);

router
  .route('/')
  .get(productController.getAllProducts)
  .post(productController.createProduct);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;