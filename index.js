const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const moment = require('moment');
const path = require('path');
const port = 3000;

app.use(express.static(path.join(__dirname, 'routes')));

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'PizzaBase'
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log('Connected!');
  });                

app.listen(port, () => console.log(`Application listening on port ${port}!`))

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get('/', function(req,res){
  res.sendFile(__dirname+'/routes/index.html');
});

app.post('/', urlencodedParser, function (req, res){ //post = secure('SENSITIVE DATA NOT SHOWN IN URL')
  var lastname = req.body.lastname;
  var firstname = req.body.firstname;
  var phonenumber = req.body.phonenumber;
  var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
  var sql = 'INSERT INTO customers(lastname,firstname,phone,dateoforder) VALUES ?'
  var values = [
    [lastname, firstname, phonenumber, mysqlTimestamp]
  ];
  
  con.query(sql,[values],(err) => {
    if (!err) 
      console.log('CUSTOMER SUBMITTED!');
      res.redirect('/order');
    if (err)
      console.log(err);
  })
});

app.get('/order', function(req,res) {
  res.sendFile(__dirname+'/routes/order.html');
});

app.post('/order', urlencodedParser, function(req,res){
  var size = req.body.size;
  var topping1 = req.body.topping1;
  var topping2 = req.body.topping2;
  var topping3 = req.body.topping3;
  var sql = 'INSERT INTO orders(size,topping1,topping2,topping3) VALUES ?';
  var values = [
    [size,topping1,topping2,topping3]
  ];

  con.query(sql,[values],(err) => {
    if (!err)
      console.log('ORDER SUBMITTED!');
      res.redirect('/billing');
    if (err)
      console.log(err);
  })
});

app.get('/billing', function(req,res) {
  res.sendFile(__dirname+'/routes/billing.html');
});

app.post('/billing', urlencodedParser, function(req,res){
  var address = req.body.address;
  var address2 = req.body.address2;
  var city = req.body.city;
  var state = req.body.state;
  var postal = req.body.postal;
  var credit = req.body.credit;
  var sql = 'INSERT INTO billing(address, address2, city, state, postal, credit) VALUES ?';
  var values = [
    [address, address2, city, state, postal, credit]
  ];

  con.query(sql,[values],(err) => {
    if (!err)
      console.log('Billing SUBMITTED!');
      res.redirect('/success');
    if (err)
      console.log(err);
  })
});

app.get('/success', function(req,res){
  res.sendFile(__dirname+'/routes/success.html');
});

app.get('/getcustomers', (req, res) => { 
  con.query('SELECT * FROM customers',(err,rows,fields) => {
      if (!err)
          res.send(rows);
      else
          console.log(err);
  })
});

app.get('/getorders', (req, res) => { 
  con.query('SELECT * FROM orders',(err,rows,fields) => {
      if (!err)
          res.send(rows);
      else
          console.log(err);
  })
});

app.get('/getbilling', (req, res) => { 
  con.query('SELECT * FROM billing',(err,rows,fields) => {
      if (!err)
          res.send(rows);
      else
          console.log(err);
  })
});