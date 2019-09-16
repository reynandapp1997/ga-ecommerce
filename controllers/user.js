const bcrypjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token);

const User = require('../models/user');
const {
    sendResetPassword
} = require('../services/nodemailer');

const {
    successResponse,
    errorResponse
} = require('../helpers/response');

exports.getAllUser = (req, res, next) => {
    User.find()
        .select('-password')
        .then(result => {
            return res.status(200).json(successResponse('success', result.length, result));
        })
        .catch(error => {
            /* istanbul ignore next */
            if (process.env.ENVIRONMENT === 'PRODUCTION') {
                bot.sendMessage(process.env.CHAT_ID, `${req.method}, ${req.originalUrl}\n${error.toString()}`);
            }
            return res.status(500).json(errorResponse(error.toString()));
        });
};

exports.createUser = (req, res, next) => {
    const {
        name,
        email,
        password,
        gender,
        role
    } = req.body;
    bcrypjs.hash(password, 10, async (err, hash) => {
        const newUser = new User({
            name,
            email,
            password: hash,
            gender,
            role
        });
        newUser.save()
            .then(result => {
                return res.status(201).json(successResponse('User created'))
            })
            .catch(error => {
                if (process.env.ENVIRONMENT === 'PRODUCTION') {
                    bot.sendMessage(process.env.CHAT_ID, `${req.method}, ${req.originalUrl}\n${error.toString()}`);
                }
                return res.status(500).json(errorResponse(error.toString()));
            });
    });
};

exports.loginUser = async (req, res, next) => {
    const {
        email,
        password
    } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json(errorResponse('Invalid credential'));
    }
    bcrypjs.compare(password, user.password, (error, success) => {
        /* istanbul ignore if */
        if (error) {
            if (process.env.ENVIRONMENT === 'PRODUCTION') {
                bot.sendMessage(process.env.CHAT_ID, `${req.method}, ${req.originalUrl}\n${error.toString()}`);
            }
            return res.status(500).json(errorResponse(error));
        } else if (success) {
            const token = jwt.sign({
                id: user._id,
                name: user.name,
                email: user.email,
                gender: user.gender,
                role: user.role
            }, process.env.JWT_SECRET_KEY, {
            });
            res.setHeader('Authorization', `Bearer ${token}`);
            return res.status(200).json({
                message: 'Login Success',
                id: user._id,
                name: user.name,
                email: user.email,
                gender: user.gender,
                role: user.role,
                token: `Bearer ${token}`
            });
        }
        return res.status(401).json(errorResponse('Invalid credential'));
    })
};

exports.resetPassword = (req, res, next) => {
    const email = req.body.email;
    sendResetPassword(email, res);
};

exports.changePassword = (req, res, next) => {
    const token = req.params.token;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const password = req.body.password;
        bcrypjs.hash(password, 10, (error, hash) => {
            /* istanbul ignore if */
            if (error) {
                if (process.env.ENVIRONMENT === 'PRODUCTION') {
                    bot.sendMessage(process.env.CHAT_ID, `${req.method}, ${req.originalUrl}\n${error.toString()}`);
                }
                return res.status(500).json(errorResponse('Failed hashing password'));
            } else if (hash) {
                User.findOneAndUpdate({ _id: decoded.id, email: decoded.email }, { $set: { password: hash } }, (err, doc) => {
                    /* istanbul ignore if */
                    if (err) {
                        if (process.env.ENVIRONMENT === 'PRODUCTION') {
                            bot.sendMessage(process.env.CHAT_ID, `${req.method}, ${req.originalUrl}\n${err.toString()}`);
                        }
                        return res.status(500).json(errorResponse('Failed update password'));
                    } else if (doc) {
                        return res.status(200).json(successResponse('Success reset password'));
                    }
                });
            }
        });
    } catch (error) {
        /* istanbul ignore next */
        return res.status(401).json({
            message: 'You are not authorized'
        });
    }
};
