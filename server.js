var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://54.169.159.201:27017/user", function (err, db) {
    
    db.collection('users', function (err, collection) {
        
         collection.find().toArray(function(err, items) {
            if(err) throw err;    
            console.log(items);            
        });
        
    });
                
});