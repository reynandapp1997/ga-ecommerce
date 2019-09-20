const express = require('express');
const router = express.Router();

const {
    getOrder,
    addOrder
} = require('../controllers/order');
const auth = require('../middlewares/auth');

router.get('/', auth, getOrder);
router.post('/', auth, addOrder);

module.exports = router;
