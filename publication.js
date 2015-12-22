var mongoose = require('mongoose');


var trimmedString = {
    type: String,
    trim: true
};

var publicationSchema = new mongoose.Schema({
    title: trimmedString,
    slug: trimmedString,
    content: trimmedString,
    links: [{
        title: String,
        url: String
    }]
});

module.exports = mongoose.model('Publication', publicationSchema);