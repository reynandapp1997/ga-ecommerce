const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const user = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female']
    },
    role: {
        type: String,
        required: true,
        enum: ['Customer', 'Merchant']
    },
    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

user.plugin(uniqueValidator);

module.exports = mongoose.model('User', user);
