const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/database1')
const db = mongoose.connection
mongoose.Promise = require("bluebird")
const init_users = require('../db/user.json')
const init_tasks = require('../db/task.json')
const init_comms = require('../db/comment.json')
const init_trans = require('../db/transaction.json')


db.on('error', function () {
  console.log('Connect error')
})
db.once('open', function () {
  console.log('Mongodb started successfully')
})


const UserSchema = mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        login: String,
        pass: String,
        fio: String,
        balance: Number
})

const TaskSchema = mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        workerLogin: String,
        employerLogin: String,
        currStatus: String,
        taskInfo: String,
        creationDate: Date,
        finishDate: Date,
        price: Number,
        applicantsList: [String],
        solutionLink: String,
        type: String
})

const CommentSchema = mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        ownerLogin: String,
        authorLogin: String,
        text: String
})

const TransactionSchema = mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        fromLogin: String,
        toLogin: String,
        value: Number
})

const Models = {
  User: mongoose.model("User", UserSchema,"User"),
  Task: mongoose.model("Task", TaskSchema,"Task"),
  Comment: mongoose.model("Comment", CommentSchema,"Comment"),
  Transaction: mongoose.model("Transaction", TransactionSchema,"Transaction"),

}

Models.User.deleteMany({},(err3,e) =>{
  Models.Task.deleteMany({},(err,q) =>{
    Models.Comment.deleteMany({},(err1,w) =>{
      Models.Transaction.deleteMany({},(err2,r) =>{
        Models.User.insertMany(init_users,(err,doc) =>{
          if(err) return console.log(err);
          Models.Task.insertMany(init_tasks,(err1,doc1) =>{
            if(err1) return console.log(err1);
            Models.Comment.insertMany(init_comms,(err2,doc2) =>{
              if(err2) return console.log(err2);
              Models.Transaction.insertMany(init_trans,(err3,doc3) =>{
                if(err3) return console.log(err3);
              })
            })
          })
        })
      })
    })
  })
})



module.exports = Models

