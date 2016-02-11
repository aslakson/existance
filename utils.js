var readdirp = require('readdirp'),
    request = require('request'),
    fs = require('fs'),
    path = require('path'),
    urlparse = require('url'),
    _ = require('lodash'),
    cp = require('node-cp'),
    Promise = require('bluebird');

var conceptRe = /(http:\/\/aynrandlexicon\.com)\/(lexicon)\/(.*)(\.html)/ig;
var ideasRe = /(http:\/\/aynrandlexicon\.com)\/(ayn-rand-ideas)\/(.*)(\.html)/ig;
var publicationRe = /(http:\/\/aynrandlexicon\.com)\/(ayn-rand-works)\/(.*)(\.html)/ig;
var imgRe = /(src=")([^"]+)(")/ig;

var dataImagePath = './data/images/';
var meteorImagePath = './lexicon/app/public/images/';

var exp = {
    rewriteURLs: function (value) {
        value = value.replace(conceptRe, '/concepts/$3')
            .replace(publicationRe, '/publications/$3')
            .replace(publicationRe, '/ideas/$3');
        var matches = value.match(imgRe)
        if (!matches) return value;
        matches.forEach(function (m){
            value = value.replace(m, 'src="/images/'+m.split('/').pop())
        });
        return value
    },
    rewriteImgs: function (value) {
        return value.replace()
    },
    rewriteObjPropertyURLs: function (obj, property) {
        if (utils.hasProperty(obj, property)) {
            obj.property = utils.rewriteUrls(obj[property]);
        }
        return obj;
    },
    slugFromUrl: function (url) {
        var parsedUrl = urlparse.parse(url);
        return parsedUrl.path.split('/').pop().replace('.html', '');
    },
    download: function(uri, filename){
      return new Promise(function (resolve, reject) {
          request.head(uri, function(err, res, body){
            var writeStream = fs.createWriteStream(filename);
            var readStream = request(uri);
            readStream.pipe(writeStream).on('close', function () {
                console.log('resolving ', uri);
                resolve();
            });
          });
      });
    },
    warn: function (err) {
        console.warn('warning', err);
    },
    error: function () {
        console.error('error', err);
    },
    wrapContent: function (content) {
        return ['<body>', content, '</body>'].join('');
    },
    hasProperty: function (obj, prop) {
        return obj.hasOwnProperty(prop) && obj[prop] && obj[prop].length;
    },
    loadFiles: function (fPath, ext) {
        return new Promise(function (resolve, reject) {
            fs.readdir(fPath, function (err, files) {
                if (err) reject();

                var files = files.map(function (file) {
                    return path.join(fPath, file);
                }).filter(function (file) {
                    return fs.statSync(file).isFile() && path.extname(file) === ext;
                });
                resolve(files);
            });
        })
    },
    copyRetrievedImages: function () {
        console.log('copying images');
        return new Promise(function (resolve, reject) {
            cp(dataImagePath, meteorImagePath, function (err) {
                if (err) reject();
                resolve();
            });
        });
    },
    verifyUrl: function (url) {
        console.log('verify-1', url);
        return new Promise(function (resolve, reject) {
            request({url: url, timeout: 2000}, function (err, resp) {
                console.log('verify-2', url, err);
                if (!err && resp.statusCode === 200) {
                    console.log('resolving');
                    resolve(true);
                } else {
                    console.log('rejecting');
                    resolve(false);
                }
            });
        });
    }
};

module.exports = exp;