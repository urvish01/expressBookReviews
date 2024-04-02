const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

console.log("🚀 ~ file: general.js:5 ~ users:", users)


const userExist = (username)=> {
    let fullName = users.filter((user) =>{
      return user.username===username;
    });

    if (fullName.length>0) return true;
    return false;
}


public_users.post("/register", (req,res) => {
    const username= req.body.username;
    const password= req.body.password;
  
    if (username && password) {
      if (!userExist(username)) {
        users.push({"username": username, "password": password});
        console.log("🚀 ~ file: general.js:5 ~ users:", users)
        return res.status(201).json({message: "User successfully registered. You can now Login" });
      }
      else {
        return res.status(400).json({message: "User already exists."});
      }
    }
    return res.status(400).json({message: "pls check username and password"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

  let bookspromise=new Promise((resolve,reject)=> {
    resolve(books);
  });
  bookspromise.then((result)=> {
    res.send(JSON.stringify({books: result},null,4));
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
      return res.send(book);
  } else {
      return res.status(404).json({ message: "Book not found" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let bookAuthorData = [];
  for (let isbn in books) {
      if (books[isbn].author === author) {
          bookAuthorData.push(books[isbn]);
      }
  }

  if (bookAuthorData.length > 0) {
      return res.send(bookAuthorData);
  } else {
      return res.status(404).json({ message: "Author Not Found" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let booktitle = [];
  for (let isbn in books) {
      if (books[isbn].title === title) {
          booktitle.push(books[isbn]);
      }
  }

  if (booktitle.length > 0) {
      return res.send(booktitle);
  } else {
      return res.status(404).json({ message: "Title Not Found" });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn] && books[isbn]["reviews"]) {
      return res.send(books[isbn]["reviews"]);
  } else {
      return res.status(404).json({ message: "Book not found or no reviews available" });
  }
});


module.exports.general = public_users;