const Book = require('../models/Book');
const CSVToJSON = require('csvtojson');

``
class BookRepository {
  /**
   * @param {*} model
   */
  constructor(model) {
    this.model = model;
    console.log('init db');
    Book.count().then((res) => {
      if (res === 0) {
        let init = async () => {
          var _books = await CSVToJSON().fromFile('books_1.Best_Books_Ever.csv');
          var books = _books.map(o => {
            return {
              available: Math.floor(Math.random() * 7) +1,
              coverImg: o.coverImg,
              description: o.description,
              genres: JSON.parse(o.genress.replaceAll("'", "\"")),
              isbn: /\D/.test(o.isbn) ? false : parseInt(o.isbn),
              language: o.language,
              price: o.price === "" ? 10.0 : parseFloat(o.price),
              publishDate: o.publishDate,
              rating: parseFloat(o.rating),
              title: o.title
            };
          })
            .filter(x => !Object.values(x).every(Boolean));
          var x = Array.from(new Set(books.map(a => a.isbn)))
            .map(isbn => {
              return books.find(b => b.isbn === isbn)
            });
          return x;
        };
        init().then((books) => {
          this.model.insertMany(books);
          console.log('load CSV done!');
        });
      }
    });
  }

  /**
   * @param {String} name
   */
  create(body) {
    const board = new this.model(body);
    return board.save();
  }

  findAll() {
    return this.model.find();
  }

  /**
   * finds and returns a book with given isbn
   * @param {Integer} isbn
   */
  findABook(isbn) {
    return this.model.findByName({}, { "isbn": isbn });
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

module.exports = new BookRepository(Book);