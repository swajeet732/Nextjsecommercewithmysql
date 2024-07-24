// models/Order.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    email: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);


module.exports = Order;
