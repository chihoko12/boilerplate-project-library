/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';
const { ObjectId } = require('mongodb');
const myDB = require('../connection');

// initialize database connection
let myDataBase;

myDB().then(client => {
  myDataBase = client.db('database');
  console.log('Database connection established');
}).catch(err => {
  console.error('Database connection failed', err);
});

module.exports = function (app) {

  if (!myDataBase) {
    console.error('Databse not initialized');
  }

  app.route('/api/books')
    .get(function (req, res){
      myDataBase.collection('books').find({}).toArray((err,books) => {
        if (err) {
          res.status(500).send('Error fetching books');
        } else {
          const formattedBooks = books.map(book => ({
            _id: book._id,
            title: book.title,
            commentcount: book.comments.length,
            comments: book.comments
          }));
          res.json(formattedBooks);
        }
      });
    })

    .post(function (req, res){
      let title = req.body.title;
      if (!title) {
        res.json({ error: 'missing required field title'});
      } else {
        const newBook = { title, comments: [] };
        myDataBase.collection('books').insertOne(newBook, (err, result) => {
          if (err) {
            res.json({ error: 'Error creating book' });
          } else {
            res.json(result.ops[0]);
          }
        });
      }
    })

    .delete(function(req, res){
      myDataBase.collection('books').deleteMany({}, (err, result) => {
        if (err) {
          res.json({ error: 'Error deleting books'});
        } else {
          res.send('delete successful');
        }
      });
    });

  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      if (!ObjectId.isValid(bookid)) {
        return res.json({ error: 'no book exists'});
      }

      myDataBase.collection('books').findOne({ _id: new ObjectId(bookid) }, (err, book) => {
        if (err) {
          res.json({ error: 'Error fetching book'});
        } else if (!book) {
          res.json({ error: 'no book exists'});
        } else {
          res.json(book);
        }
      });
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) {
        return res.json({ error: 'missing required field comment'});
      }

      if (!ObjectId.isValid(bookid)) {
        return res.json({ error: 'no book exists'});
      }
      //json res format same as .get

      myDataBase.collection('books').findOneAndUpdate(
        { _id: new ObjectId(bookid) },
        { $push: { comments: comment }},
        { returnOriginal: false },
        (err, result) => {
          if (err) {
            res.json({ error: 'Error adding comment'});
          } else if (!result.value) {
            res.json({ error: 'no book exists'});
          } else {
            res.json(result.value);
          }
        }
        );
    })

    .delete(function(req, res){
      let bookid = req.params.id;
      if (!ObjectId.isValid(bookid)) {
        return res.json({ error: 'no book exists'});
      }

      myDataBase.collection('books').deleteOne({ _id: new ObjectId(bookid) }, (err, result) => {
        if (err) {
          res.json({ error: 'Error deleting book'});
        } else if (result.deletedCount === 0) {
          res.json({ error: 'no book exists'});
        } else {
          res.send('delete successful');
        }
      });
    });

};
