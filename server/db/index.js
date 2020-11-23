const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/database1')
const db = mongoose.connection
mongoose.Promise = require("bluebird")

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
        workerId: String,
        employerId: String,
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
        ownerId: String,
        authorId: String,
        text: String
})

const TransactionSchema = mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        fromId: String,
        toId: String,
        value: Number
})

const Models = {
  User: mongoose.model("User", UserSchema,"User"),
  Task: mongoose.model("Task", TaskSchema,"Task"),
  Comment: mongoose.model("Comment", CommentSchema,"Comment"),
  Transaction: mongoose.model("Transaction", TransactionSchema,"Transaction"),

}

module.exports = Models

