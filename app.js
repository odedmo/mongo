const express = require('express')
const { ObjectId } = require('mongodb')
const { connectToDb, getDb } = require('./db')

// init app
const app = express()
app.use(express.json())

// db connection
const PORT = 3000
let db

connectToDb(err => {
  if (!err) {
    app.listen(PORT, () => {
      console.log(`app listenning on port ${PORT}`)
    })
    db = getDb()
  }
})

app.get('/books', (req, res) => {
  
  const page = Number(req.query.p || 0)
  const booksPerPage = 3

  let books = []
  
  db.collection('books')
    .find()
    .sort({ author: 1 })
    .skip(page * booksPerPage)
    .limit(booksPerPage)
    .forEach(book => books.push(book))
    .then(() => {
      res.status(200).json(books)
    })
    .catch(() => {
      res.status(500).json({error: 'Could not fetch documents'})
    })
})

app.get('/books/:id', (req, res) => {

  if (ObjectId.isValid(req.params.id)) {
    db.collection('books')
      .findOne({_id: ObjectId(req.params.id)})
      .then(doc => {
        res.status(200).json(doc)
      })
      .catch(err => {
        res.status(500).json({error: 'Could not fetch document'})
      })
  } else {
    res.status(500).json({error: 'not a valid id'})
  }
})

app.post('/books', (req, res) => {
  const book = req.body

  db.collection('books')
    .insertOne(book)
    .then(result => {
      res.status(201).json(result)
    })
    .catch(err => {
      res.status(500).json({err: 'could not create document'})
    })
})

app.delete('/book/:id', (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection('books')
      .deleteOne({_id: ObjectId(req.params.id)})
      .then(result => {
        res.status(200).json(result)
      })
      .catch(err => {
        res.status(500).json({err: 'could not delete document'})
      })
  } else {
    res.status(500).json({err: 'not a valid id'})
  }
})

app.patch('/books/:id', (req, res) => {
  const updates = req.body

  if (ObjectId.isValid(req.params.id)) {
    db.collection('books')
      .updateOne({_id: ObjectId(req.params.id)}, {$set: updates})
      .then(result => {
        res.status(200).json(result)
      })
      .catch(err => {
        res.status(500).json({err: 'could not delete document'})
      })
  } else {
    res.status(500).json({err: 'not a valid id'})
  }
})