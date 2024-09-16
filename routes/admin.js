const express = require('express');

const shopController = require('../controllers/shop');
const adminController = require('../controllers/admin');

const router = express.Router();


const products = [];

router.get('/add-product', adminController.getAddProduct);

router.get('/products', adminController.getProducts);

router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:id', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct)

module.exports = router;