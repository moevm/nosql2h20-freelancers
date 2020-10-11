const express = require('express')
const router = express.Router()

const model = require('../db/index.js')

const jsonWrite = (res, ret) => {
  if (typeof ret === 'undefined') {
    res.json({
      code: '404',
      msg: 'server is error'
    })
  } else {
    res.json(ret)
  }
}

router.get('/gethello', (req, res, next) => {
  
  const hello = new model.Hello({
    text: 'hello word'
  })

  model.Hello.find({text: hello.text}, (err, doc) => {
    if (err) console.log(err)
    else if (doc) jsonWrite(res, doc)
    else {
      hello.save(err => console.log(err))
      jsonWrite(res, doc)
    }
    
  })
})

module.exports = router
