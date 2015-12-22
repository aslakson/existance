var mongoose = require('mongoose');


var trimmedString = {
    type: String,
    trim: true
};

var categorySchema = new mongoose.Schema({
    title: trimmedString,
    slug: trimmedString,
    definition: trimmedString
});

module.exports = mongoose.model('Category', categorySchema);