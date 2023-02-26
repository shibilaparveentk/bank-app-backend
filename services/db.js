
//connection between server and mongo db
// 1.import mongoose
const mongoose = require('mongoose')

//2.define connection string and connect db with node
mongoose.connect('mongodb://localhost:27017/bank', () => {
  console.log('MongoDb connected successfully');
})

//3.create model
const Account = mongoose.model('Account', {
  accno: Number,
  password: String,
  username: String,
  balance: Number,
  transaction: []
})

//4. export model
module.exports = {
  Account
}