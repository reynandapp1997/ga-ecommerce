const express = require('express');
const router = express.Router();

const {
    getUserCart,
    addUserCart,
    deleteUserCart
} = require('../controllers/cart');
const auth = require('../middlewares/auth');

router.get('/', auth, getUserCart);
router.post('/', auth, addUserCart);
router.delete('/:id', auth, deleteUserCart);2

module.exports = router;
