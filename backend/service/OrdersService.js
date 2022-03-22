'use strict';

const Order = require('../models/Order');
const Book = require('../models/Book');


/**
 * Delete purchase order by ID
 * For valid response try integer IDs with positive integer value.\\ \\ Negative or non-integer values will generate API errors
 *
 * email String orders by email (optional)
 * id Long orders by book ISBN (optional)
 * returns Order
**/

exports.deleteOrder = function(email,id) {
  return new Promise(function(resolve, reject) {
    var query = {
      email: email,
      id: id
    };
    var error = [] 
    var examples = {};
    Order.find(query, {_id: 0}).then(res => {
      examples['application/json'] = res;
      console.log(res)
      if (res.length == 0) { //check if order in DB
        error.push({"error":"Order not correct"});
        resolve(error);
      } else {
        var order = res[0]
        delete order._id
        var bookQuery= {
          isbn: order.isbn
        }
        Book.find(bookQuery, {_id: 0}).then((resin) => { //find the book
          var book = resin[0] 
          delete book._id
          book.available = book.available + 1
          Book.updateOne(book).then((res2) => { //update book in DB
          Order.deleteOne(query).then(res3 => { //delete ordder
             examples['application/json'] = res3;
             resolve(examples[Object.keys(examples)[0]]);
           }); 
          })         
        }).catch((err) => console.log(`error ${err}`));
      }
    });
  });
}
 

/**
 * Find orders
 * Returns a map of status codes to quantities
 *
 * id Long orders by email (optional)
 * email String orders by email (optional)
 * name String orders by email (optional)
 * isbn Long orders by book ISBN (optional)
 * returns OrderList
 **/
exports.getOrders = function(id,email,name,isbn) {
  return new Promise(function(resolve, reject) {
    var query = {
      id: id,
      email: email,
      name: name,
      isbn:isbn
    };
    for (const key in query) {
      if (query[key] === undefined) {
        delete query[key];
      }
    }
    var examples = {};
    Order.find(query).then(res => {
      examples['application/json'] = res;
      if (Object.keys(examples).length > 0) {
        resolve(examples[Object.keys(examples)[0]]);
      } else {
        resolve();
      }
    });
  });
}


/**
 * Place an order for a book\"
 *
 * email String orders by email
 * isbn Long orders by book ISBN
 * returns Order
 **/
exports.placeOrder = function(name,street,plz,city,email,isbn) {
 
  return new Promise(function(resolve, reject) {
    var book= {}
    var error = [];
    var examples = {}
    var bookQuery= {
      isbn: isbn
    }
    Book.find(bookQuery, {_id: 0}).then((res) => {
      if (res.length == 0) { //check book in DB
        error.push({"error":"Book not found in DB"});
        resolve(error);
      }else{
        book = res[0] //to habdel the bug in mongoDb with findOne()
        if (book['available'] == 0){ //check if there is an available unit from the book
          error.push({"error":"Book not available anymore"});
          resolve(error);
        }else {
          var _id = Math.random().toString(36).substring(2,7).toUpperCase();
          var stateArray = [
            "In Bearbeitung",
            "In Versandvorbearbeitung",
            "Versendet"
          ];
          var _state = stateArray[Math.floor(Math.random()*stateArray.length)];
          Order.insertMany({name: name, id: _id, state: _state, street: street, plz: plz, city: city, email: email, isbn: isbn}).then((resin) => { //place order
            examples['application/json'] = resin;
            book.available = book.available -1
            delete book._id
            Book.updateOne(book).then((res) => { //update object in DB
              resolve(examples)
            }) 
          }).catch((err) => console.log(`error ${err}`));
        }
      }
    })
  });
}







