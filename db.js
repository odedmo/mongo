const { MongoClient } = require('mongodb')

let dbConnection
let uri = 'mongodb+srv://oded:Y1lFMZyqdHstQ61s@cluster0.nxzdg.mongodb.net/?retryWrites=true&w=majority'

module.exports = {
  connectToDb: cb => {
    // MongoClient.connect('mongodb://localhost:27017/bookstore')
    MongoClient.connect(uri)
      .then(client => {
        dbConnection = client.db('bookstore')
        return cb()
      })
      .catch(err => {
        console.log(err)
        return cb(err)
      })
  },
  getDb: () => dbConnection
}