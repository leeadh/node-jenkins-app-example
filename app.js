
var bodyParser = require('body-parser')
, MongoClient = require('mongodb').MongoClient
, PORT = 4000
, instantMongoCrud = require('express-mongo-crud') // require the module
, express = require('express')
, app = express()
, path = require('path')
, options = { //specify options
    host: `localhost:${PORT}`
}
, db = require('./connection')


// connection to database
db.connect(() => {

    app.use(bodyParser.json()); // add body parser
    app.use(bodyParser.urlencoded({ extended: true }));
    //console.log('Hello ' + process.env.MONGODB_URL)
    
    // get function 
    app.get('/', function(req, res) {
        db.get().collection('users').find({}).toArray(function(err, data){
            if (err)
                console.log(err)
            else
                res.render('../views/pages/index.ejs',{data:data});
        });
    });
    
    // post functions
    app.post('/addUser', function(req, res) {
        var name=req.body.name
        var email=req.body.email
        var occupation=req.body.occupation
        var username=req.body.username

        console.log(name)
        console.log(email)

        db.get().collection('users').count({email : email}, function(err, result){
            console.log(result)
            if (result){
                console.log("user exists")
                res.send("user exists")
            }else{
                db.get().collection('users').save({name:name, email:email, occupation:occupation, username:username}, {w:1},function (err, result) {
                    if (err){
                        console.log("error")
                    } else{
                        console.log("success")
                        res.send("successful")
                    }        
                });
            }

        });


    });

    // update user
    app.post('/updateUser', function(req, res) {
        var name=req.body.name
        var email=req.body.email
        var occupation=req.body.occupation
        var username=req.body.username
        console.log("test")
        console.log(req.body)
        console.log("end test")
        db.get().collection('users').update({ email: email },{name :name, username:username, occupation:occupation, email:email},function(err,result){
            if (err){
                console.log("error")
            }else{
                console.log("successfully updated user")
                res.send ("successful")

            }
            

        });


    });

    // delete user
    app.post('/deleteUser', function(req, res) {
        var email=req.body.email
        console.log(email)
        db.get().collection('users').deleteOne({email: email}, function(err,result){
            if (err){
                console.log("error")
            }else{
                console.log("successfully deleted user")
                res.send ("successfully deleted user")

            }

        });

    });

    app.listen(PORT, ()=>{
        console.log('started');
        console.log(db)
    })

    app.use(instantMongoCrud(options)); // use for the instant Mongo CRUD 
    app.use(express.static(__dirname));
});


