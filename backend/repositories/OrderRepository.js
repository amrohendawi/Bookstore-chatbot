const Order = require('../models/Order');

``
class OrderRepository {
  /**
   * @param {*} model
   */
  constructor(model) {
    this.model = model;
  }

  /**
   * @param {String} name
   */
  create(body) {
    const order = new this.model(body);
    return order.save();
  }

  findAll() {
    return this.model.find();
  }

  /**
   * finds and returns a order with given isbn/email
   * @param {Integer} isbn
   * @param {String} email
   */
  findAnOrder(isbn, email) {
    var query = {
      isbn: isbn,
      email: email
    };
    for (const key in query) {
      if (query[key] === undefined) {
        delete query[key];
      }
    }
    return this.model.find(query);
  }

  /**
   *
   * @param {integer} id
   * @param {*} object
   */
  updateByName(title, object) {
    const query = { title: title };
    return this.model.findOneAndUpdate(query, { $set: object });
  }
}

module.exports = new OrderRepository(Order);