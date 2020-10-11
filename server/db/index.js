const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017')
const db = mongoose.connection
mongoose.Promise = global.Promise

db.on('error', function () {
  console.log('Connect error')
})
db.once('open', function () {
  console.log('Mongodb started successfully')
})

const helloSchema = mongoose.Schema({
  text: {
    type: String,
    required: true
  }
})

const Models = {
  Hello: mongoose.model('Hello', helloSchema)
}

module.exports = Models
