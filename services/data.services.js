
//import Model Account
const db = require('./db')

//import jsonwebtoken
const jwt = require('jsonwebtoken')

//login function
const login = (accno, psswd) => {
  console.log('inside login function definition');
  //check accno and psswd is present in mongo db
  //asynchronous function-promise
  return db.Account.findOne({
    accno,
    password: psswd
  }).then((result) => {
    if (result) {
      //accno and psswd is present in db
      console.log('login successfull');

      //currentacno
      let currentAcno = accno


      //genrate token
      const token = jwt.sign({
        currentAcno: accno
      }, 'supersecretkey123')


      return {
        status: true,
        message: 'login successfull',
        username: result.username,
        statusCode: 200,
        token,
        currentAcno

      }
    }
    else {
      console.log('Invalid Account / Password');
      return {
        status: false,
        message: 'Invalid Account / Password',
        statusCode: 404
      }
    }
  })
}

//register
const register = (accno, psswd, uname) => {
  console.log('inside register function definition');
  //check accno and psswd is present in mongo db
  //asynchronous function-promise
  return db.Account.findOne({
    accno
  }).then((result) => {
    if (result) {
      //accno present in db
      console.log('already registered');
      return {
        status: false,
        message: 'Account already exist...Please Log In',
        statusCode: 404
      }
    }
    else {
      console.log('Register succesfull');
      let newAccount = new db.Account({
        accno,
        password: psswd,
        username: uname,
        balance: 0,
        transaction: []
      })
      newAccount.save()
      return {
        status: true,
        message: 'Register successful',
        statusCode: 202
      }
    }
  })
}

//deposit
const deposit = (req, accno, psswd, amount) => {
  console.log('inside deposit function definition');
  //convert string amount to number
  let amt = Number(amount)
  //check accno and psswd is present in mongo db
  //asynchronous function-promise
  return db.Account.findOne({
    accno,
    password: psswd
  }).then((result) => {
    if (result) {
      if (req.currentAcno != accno) {
        return {
          status: false,
          message: 'Operation denied..Allowed only own account transaction',
          statusCode: 404
        }
      }

      //accno and psswd is present in db
      result.balance += amt
      result.transaction.push({
        type: "CREDIT",
        amount: amt
      })
      result.save()
      return {
        status: true,
        message: `${amount} deposited successfully`,
        statusCode: 200
      }
    }
    else {
      console.log('Invalid Account / Password');
      return {
        status: false,
        message: 'Invalid Account / Password',
        statusCode: 404
      }
    }
  })
}



//withdraw
const withdraw = (req, accno, psswd, amount) => {
  console.log('inside withdraw function definition');
  //convert string amount to number
  let amt = Number(amount)
  //check accno and psswd is present in mongo db
  //asynchronous function-promise
  return db.Account.findOne({
    accno,
    password: psswd
  }).then((result) => {
    if (result) {

      //accno and psswd is present in db

      if (req.currentAcno != accno) {
        return {
          status: false,
          message: 'Operation denied..Allowed only own account transaction',
          statusCode: 404
        }
      }

      //check sufficient balance
      if (result.balance < amt) {
        //insufficient balance
        return {
          status: false,
          message: 'Transaction failed...Insufficient balance',
          statusCode: 404
        }
      }

      //perform withdraw
      result.balance -= amt
      result.transaction.push({
        type: "DEBIT",
        amount: amt
      })
      result.save()
      return {
        status: true,
        message: `${amount} Debited successfully`,
        statusCode: 200
      }
    }
    else {
      console.log('Invalid Account / Password');
      return {
        status: false,
        message: 'Invalid Account / Password',
        statusCode: 404
      }
    }
  })
}


//getBalance
const getBalance = (accno) => {
  //asynchronous function-promise
  return db.Account.findOne({
    accno
  }).then(
    (result) => {
      if (result) {
        //accno present db
        let balance = result.balance

        result.transaction.push({
          type: "BALANCE ENQUIRY",
          amount: 'NIL'
        })
        result.save()
        //send to client
        return {
          status: true,
          statusCode: 200,
          message: `Your Current Balance is ${balance}`
        }
      }
      else {
        //accno not present in db
        //send to client
        return {
          status: false,
          statusCode: 404,
          message: `Invalid Account Number`
        }
      }
    }
  )
}


//get Transaction
const getTransaction = (accno) => {
  //asynchronous function-promise
  return db.Account.findOne({
    accno
  }).then(
    (result) => {
      if (result) {
        //accno present db


        //send to client
        return {
          status: true,
          statusCode: 200,
          transaction: result.transaction
        }
      }
      else {
        //accno not present in db
        //send to client
        return {
          status: false,
          statusCode: 404,
          message: `Invalid Account Number`
        }
      }
    }
  )
}

//deleteAccount
const deleteAccount = (accno) => {
  //asynchronous function-promise
  return db.Account.deleteOne({
    accno
  }).then((result) => {
    if (result) {
      //send to client
      return {
        status: true,
        statusCode: 200,
        message: 'Account deleted succesfully'
      }
    }
    else {
      //accno not present in db
      //send to client
      return {
        status: false,
        statusCode: 404,
        message: `Invalid Account Number`
      }
    }
  })
}


//export
module.exports = {
  login,
  register,
  deposit,
  withdraw,
  getBalance,
  getTransaction,
  deleteAccount
}


