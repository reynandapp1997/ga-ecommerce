const mongoose = require('mongoose');

const product = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    qtyStock: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    metrics: {
        seen: {
            type: Number,
        },
        orders: {
            type: Number,
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', product);
