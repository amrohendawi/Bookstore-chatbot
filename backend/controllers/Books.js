'use strict';

var utils = require('../utils/writer.js');
var Books = require('../service/BooksService');

module.exports.findBooks = function findBooks (req, res, next) {
  var title = req.swagger.params['title'].value;
  var price = req.swagger.params['price'].value;
  var genres = req.swagger.params['genres'].value;
  var isbn = req.swagger.params['isbn'].value;
  var language = req.swagger.params['language'].value;
  var author = req.swagger.params['author'].value;
  var limit = req.swagger.params['limit'].value;
  var offset = req.swagger.params['offset'].value;
  Books.findBooks(title,price,genres,isbn,language,author,limit,offset)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
