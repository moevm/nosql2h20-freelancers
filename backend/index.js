const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express()

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
