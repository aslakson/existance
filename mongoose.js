var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/lexicon');

var User = mongoose.model('User', {
    name: String,
    roles: Array,
    age: Number
});

var user1 = new User({
    name: 'Jason Aslakson',
    age: '37',
    roles: ['admin', 'moderator', 'user']
});

user1.name = user1.name.toUpperCase();

console.log(user1);

user1.save(function (err, userObj) {
    if (err) {
        console.log(err);
    } else {
        console.log('saved successfully', userObj);
    }
});

User.findOne({name: 'Jason Aslakson'}, function (err, userObj) {
    if (err) {
        console.log(err);
    } else if (userObj) {
        console.log('Found', userObj);

        if (userObj.age !== 30) {
            userObj.age += 30;

            userObj.save(function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Updated', userObj);
                }
            })
        }
    } else {
        console.log('User not found');
    }
});