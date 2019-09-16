module.exports = (req, res, next) => {
    if (req.user.role !== 'Merchant') {
        return res.status(401).json({
            message: 'You are not authorized'
        });
    }
    return next();
};
