const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username, password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res
    .status(404)
    .json({
      message:
        "Unable to register user. Username and/or password are not provided",
    });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here

  return res.send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  const book = books[isbn];
  if (!book) {
    res.send("Invalid isbn");
  } else {
    res.send(book);
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;
  const keys = Object.keys(books);
  let book;
  for (let i = 0; i < keys.length; i++) {
    if (books[keys[i]].author === author) {
      book = books[keys[i]];
    }
  }
  if (book) {
    res.send(book);
  } else {
    res.send("Invalid Author");
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;
  const keys = Object.keys(books);
  let book;
  for (let i = 0; i < keys.length; i++) {
    if (books[keys[i]].title === title) {
      book = books[keys[i]];
    }
  }
  if (book) {
    res.send(book);
  } else {
    res.send("Invalid Title");
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  const book = books[isbn];
  if (!book) {
    res.send("Invalid isbn");
  } else {
    if (book.review) {
      res.send(book.review);
    } else {
      res.send("No review");
    }
  }
});


//TASKS
const getAllBooks = async (url) => {
  const response = await axios.get(url);
};
const getBookDetailsByIsbn = async (url, isbn) => {
  const response = await axios.get(`${url}/isbn/${isbn}`)
  console.log(response)
}

const getBookDetailsByAuthor = async (url, author) => {
  const response = await axios.get(`${url}/author/${author}`)
  console.log(response)
}

const getBookDetailsByTitle = async (url, title) => {
  const response = await axios.get(`${url}/title/${title}`)
  console.log(response)
}

module.exports.general = public_users;
