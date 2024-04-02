const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


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
    let isbnPromise = new Promise((resove,reject)=>{
    let isbn = req.params.isbn;
  });
  isbnPromise.then((result)=>{
    res.send(result);
  })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    let authorpromise = new Promise ((resolve,reject)=> {
        let bookAuthorData = [];
        for (let inx =0;i<Object.values(books).length;i++)
        {
          if (author === Object.values(books)[inx].author){
            bookAuthorData.push(Object.values(books)[inx]);
          }
        }
        resolve (bookAuthorData);
      });

      authorpromise.then((result)=>{
        if (result.length>0) return res.send(result);
        return res.status(404).json({message: "Author Not Found"});
      });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let titlepromise = new Promise((resolve, reject) => {
        let booktitle=[];
        for (let i =0 ; i < Object.values(books).length; i++){
            if (title === Object.values(books)[i].title){
                booktitle.push(Object.values(books)[i]);
            }
        }
        resolve(booktitle);
  });

  titlepromise.then((result)=> {
    if (result.length>0) return res.send(result);
    return res.status(404).json({message: "Title Not Found"}); 
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const bnId = req.params.isbn;
    return res.send(books[bnId]["reviews"]);
});

module.exports.general = public_users;