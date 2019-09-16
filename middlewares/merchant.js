module.exports = (req, res, next) => {
    try {
        if (req.user.level !== 'Merchant') {
            return res.status(401).json({
                message: 'You are not authorized'
            });
        }
        return next();
    } catch (error) {
        return res.status(401).json({
            message: 'You are not authorized'
        });
    }
};
