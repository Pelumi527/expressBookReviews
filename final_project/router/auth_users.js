const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  let usersWithSamename = users.filter((user) => user.username === username);
  if (usersWithSamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.authorization.username;
   if(!username){
    return res.status(404).send("You need to Login to access this functiin")
  }
  const review = req.body.review;
 

  const isbn = req.params.isbn;

  const book = books[isbn];
  if (!book) {
    res.send("Invalid book");
  } else {
    if (book.reviews) {
      const usersWithReview = Object.keys(book.reviews);
      const userHasAReview = usersWithReview.includes(username);
      if (userHasAReview) {
        book.reviews[username] = {
          review,
        };
        return res.status(200).send("Review updated");
      }
      if (!userHasAReview) {
        book.reviews = Object.assign(book.reviews, {
          [username]: {
            review,
          },
        });
        return res.status(200).send("Review Added");
      }
    } else {
      book.reviews = {
        [username]: {
          review,
        },
      };
      return res.status(200).send("Review Added");
    }
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if(!username){
    return res.status(4004).send("You need to Login to access this functiin")
  }
  const book = books[isbn];
  if (!book) {
    res.send("Invalid book");
  } else {
    if (book.reviews) {
      const usersWithReview = Object.keys(book.reviews);
      const userHasAReview = usersWithReview.includes(username);
      if (userHasAReview) {
        delete book.reviews[username];
        return res.status(200).send("Review Deleted")
      } else {
        return res.status(200).send("No review to delete")
      }
    }
    return res.status(200).send("No review to delete")
  }
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
