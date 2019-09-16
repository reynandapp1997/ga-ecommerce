const express = require('express');
const router = express.Router();

const {
    getAllUser,
    createUser,
    loginUser,
    resetPassword,
    changePassword
} = require('../controllers/user');

router.get('/', getAllUser);
router.post('/', createUser);
router.post('/login', loginUser);
router.post('/reset-password', resetPassword);
router.post('/reset/:token', changePassword);

module.exports = router;
