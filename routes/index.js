const express = require('express');
const router = express.Router();

const user = require('./user');
const product = require('./product');
const cart = require('./cart');
const order = require('./order');

router.use('/user', user);
router.use('/product', product);
router.use('/cart', cart);
router.use('/order', order);

module.exports = router;
