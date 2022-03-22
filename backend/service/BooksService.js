'use strict';

const Book = require('../models/Book');


/**
 * Find books
 * Muliple phrases can be provided with comma separated strings. Use\\ \\ phrase1, phrase2, phrase3 for testing.
 *
 * title String Title of the book (optional)
 * price String Price of the book ( >e, <e, e) (optional)
 * genres String Genre of the book (optional)
 * isbn Long ISBN of the book (optional)
 * language String Book language (optional)
 * author String Book author (optional)
 * limit Integer limit in paging (optional)
 * offset Integer offset in paging (optional)
 * returns BooksList
 **/

 exports.findBooks = function(title,price,genres,isbn,language,author,limit,offset) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    var c;
    if (price !== undefined){
      if (price.includes(">")){
        c = { $gte: Number(price.substr(1, price.length))};
      } else if (price.includes("<")){
        c = { $lte: Number(price.substr(1, price.length))};
      } else if (price.includes("-")){
        c = { $gte: Number(price.split("-")[0]), $lte: Number(price.split("-")[1])  }
      } else {
        c = price
      }
    }
    var query = {
      title: title,
      genres: genres,
      isbn: isbn,
      language: language,
      author: author,
      price: c
    };
    for (const key in query) {
      if (query[key] === undefined) {
        delete query[key];
      }
    }
    Book.find(query).skip(offset ? offset : 0).limit(limit ? limit : 100).then((res) => {
      examples['application/json'] = res;
      if (Object.keys(examples).length > 0) {
        resolve({
          count: res.length,
          list: examples[Object.keys(examples)[0]]
        });
      } else {
        resolve();
      }
    });
  });
}
