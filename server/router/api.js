const express = require('express')
const router = express.Router()

const crypto = require('crypto')
const model = require('../db/index.js')
const { ObjectId } = require('mongodb')

// const createToken = require('../middleware/createToken.js')
// const checkToken = require('../middleware/checkToken.js')

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
  

// router.post('/useradd', (req, res, next) => {
//   const params = req.body

//   const login = params.login
//   const pwd = params.password
//   const md5 = crypto.createHash('md5')
//   const fio = params.fio
//   const password = md5.update(pwd).digest('hex')

//   const user = new model.User({
//     login,
//     password,
//     fio,
//     balance: 0,
//     token: createToken(login)
//   })

//   if (/^[a-zA-Z0-9]{3,12}$/.test(login) && /^[a-zA-Z0-9]{3,12}$/.test(pwd)) {
//     model.User.findOne({
//       login: user.login
//     }, (err, doc) => {
//       if (err) console.log(err)
//       if (doc) {
//         const result = {
//           code: 50,
//           msg: 'Error existing Login'
//         }
//         jsonWrite(res, result)
//       } else {
//         user.save(err => {
//           if (err) {
//             console.log(err);
//             const result = {
//               code: 100,
//               msg: 'Error login or password'
//             }
//             jsonWrite(res, result)
//           } else {
//             const result = {
//               code: 200,
//               msg: 'Success'
//             }
//             jsonWrite(res, result)
//           }
//         })
//       }
//     })
//   } else {
//     const result = {
//       code: 100,
//       msg: 'Error login or password'
//     }
//     jsonWrite(res, result)
//   }
// })

// router.post('/login', (req, res, next) => {
//   console.log(req.body);
//   const params = req.body

//   const login = params.login
//   const pwd = params.password
//   const md5 = crypto.createHash('md5')
//   const password = md5.update(pwd).digest('hex')

//   const user = new model.User({
//     login,
//     password,
//     token: createToken(login)
//   })

//   model.User.findOne({
//     login: user.login
//   }, (err, doc) => {
//     if (err) console.log(err)
//     if (!doc) {
//       const result = {
//         code: 50,
//         msg: 'Nonexistent login'
//       }
//       jsonWrite(res, result)
//     } else if (user.userPwd === doc.userPwd) {
//       const result = {
//         code: 200,
//         login: doc.login,
//         token: createToken(login),
//         msg: 'Success'
//       }
//       jsonWrite(res, result)
//     } else {
//       const result = {
//         code: 100,
//         msg: 'Error password'
//       }
//       jsonWrite(res, result)
//     }
//   })
// })

// router.get('/getuser', checkToken, (req, res, next) => {
//   model.User.find({}, (err, doc) => {
//     if (err) console.log(err)
//     jsonWrite(res, doc)
//   })
// })

// module.exports = router









// i dont understand


// router.get('/user', (req, res, next) => {
//   login = req.body.login
//   req.body.userlogin
//   ans = {}
//   res.json(ans)
// })




router.get('/task', (req, res, next) => {
  model.Task.find({}, (err, doc) => {
    if (err) console.log(err)
    jsonWrite(res, doc)
  })
})

router.get('/profile', (req, res, next) => {
  let login = 'qwerty' //req.body.login 
  let users_cr_tasks = [] 
  let users_act_tasks = []
  let users_comment = []
  model.Task.find({employerId: login}, (err, doc) => {
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
  model.Task.find({workerId: login, currStatus:"active"}, (err, doc) => {
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
  model.Comment.find({ownerId: login}, (err, doc) => {
    if (doc !== null){
    doc.forEach(el => {
      users_comment.push({
        _id: el._id.toString(),
        ownerId: el.ownerId,
        authorId: el.authorId,
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
      balance:doc.balance
    }
  )}
})
// res.json({"error":"nothing was found"})
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
                  transaction:doc3
                }
                jsonWrite(res,ans)
              }})
          }})
      }})
  }})
})

router.post('/addtask', function(req, res){
  const newTask = {
    _id: new ObjectId(),
    workerId: req.body.workerLogin,
    employerId: "",
    currStatus: "waiting",
    taskInfo: req.body.text,
    creationDate: Date("01.02.2020"),
    finishDate: Date("02.03.2020"),
    price: req.body.price,
    applicantsList: [],
    solutionLink: "",
    type: req.body.type
  }
  console.log(newTask)
  model.Task.create(newTask, function(err, result){
    if(err) return console.log(err);
    // res.send(user);
    res.json({"status":"OK"})
});
});

router.post('/respondtask', function(req, res){
  req.body.employerLogin
  req.body.taskid

  const filter = { _id: req.body.taskid };
  console.log(filter)
  model.Task.findOne(filter, (err, doc) => {
    if (err) console.log(err)  
    const z = doc.applicantsList
    z.push(req.body.employerLogin)
    const update = { applicantsList: z };
    model.Task.updateOne(filter, update, {
      new: true
    },(err2,doc2)=>{
      if(err2) return console.log(err2);
      res.json({"status":"OK"})
    });
  })
});


router.post('/acceptrespond', function(req, res){

  const filter = { _id: req.body.taskid };  
  const update = { workerId: req.body.login, currStatus:"In progress" };
  model.Task.updateOne(filter, update, {
      new: true
    },(err,doc)=>{
      if(err) return console.log(err);
      res.json({"status":"OK"})
    });
});

router.post('/sendtask', function(req, res){
  req.body.employerLogin
  req.body.taskid
  req.body.solutionLink
  req.body.comment

  const filter = { _id: req.body.taskid,employerId: req.body.employerLogin };  
  const update = { currStatus:"Done",finishDate: new Date().toJSON().slice(0,10).replace(/-/g,'/'), solutionLink:req.body.solutionLink };
  model.Task.updateOne(filter, update, {
      new: true
    },(err,doc)=>{
      if(err) return console.log(err);
    });
    model.Task.findOne(filter, function(err, result){
      if(err) return console.log(err);
        const new_comm = {
          _id: new ObjectId(),
          ownerId: result.workerId,
          authorId: req.body.employerLogin,
          text:req.body.comment
        }
        model.Comment.create(new_comm, function(err, result){
          if(err) return console.log(err);
          // res.send(user);
          res.json({"status":"OK"})
      }); 
  });
  // res.json({"status":"OK"})
});

router.post('/paytask', function(req, res){
  req.body.taskid
  req.body.comment
  res.json({"status":"OK"})
});

module.exports = router
