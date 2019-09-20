const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token);

const Product = require('../models/product');
const Cart = require('../models/cart');
const {
    uri
} = require('../middlewares/cloudinaryUpload');
const {
    uploader
} = require('../configs/cloudinaryConfig');
const {
    successResponse,
    errorResponse
} = require('../helpers/response');

exports.getAllProduct = (req, res, next) => {
    const {
        page
    } = req.query;
    let query;
    let skip = page * 10 - 10;
    Product.find(query)
        .populate('userId', '-__v -password')
        .skip(skip)
        .limit(10)
        .exec()
        .then(result => res.status(200).json(successResponse('GET Product Success', result.length, result)))
        .catch(error => {
            /* istanbul ignore next */
            if (process.env.ENVIRONMENT === 'PRODUCTION') {
                bot.sendMessage(process.env.CHAT_ID, `${req.method}, ${req.originalUrl}\n${error.toString()}`);
            }
            /* istanbul ignore next */
            return res.status(500).json(errorResponse(error.toString()));
        });
};

exports.getProductDetail = (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
        .populate('userId', '-__v -password')
        .then(async result => {
            await Product.findByIdAndUpdate({ _id: id }, { $inc: { 'metrics.seen': 1 } });
            return res.status(200).json(successResponse('GET Product Detail Success', null, result))
        })
        .catch(error => {
            /* istanbul ignore next */
            if (process.env.ENVIRONMENT === 'PRODUCTION') {
                bot.sendMessage(process.env.CHAT_ID, `${req.method}, ${req.originalUrl}\n${error.toString()}`);
            }
            /* istanbul ignore next */
            return res.status(500).json(errorResponse(error.toString()));
        });
};

exports.addProduct = async (req, res, next) => {
    let images = [];
    if (req.files) {
        for (let index = 0; index < req.files.length; index++) {
            let file = uri(req)[index];
            let response;
            try {
                response = await uploader.upload(file);
            } catch (error) {
                response = {
                    message: `Image ${req.files[index].originalname} not uploaded`
                }
            }
            images.push(response);
        }
    }
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
        },
        productImages: images
    });
    newProduct.save()
        .then(result => res.status(201).json(successResponse('Success add product')))
        .catch(error => {
            /* istanbul ignore next */
            if (process.env.ENVIRONMENT === 'PRODUCTION') {
                bot.sendMessage(process.env.CHAT_ID, `${req.method}, ${req.originalUrl}\n${error.toString()}`);
            }
            /* istanbul ignore next */
            return res.status(500).json(errorResponse(error.toString()));
        });
};

exports.updateProduct = async (req, res, next) => {
    const id = req.params.id;
    const userId = req.user.id;
    const {
        name,
        description,
        price,
        qtyStock
    } = req.body;
    const existProduct = await Product.findById(id);
    const newProduct = new Product({
        _id: id,
        name,
        description,
        price,
        qtyStock,
        userId,
        productImages: existProduct.productImages
    });
    Product.updateOne({ _id: mongoose.mongo.ObjectId(id), userId: mongoose.mongo.ObjectId(userId) },
        newProduct, (err, raw) => {
            /* istanbul ignore if */
            if (err) {
                if (process.env.ENVIRONMENT === 'PRODUCTION') {
                    bot.sendMessage(process.env.CHAT_ID, `${req.method}, ${req.originalUrl}\n${err.toString()}`);
                }
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
        async (err) => {
            /* istanbul ignore if */
            if (err) {
                if (process.env.ENVIRONMENT === 'PRODUCTION') {
                    bot.sendMessage(process.env.CHAT_ID, `${req.method}, ${req.originalUrl}\n${err.toString()}`);
                }
                return res.status(500).json(errorResponse(err.toString()));
            }
            await Cart.deleteMany({ productId: mongoose.mongo.ObjectId(id) });
            return res.status(200).json(successResponse('Success delete product'))
        })
};
