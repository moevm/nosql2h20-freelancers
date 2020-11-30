const express = require('express')
const router = express.Router()

const model = require('../db/index.js')
const crypt = require('../encryption')
const createToken = require('../middleware/createToken.js')
const checkToken = require('../middleware/checkToken.js')

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

router.post('/useradd', (req, res, next) => {
  const params = req.body

  const login = params.login
  const pwd = params.password
  const fio = params.fio
  const password = crypt.encrypt(pwd)
  const user = new model.User({
    login,
    password,
    fio,
    balance: 0,
    token: createToken(login)
  })
  if (/^[a-zA-Z0-9]{3,12}$/.test(login) && /^[a-zA-Z0-9]{3,12}$/.test(pwd)) {
    model.User.findOne({
      login: user.login
    }, (err, doc) => {
      if (err) console.log(err)
      if (doc) {
        const result = {
          code: 50,
          msg: 'Ошибка! Пользователь с таким логином уже есть',
          tip: 'Переход на вход ...'
        }
        jsonWrite(res, result)
      } else {
        user.save(err => {
          if (err) {
            console.log(err);
            const result = {
              code: 100,
              msg: 'Ошибка! Ошибка в логине или пароле.',
              tip: 'Поменяйте логин или пароль ...'
            }
            jsonWrite(res, result)
          } else {
            const result = {
              code: 200,
              msg: 'Удачно! Добро пожаловать.',
              tip: 'Переход на вход ...'
            }
            jsonWrite(res, result)
          }
        })
      }
    })
  } else {
    const result = {
      code: 100,
      msg: 'Ошибка! Ошибка в логине или пароле.',
      tip: 'Поменяйте логин или пароль ...'
    }
    jsonWrite(res, result)
  }
})

router.post('/login', (req, res, next) => {
  const params = req.body
  const login = params.login
  const pwd = params.password
  const password = crypt.encrypt(pwd)
  const user = new model.User({
    login,
    password,
    token: createToken(login)
  })

  model.User.findOne({
    login: user.login
  }, (err, doc) => {
    if (err) console.log(err)
    if (!doc) {
      const result = {
        code: 50,
        msg: 'Ошибка! Такого пользователя с логином нет.',
        tip: 'Пройдите регистрацию ...'
      }
      jsonWrite(res, result)
    } else if (user.password === doc.password) {
      const result = {
        code: 200,
        login: doc.login,
        token: createToken(login),
        msg: 'Удачно!',
        tip: 'Добро пожаловать. ...'
      }
      jsonWrite(res, result)
    } else {
      const result = {
        code: 100,
        msg: 'Ошибка! Ошибка в пароле',
        tip: 'Попробуйте вспомнить пароль ...'
      }
      jsonWrite(res, result)
    }
  })
})

router.get('/getuser', checkToken, (req, res, next) => {
  model.User.find({}, (err, doc) => {
    if (err) console.log(err)
    jsonWrite(res, doc)
  })
})

router.post('/user', (req, res, next) => {
  let ans = {}
  let comms = []
  model.User.findOne({login: req.body.userlogin}, (err, doc) => {
    if (!doc) {
      jsonWrite(res, {code: 100, msg: "Такого пользователя не существует."})
      return
    }
    if (err) console.log(err)
    model.Comment.find({ownerLogin: req.body.userlogin}, (err, doc1) => {
      if (err) console.log(err)
      if (doc1 !== null){
        doc1.forEach(el => {
          comms.push({authorLogin:el.authorLogin, comm: el.text})
        });
      }
      model.Task.find({employerLogin: req.body.login, currStatus: "waiting"}, (err, doc2) => {
        if (err) console.log(err)
        const tasks = doc2.filter(d=> d.applicantsList.includes(req.body.userlogin))
        ans = {
          login: doc.login,
          fio: doc.fio,
          comms,
          tasks
        }
        jsonWrite(res, ans)
      })
      })
  })
})

router.get('/task', (req, res, next) => {
  model.Task.find({}, (err, doc) => {
    if (err) console.log(err)
    jsonWrite(res, doc)
  })
})

router.post('/task', (req, res, next) => {
  model.Task.findOne({_id: req.body.taskId}, (err, doc) => {
    if (err) console.log(err)
    jsonWrite(res, doc)
  })
})

router.post('/profile', (req, res, next) => {
  let login = req.body.login
  let users_cr_tasks = [] 
  let users_act_tasks = []
  let users_comment = []
  let users_transactions = []
  model.Task.find({employerLogin: login}, (err, doc) => {
    doc.forEach(el => {
      users_cr_tasks.push({
        _id: el._id.toString(),
        taskInfo: el.taskInfo,
        price: el.price,
        currStatus: el.currStatus
      }) 
    });
    if (err) console.log(err)
  })
  model.Transaction.find({ $or: [ {fromLogin: login }, {toLogin: login } ] }, (err, doc) => {
    doc.forEach(el => {
      users_transactions.push({
        fromLogin: el.fromLogin,
        toLogin: el.toLogin,
        value: el.value
      }) 
    });
    if (err) console.log(err)
  })
  model.Task.find({workerLogin: login, currStatus: "in-progress"}, (err, doc) => {
    if (doc !== null){
      doc.forEach(el => {
        users_act_tasks.push({
          _id: el._id.toString(),
          taskInfo: el.taskInfo,
          price: el.price
        })
      });
    }
    if (err) console.log(err)
  })
  model.Comment.find({ownerLogin: login}, (err, doc) => {
    if (doc !== null){
    doc.forEach(el => {
      users_comment.push({
        _id: el._id.toString(),
        ownerLogin: el.ownerLogin,
        authorLogin: el.authorLogin,
        text: el.text
      })
    });
  }
    if (err) console.log(err)
  })
  model.User.findOne({login:login}, (err, doc) => {
    if (doc !== null){
    if (err) console.log(err)
    jsonWrite(res,{
      fio:doc.fio,
      authorOfTasks:users_cr_tasks,
      userActiveTasks:users_act_tasks,
      comments: users_comment,
      balance:doc.balance,
      userTransactions: users_transactions
    }
    )}
  })
})

router.get('/db', (req, res, next) => {
  model.User.find({},(err,doc) =>{ 
    if (doc !== null){
    if (err) console.log(err)
      // jsonWrite(res,doc)
      model.Task.find({},(err1,doc1) =>{ 
        if (doc1 !== null){
        if (err1) console.log(err1)
          model.Comment.find({},(err2,doc2) =>{ 
            if (doc2 !== null){
            if (err2) console.log(err2)
              model.Transaction.find({},(err3,doc3) =>{ 
              if (doc3 !== null){
              if (err3) console.log(err3)
                ans = {
                  user:doc,
                  tasks:doc1,
                  comments:doc2,
                  transaction:doc3,
                  
                  iv: crypt.iv,
                  key: crypt.key
                }
                jsonWrite(res,ans)
              }})
          }})
      }})
  }})
})

router.post('/addtask', (req, res) =>{
  const newTask = {
    workerLogin: "",
    employerLogin: req.body.workerLogin,
    currStatus: "waiting",
    taskInfo: req.body.text,
    creationDate: new Date(),
    finishDate: "",
    price: req.body.price,
    applicantsList: [],
    solutionLink: "",
    type: req.body.type
  }
  model.Task.create(newTask, function(err, result){
    if(err) return console.log(err)
    jsonWrite(res, {"status":"OK"})
});
});

router.post('/respondtask', function(req, res){
  const filter = { _id: req.body.taskId };
  model.Task.findOne(filter, (err, doc) => {
    if (err) console.log(err)  
    const z = doc.applicantsList
    z.push(req.body.login)
    const update = { applicantsList: z };
    model.Task.updateOne(filter, {$set: update}, {
      new: true
    },(err2,doc2)=>{
      if(err2) return console.log(err2);
      res.json({"status":"OK"})
    });
  })
});

router.post('/acceptrespond', function(req, res){
  const filter = { _id: req.body.taskId };  
  const update = { workerLogin: req.body.login, currStatus: "in-progress" };
  model.Task.updateOne(filter, {$set: update}, {
      new: true
    },(err,doc)=>{
      console.log(doc);
      if(err) return console.log(err);
      res.json({"status":"OK"})
    });
});

router.post('/sendtask', function(req, res){
  const filter = { _id: req.body.taskId };  
  const update = { currStatus:"done",finishDate: new Date().toJSON().slice(0,10).replace(/-/g,'/'), solutionLink:req.body.solutionLink };
  model.Task.updateOne(filter, {$set: update}, {
      new: true
    },(err,doc)=>{
      if(err) return console.log(err);
    });
    model.Task.findOne(filter, function(err, result){
      if(err) return console.log(err);
        const new_comm = {
          ownerLogin: result.employerLogin,
          authorLogin: req.body.workerLogin,
          text:req.body.comment
        }
        model.Comment.create(new_comm, function(err, result){
          if(err) return console.log(err)
          res.json({"status":"OK"})
    })
  })
});

router.post('/paytask', function(req, res){
  req.body.taskId
  req.body.comment
  model.Task.findOne({_id:req.body.taskId}, function(err, result){
    if(err) return console.log(err);
    const new_trans = {
      fromLogin: result.employerLogin,
      toLogin: result.workerLogin,
      value: result.price
    }
    model.User.updateOne({login: result.employerLogin},{$inc: {balance: -result.price}},function(err, result){
      if(err) return console.log(err);
    })
    model.User.updateOne({login: result.workerLogin},{$inc: {balance: result.price}},function(err, result){
      if(err) return console.log(err);
    })
    model.Task.updateOne({_id:req.body.taskId},{$set: {currStatus: "finished", finishDate: new Date()}},function(err, result){
      if(err) return console.log(err);
    })
    model.Transaction.create(new_trans, function(err, result){
      if(err) return console.log(err);
    });
    const new_comm = {
      ownerLogin: result.workerLogin,
      authorLogin: result.employerLogin,
      text:req.body.comment
    }
    model.Comment.create(new_comm, function(err, result){
      if(err) return console.log(err);
      res.json({"status":"OK"})
    }); 
    })
});

router.post('/addbalance', function(req, res){
  model.User.updateOne({login: req.body.login},{$inc: {balance: req.body.bal}}, function(err, result){
    if(err) return console.log(err);
  })
  res.json({"status":"OK"})
});

router.post('/refreshdb', function(req, res){
  model.User.deleteMany({},function(err, result){
    if(err) return console.log(err);
  })
  model.Task.deleteMany({},function(err, result){
    if(err) return console.log(err);
  })
  model.Comment.deleteMany({},function(err, result){
    if(err) return console.log(err);
  })
  model.Transaction.deleteMany({},function(err, result){
    if(err) return console.log(err);
  })
  model.User.insertMany(req.body.users,(err,doc) =>{
    if(err) return console.log(err);
    model.Task.insertMany(req.body.tasks,(err1,doc1) =>{
      if(err1) return console.log(err1);
      model.Comment.insertMany(req.body.comments,(err2,doc2) =>{
        if(err2) return console.log(err2);
        model.Transaction.insertMany(req.body.transactions,(err3,doc3) =>{
          if(err3) return console.log(err3);
          res.json({"status":"OK"})
        })
      })
    })
  })
});

module.exports = router
