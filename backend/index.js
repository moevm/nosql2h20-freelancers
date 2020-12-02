const express = require('express')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express()
app.use(cors())
const userApi = require('./router/api.js')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(cookieParser())

app.use('/api', userApi)

app.use((req, res, next) => {
  var err = new Error('This page not found')
  err.status = 404
  next(err)
})

const port = 3000

app.listen(port, () => {
  console.log('The server is running at http://localhost:' + port)
})

const mongoose = require('mongoose')
const options = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect('mongodb://mongo_db:27017/database1', options).then(()=>{
    console.log('MongoDB is connected')
  }).catch(err=>{
    console.log(err)

  //  setTimeout(connectWithRetry, 5000)
  })
