const mongoose = require('mongoose');

const order = new mongoose.Schema({
    email: String,
    name: String,
    street: String,
    plz: String,
    city: String,
    email: String,
    isbn: Number,
    state: String,
    id: String
});

const Order = mongoose.model('Order', order);

module.exports = Order;