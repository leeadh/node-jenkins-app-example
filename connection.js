
const mongoClient = require('mongodb').MongoClient;
const mongoDbUrl = process.env.MONGODB_URL;
//console.log(process.env.MONGODB_URL)
let mongodb;

function connect(callback){
    mongoClient.connect(mongoDbUrl, (err, db) => {
        console.log("checking database")
        console.log(err)
        console.log(db)
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