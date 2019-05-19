//--> run this if u want to run docker compose 
//mongoose.connect('mongodb://localhost:27017/user'); 
// --> run this for normal docker
//mongoose.connect('mongodb://mongodb/user'); 

//const mongoDbUrl = 'mongodb://127.0.0.1:27017/user'; --> to test locally on laptop

/*
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/user', { useMongoClient: true },function () {
  console.log('mongodb connected')
})
module.exports = mongoose
*/

const mongoClient = require('mongodb').MongoClient;
const mongoDbUrl = process.env.MONGODB_URL;
//console.log(process.env.MONGODB_URL)
let mongodb;

function connect(callback){
    mongoClient.connect(mongoDbUrl, (err, db) => {
        mongodb = db;
        callback();
    });
}
function get(){
    return mongodb;
}

function close(){
    mongodb.close();
}

module.exports = {
    connect,
    get,
    close
};