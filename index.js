//using express,create server


//1.import express
const express = require('express')

//import data service
const dataService = require('./services/data.services')

//import cors
const cors = require('cors')


//import jsonwebtoken
const jwt = require('jsonwebtoken')

//2.create an server app using express
const app = express()

//using cors define origin to server app
app.use(cors({
  origin: ['http://localhost:4200']
}))


//to parse json data
app.use(express.json())

//3.set up port for server app
app.listen(3000, () => {
  console.log('Server started at port 3000');
})

//application specific middleware
const appMiddleware = (req, res, next) => {
  console.log('This is Application specific middleware');
  next()
}
app.use(appMiddleware)


//router specific middleware
const jwtMiddleware = (req, res, next) => {
  console.log('Inside router specific middleware');
  //get token from request headers x-access-token key
  let token = req.headers['x-access-token']
  //verify token using jsonwebtoken
  try {
    let data = jwt.verify(token, 'supersecretkey123')
    console.log(data);
    req.currentAcno = data.currentAcno
    next()
  }
  catch {
    res.status(404).json({
      status: false,
      message: "Token Authentication failed...Please log in.."
    })

  }
}


//http request
//app.get('/', (req, res) => {
//res.send("GET METHOD")
//})

//app.post('/', (req, res) => {
//res.send("POST METHOD")
//})

//app.patch('/', (req, res) => {
//res.send("PATCH METHOD")
//})

//app.put('/', (req, res) => {
//res.send("PUT METHOD")
// })

//app.delete('/', (req, res) => {
//res.send("DELETE METHOD")
// }) 
//---------------------------------



//http request-REST API-Bank API

//1. LOGIN API
app.post('/login', (req, res) => {
  console.log('inside login function');
  console.log(req.body);
  //asynchronous
  dataService.login(req.body.accno, req.body.psswd)
    .then((result) => {
      res.status(result.statusCode).json(result)
    });
});

//2. REGISTER API
app.post('/register', (req, res) => {
  console.log('inside register function');
  console.log(req.body);
  //asynchronous
  dataService.register(req.body.accno, req.body.psswd, req.body.uname)
    .then((result) => {
      res.status(result.statusCode).json(result)
    });
});


//3.DEPOSIT API
app.post('/deposit', jwtMiddleware, (req, res) => {
  console.log('inside deposit function');
  console.log(req.body);
  //asynchronous
  dataService.deposit(req, req.body.accno, req.body.psswd, req.body.amount)
    .then((result) => {
      res.status(result.statusCode).json(result)
    });
});



//4. WITHDRAW API
app.post('/withdraw', jwtMiddleware, (req, res) => {
  console.log('inside withdraw function');
  console.log(req.body);
  //asynchronous
  dataService.withdraw(req, req.body.accno, req.body.psswd, req.body.amount)
    .then((result) => {
      res.status(result.statusCode).json(result)
    });
});


//5. GETBALANCE API
app.post('/getBalance', jwtMiddleware, (req, res) => {
  console.log('inside getBalance function');
  console.log(req.body);
  //asynchronous
  dataService.getBalance(req.body.accno)
    .then((result) => {
      res.status(result.statusCode).json(result)
    });
});

//6. GET TRANSACTION API
app.post('/getTransaction', jwtMiddleware, (req, res) => {
  console.log("inside getTransaction function");
  console.log(req.body);
  //asynchronous
  dataService.getTransaction(req.body.accno)
    .then((result) => {
      res.status(result.statusCode).json(result)
    });
});


//7. DELETE ACCOUNT API
app.delete('/deleteAccount/:accno', jwtMiddleware, (req, res) => {
  console.log("inside deleteAccount function");
  //asynchronous
  dataService.deleteAccount(req.params.accno)
    .then((result) => {
      res.status(result.statusCode).json(result)
    });
});