var readdirp = require('readdirp'),
    request = require('request'),
    fs = require('fs'),
    path = require('path'),
    urlparse = require('url'),
    _ = require('underscore.string');

var exp = {
    slug_from_url: function (url) {
        var parsedUrl = urlparse.parse(url);
        return parsedUrl.path.split('/').pop().replace('.html', '');
    },

    download: function(uri, filename, callback){
      request.head(uri, function(err, res, body){
        var writeStream = fs.createWriteStream(filename);
        var readStream = request(uri);
        readStream.pipe(writeStream).on('close', callback);
      });
    },

    hasProperty: function (obj, prop) {
        return obj.hasOwnProperty(prop) && obj[prop].length;
    },
    warn: function (err) {
        console.log('non-fatal error', err);
    },
    error: function (err) {
        console.error('fatal error', err);
    },
    objectStream: function (dirName, docName) {
        return readdirp({
            root: path.join(__dirname) + '/data/'+dirName+'/',
            fileFilter: docName + '.json'
        });
    },
    getJson: function (data, callback) {
        return require(data.fullPath);
    }
};

module.exports = exp;