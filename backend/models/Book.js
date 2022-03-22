const mongoose = require('mongoose');

const book = new mongoose.Schema({
    available: Number,
    coverImg: String,
    description: String,
    genres: [String],
    isbn: Number,
    language: String,
    price: Number,
    publishDate: String,
    rating:[Number],
    title: String
})

const Book = mongoose.model('Book', book)

module.exports = Book;