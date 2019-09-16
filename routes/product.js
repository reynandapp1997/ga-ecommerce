const express = require('express');
const router = express.Router();

const {
    getAllProduct,
    getProductDetail,
    addProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/product');
const auth = require('../middlewares/auth');
const merchant = require('../middlewares/merchant');

router.get('/', getAllProduct);
router.get('/:id', getProductDetail);
router.post('/', auth, merchant, addProduct);
router.put('/:id', auth, merchant, updateProduct);
router.delete('/:id', auth, merchant, deleteProduct);



module.exports = router;
