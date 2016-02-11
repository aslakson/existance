var path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    Publication = require('./publication.js'),
    _ = require('lodash'),
    _S = require('underscore.string'),
    utils = require('./utils.js'),
    Promise = require('bluebird');

var host = 'localhost',
    port = '27017',
    dbname = 'meteor',
    connection = mongoose.connect('mongodb://'+host+':'+port+'/'+ dbname);

var dataImagePath = './data/images/';
var meteorImagePath = './lexicon/app/public/images/';
var Xray = require('x-ray');
var x = Xray().throttle(1, 5000);

Publication.remove({}, function () {
    console.log('removed all publications');
});

var createPublication = function (obj, callback) {
    return new Promise(function (resolve, reject) {
        var publication = new Publication(obj);
        publication.save(function (err, obj) {
            if (err) reject();
            resolve(publication);
        });
    });
};

var retrieveImages = function (obj) {
    console.log('retreive images for: ', obj.slug);
    return new Promise(function (resolve, reject) {
        var getThese = [];
        if (utils.hasProperty(obj, 'content')) {
            x(utils.wrapContent(obj.content), ['img@src'])(function (err, imgs) {
                imgs.forEach(function (img) {
                    var imgName = img.split('/').pop(),
                        imgPath = dataImagePath + imgName;
                    fs.exists(imgPath, function (exists) {
                        if (exists) return;
                        getThese.push(utils.download(img, imgPath))
                    });
                });
            });
        }
        if (getThese.length) {
            console.log(getThese.length, 'promises to wait for');
            return Promise.all(getThese, function () {
                resolve(obj);
            });
        } else {
            resolve(obj);
        }
    });
};

var rewriteURLs = function (obj) {
    obj.links.forEach(function (link) {
        link.url = utils.rewriteURLs(link.url);
    });
    if (utils.hasProperty(obj, 'content')) {
        obj.content = utils.rewriteURLs(obj.content)
    }
    return obj;
};

var processObj = function (obj, callback) {
    if (!utils.hasProperty(obj, 'content')) return obj;
    obj.slug = _S.slugify(obj.title);
    // remove empty articles
    console.log(obj.slug);
    obj.content = ['<p>', obj.content.join('</p><p>'), '</p>'].join('');
    return obj;
};


var fPath = path.join(__dirname) + '/data/publications/';
utils.loadFiles(fPath, '.json')
    .map(require)
    .map(Promise.method(processObj))
    .map(retrieveImages)
    .map(Promise.method(rewriteURLs))
    .map(createPublication, {concurrency: 3})
    .then(utils.copyRetrievedImages)
    .then(function () {
        console.log('done');
    })

// var stream = utils.objectStream('publications', '*')
//     .on('warn', utils.warn)
//     .on('error', utils.error)
//     .pipe(es.mapSync(utils.getJson))
//     .pipe(es.through(verifyUrls))
//     .pipe(es.mapSync(rewriteURLs))
//     .pipe(es.map(processObj))
//     // .pipe(es.mapSync(getImages))
//     .pipe(es.map(createPublication))
//     .on('end', function () {
//         console.log('done!');
//     });