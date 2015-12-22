var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;

var url = 'mongodb://localhost:27017/lexicon';

MongoClient.connect('url', function () {
    if (err) {
        console.log('unable to connect to the mongoDB server. Error:', err);
    } else{
        var collection = db.colection('users');
        // USING INSERT
        collection.insert([user1, user2, user3], function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log('inserted %d documents into the "users" collection', result.length);
            }
        })
        // USING UPDATE
        collection.update({name: 'some name'}, {$set: {enabled: false}}, function (err, numUpdated) {
            if (err) {
                console.log(err);
            } else if (numUpdated) {
                console.log('successfully updated %d document(s).', numUpdated);
            }            
        })
        // USING FIND
        collection.find({name: 'some name'}).toArray(function (err, result) {
            if (err) {
                console.log(err);
            } else if (result.length) {
                console.log('Found:', result);
            } else {
                console.log('No documents found');
            }
        })
        // USING CURSOR
        var cursor = collection.find({name: 'some name'});

        cursor.sort({age: -1});
        cursor.limit(10);
        cursor.skip(5);
        cursor.each(function (err, doc){
            if (err) {
                console.log(err);
            } else {
                console.log('Fetched', doc);
            }
        });
        db.close();
    }
});