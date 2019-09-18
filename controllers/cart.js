const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token);

const Cart = require('../models/cart');
const {
    successResponse,
    errorResponse
} = require('../helpers/response');

exports.getUserCart = (req, res, next) => {
    const userId = req.user.id;
    Cart.find({ userId: mongoose.mongo.ObjectId(userId) })
        .populate('productId')
        .populate('userId', '-__v -password')
        .exec()
        .then(result => res.status(200).json(successResponse('Success get cart', result.length, result)))
        .catch(error => {
            /* istanbul ignore next */
            if (process.env.ENVIRONMENT === 'PRODUCTION') {
                bot.sendMessage(process.env.CHAT_ID, `${req.method}, ${req.originalUrl}\n${error.toString()}`);
            }
            /* istanbul ignore next */
            return res.status(500).json(errorResponse(error.toString()));
        });
};

exports.addUserCart = (req, res, next) => {
    const userId = req.user.id;
    const {
        productId,
        qty
    } = req.body;
    const newCart = new Cart({
        userId,
        productId,
        qty
    });
    newCart.save()
        .then(result => res.status(201).json(successResponse('Success add to cart')))
        .catch(error => {
            /* istanbul ignore next */
            if (process.env.ENVIRONMENT === 'PRODUCTION') {
                bot.sendMessage(process.env.CHAT_ID, `${req.method}, ${req.originalUrl}\n${error.toString()}`);
            }
            /* istanbul ignore next */
            return res.status(500).json(errorResponse(error.toString()));
        });
};

exports.deleteUserCart = (req, res, next) => {
    const userId = req.user.id;
    const id = req.params.id;
    Cart.deleteOne({ _id: mongoose.mongo.ObjectId(id), userId: mongoose.mongo.ObjectId(userId) },
        (err) => {
            /* istanbul ignore if */
            if (err) {
                if (process.env.ENVIRONMENT === 'PRODUCTION') {
                    bot.sendMessage(process.env.CHAT_ID, `${req.method}, ${req.originalUrl}\n${err.toString()}`);
                }
                return res.status(500).json(errorResponse(err.toString()));
            }
            return res.status(200).json(successResponse('Success delete cart'))
        });
};
