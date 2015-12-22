var mongoose = require('mongoose');

var trimmedString = {
    type: String,
    trim: true
};

var conceptSchema = new mongoose.Schema({
    title: trimmedString,
    slug: trimmedString,
    category: trimmedString,
    articles: [{
        publication_slug: trimmedString,
        content: trimmedString,
        img: trimmedString,
        url: trimmedString,
        attribution: trimmedString    
    }],
    acknowledgement: trimmedString,
    links: [{
        title: String,
        url: String
    }]
});

module.exports = mongoose.model('Concept', conceptSchema);