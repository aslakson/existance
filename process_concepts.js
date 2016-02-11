var path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    Concept = require('./concept.js'),
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


Concept.remove({}, function () {
    console.log('removed all concepts');
});

var createConcept = function (obj) {
    return new Promise(function (resolve, reject) {
        var concept = new Concept(obj);
        console.log('creating', obj.slug);
        concept.save(function (err, obj) {
            if (err) reject();
            resolve(concept);
        });
    });
};

var retrieveImages = function (obj) {
    console.log('retreive images for: ', obj.slug);
    return new Promise(function (resolve, reject) {
        var getThese = [];
        if (utils.hasProperty(obj, 'articles')) {
            obj.articles.forEach(function (article, idx) {
                if (utils.hasProperty(article, 'img')) {
                    var imgSrc = article.img,
                        imgName = imgSrc.split('/').pop(),
                        imgPath = dataImagePath + imgName;
                    fs.exists(imgPath, function (exists) {
                        if (exists) return;
                        getThese.push(utils.download(imgSrc, imgPath))
                    });
                }
            });
        }
        x(utils.wrapContent(obj.acknowledgement), ['img@src'])(function (err, imgs) {
            imgs.forEach(function (img) {
                var imgName = img.split('/').pop(),
                    imgPath = dataImagePath + imgName;
                fs.exists(imgPath, function (exists) {
                    if (exists) return;
                    getThese.push(utils.download(imgSrc, imgPath))
                });
            });
        });
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
    console.log('rewrite urls for: ', obj.slug);
    if (utils.hasProperty(obj, 'articles')) {
        obj.articles.forEach(function (article, idx) {
            if (utils.hasProperty(article, 'img')) {
                var imgName = article.img.split('/').pop();
                article.img = '/public/images/' + imgName;
            }
        });
    }
    if (utils.hasProperty(obj, 'acknowledgement')) {
        obj.acknowledgement = utils.rewriteURLs(obj.acknowledgement);
    }
    return obj;
};

var processObj = function (obj) {
    obj.slug = _S.slugify(obj.title);
    console.log('processing: ', obj.slug)
    // remove empty articles
    obj.articles = obj.articles.filter(function (article) {
        return article.content !== null;
    });
    obj.articles.forEach(function (article, idx) {
        article.content = article.content.replace('\n', '');
        if (article.attribution)
            article.attribution = article.attribution.replace(/^[\n]+/gi, '').replace('\n', '<br>');
        if (utils.hasProperty(article, 'url')) {
            article.publication_slug = utils.slugFromUrl(article.url);
            delete article.url;
        }
    });
    return obj;
};


var fPath = path.join(__dirname) + '/data/concepts/';
utils.loadFiles(fPath, '.json')
    .map(require)
    .map(Promise.method(processObj))
    .mapSeries(retrieveImages)
    .map(Promise.method(rewriteURLs))
    .mapSeries(createConcept)
    .then(utils.copyRetrievedImages)
    .then(function () {
        console.log('done');
    })

// var stream = readdirp({
//     root: path.join(__dirname) + '/data/concepts/',
//     fileFilter: '*.json'
// })
// .on('warn', utils.warn)
// .on('error', utils.error)
// .pipe(es.mapSync(function (data, callback) {
//     // parse files as JS objects
//     return require(data.fullPath);
// }))
// .pipe(es.mapSync(processObj))
// .pipe(es.mapSync(retrieveImages))
// .pipe(es.mapSync(rewriteImageUrls))
// .pipe(es.mapSync(createConcept))
// .on('end', function () {
//     copyRetrievedImages()
// });