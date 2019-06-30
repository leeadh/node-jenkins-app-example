
const mongoClient = require('mongodb').MongoClient;
const mongoDbUrl = process.env.MONGODB_URL;
//console.log(process.env.MONGODB_URL)
let mongodb;

let RECONNECT_INTERVAL = 3000
function connect(callback){
<<<<<<< HEAD
    mongoClient.connect(mongoDbUrl, (err, db) => {
        console.log("checking database")
        console.log(err)
        console.log(db)
        mongodb = db;
        callback();
    });
=======
      mongoClient.connect(mongoDbUrl, (err, db) => {
        if (err) {
          console.log("attempting to reconnect to " + mongoDbUrl)
          setTimeout(connect.bind(this, callback), RECONNECT_INTERVAL)
          return
        } else {
          mongodb = db;
          callback();
        }
      });
>>>>>>> development
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