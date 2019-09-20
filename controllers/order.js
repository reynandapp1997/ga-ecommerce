const mongoose = require('mongoose');

const Order = require('../models/order');
const {
    successResponse,
    errorResponse
} = require('../helpers/response');

exports.getOrder = (req, res, next) => {
    const id = req.user.id;
    Order.find({ userId: mongoose.mongo.ObjectId(id) })
        .exec()
        .then(result => res.status(200).json(successResponse('Success GET Orders', result.length, result)))
        .catch(error => res.status(500).json(errorResponse(error.toString())));
};

exports.addOrder = (req, res, next) => {
    const userId = req.user.id;
    const {
        productId,
        qty,
        total
    } = req.body;
    const newOrder = new Order({
        productId,
        userId,
        qty,
        total
    });
    newOrder.save()
        .then(result => res.status(201).json(successResponse('Success Add Order')))
        .catch(error => res.status(500).json(errorResponse(error.toString())));
};
