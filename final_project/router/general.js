const express = require('express');
let books = require("./booksdb.js");

const public_users = express.Router();

// Get all books
public_users.get('/', function (req, res) {
  return res.json(books);
});

// Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return books[isbn]
    ? res.json(books[isbn])
    : res.status(404).json({ message: "Book not found" });
});

// Get books by author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let result = {};

  for (let isbn in books) {
    if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
      result[isbn] = books[isbn];
    }
  }

  return res.json(result);
});

// Get books by title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let result = {};

  for (let isbn in books) {
    if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
      result[isbn] = books[isbn];
    }
  }

  return res.json(result);
});

// Get reviews
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  return books[isbn]
    ? res.json(books[isbn].reviews)
    : res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;