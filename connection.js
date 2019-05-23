
const mongoClient = require('mongodb').MongoClient;
const mongoDbUrl = process.env.MONGODB_URL;
//console.log(process.env.MONGODB_URL)
let mongodb;

let RECONNECT_INTERVAL = 3000
function connect(callback){
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