'use strict';

var utils = require('../utils/writer.js');
var Orders = require('../service/OrdersService');

module.exports.deleteOrder = function deleteOrder (req, res, next) {
  var email = req.swagger.params['email'].value;
  var id = req.swagger.params['id'].value;
  Orders.deleteOrder(email,id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getOrders = function getOrders (req, res, next) {
  var id = req.swagger.params['id'].value;
  var email = req.swagger.params['email'].value;
  var name = req.swagger.params['name'].value;
  var isbn = req.swagger.params['isbn'].value;
  Orders.getOrders(id,email,name,isbn)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.placeOrder = function placeOrder (req, res, next) {
  var name = req.swagger.params['name'].value;
  var street = req.swagger.params['street'].value;
  var plz = req.swagger.params['plz'].value;
  var city = req.swagger.params['city'].value;
  var email = req.swagger.params['email'].value;
  var isbn = req.swagger.params['isbn'].value;
  Orders.placeOrder(name,street,plz,city,email,isbn)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
