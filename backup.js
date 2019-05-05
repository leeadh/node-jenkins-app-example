var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient
var db;

//Establish Connection
MongoClient.connect('mongodb://localhost:27017/user', function (err, database) {
   if (err) 
   	throw err
   else
   {
	db = database;
	console.log('Connected to MongoDB');
	//Start app only after connection is ready
	app.listen(3000);
   }
 });

app.use(bodyParser.json())

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/myfile.html'));
});

app.post('/addme', function(req, res) {
   // Insert JSON straight into MongoDB
  db.collection('users').insert({name:"johnniiieee", email:"jackson.com", occupation:"IT director", username:"jackson"}, function (err, result) {
      if (err)
         res.send('Error');
      else
        res.send('Success');

  });
});