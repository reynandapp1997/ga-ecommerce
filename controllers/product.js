const mongoose = require('mongoose');

const Product = require('../models/product');
const {
    successResponse,
    errorResponse
} = require('../helpers/response');

exports.getAllProduct = (req, res, next) => {
    var query;
    Product.find(query)
        .populate('userId', '-__v -password')
        .exec()
        .then(result => res.status(200).json(successResponse('GET Product Success', result.length, result)))
        .catch(error => res.status(500).json(errorResponse(error.toString())));
};

exports.getProductDetail = (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
        .populate('userId', '-__v -password')
        .then(async result => {
            await Product.findByIdAndUpdate({ _id: id }, { $inc: { 'metrics.seen': 1 } });
            return res.status(200).json(successResponse('GET Product Detail Success', null, result))
        })
        .catch(error => res.status(500).json(errorResponse(error.toString())));
};

exports.addProduct = (req, res, next) => {
    const userId = req.user.id;
    const {
        name,
        description,
        price,
        qtyStock
    } = req.body;
    const newProduct = new Product({
        name,
        description,
        price,
        qtyStock,
        userId,
        metrics: {
            seen: 0,
            orders: 0
        }
    });
    newProduct.save()
        .then(result => res.status(201).json(successResponse('Success add product')))
        .catch(error => res.status(500).json(errorResponse(error.toString())));
};

exports.updateProduct = (req, res, next) => {
    const id = req.params.id;
    const userId = req.user.id;
    const {
        name,
        description,
        price,
        qtyStock
    } = req.body;
    const newProduct = new Product({
        _id: id,
        name,
        description,
        price,
        qtyStock,
        userId
    });
    Product.updateOne({ _id: mongoose.mongo.ObjectId(id), userId: mongoose.mongo.ObjectId(userId) },
        newProduct, (err, raw) => {
            if (err) {
                return res.status(500).json(errorResponse(err.toString()));
            } else if (raw) {
                return res.status(200).json(successResponse('Success update product'))
            }
        });
};

exports.deleteProduct = (req, res, next) => {
    const id = req.params.id;
    const userId = req.user.id;
    Product.deleteOne({ _id: mongoose.mongo.ObjectId(id), userId: mongoose.mongo.ObjectId(userId) },
        (err) => {
            if (err) {
                return res.status(500).json(errorResponse(err.toString()));
            }
            return res.status(200).json(successResponse('Success delete product'))
        })
};
