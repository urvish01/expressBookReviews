const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    const isValid = (username) => {
        let userFullName = users.filter((user) => {
            return user.username == username
        });
        if (userFullName.length > 0) return true;
        else return false;
    }
}

const authenticatedUser = (username, password) => { //returns boolean
    const authenticatedUser = (username, password) => {
        if (isValid) {
            let validUserData = users.filter((user) => {
                return (user.username == username && user.password === password)
            });
            if (validUserData.length > 0) return true;
            else return false;
        }
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password) return res.status(400).json({ message: "Please add username or password" });

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).json({ message: "User logged in successfully" });
    }

    return res.status(500).json({ message: "Internal server error" })
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let reviewQ = req.query?.review;
    let bnData = req.params.isbn;
    let booksReviewData = books[bnData];

    if (booksReviewData) {
        let username = req.session.authorization.username;
        if (reviewQ) booksReviewData.reviews[username] = reviewQ;
        books[bnData] = booksReviewData;
       return res.status(200).json({ message: "Book review added/updated" });
    }

    return res.status(404).json({ message: "Data not Found"})
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let bookId = req.params.isbn;
    let bookreviewdel = books[bookId];
    let username = req.session.authorization.username;

    if (bookreviewdel){
        delete bookreviewdel.reviews[username];
        return res.status(200).json({ message :"Book Review Deleted"});
    }

   return res.status(400).json({ message: "pls send currect data"});
  });


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
