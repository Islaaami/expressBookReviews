const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

// check if username exists
const isValid = (username) => {
  return users.some(u => u.username === username);
};

// check login
const authenticatedUser = (username, password) => {
  return users.some(
    u => u.username === username && u.password === password
  );
};

// REGISTER
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (isValid(username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.json({ message: "User registered successfully" });
});

// LOGIN
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { username },
    "fingerprint_customer",
    { expiresIn: "1h" }
  );

  return res.json({ token });
});

// ADD / UPDATE REVIEW
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews["user"] = review;

  return res.json({
    message: "Review added/updated",
    reviews: books[isbn].reviews
  });
});


// DELETE REVIEW (Q10 FIX)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (books[isbn].reviews["user"]) {
    delete books[isbn].reviews["user"];
  }

  return res.json({
    message: "Review deleted",
    reviews: books[isbn].reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;