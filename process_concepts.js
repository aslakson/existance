var readdirp = require('readdirp'),
    path = require('path'),
    fs = require('fs'),
    es = require('event-stream'),
    mongoose = require('mongoose'),
    Concept = require('./concept.js'),
    _ = require('underscore.string'),
    utils = require('./utils.js');

var host = 'localhost',
    port = '27017',
    dbname = 'meteor',
    connection = mongoose.connect('mongodb://'+host+':'+port+'/'+ dbname);

Concept.remove({}, function () {
    console.log('removed all concepts');
});

var createConcept = function (obj) {
    var concept = new Concept(obj);
    // console.log(concept);
    concept.save(function (err, obj) {
        if (err) console.error(err);
    });
    return concept;
};

var dataImagePath = './data/images/';
var meteorImagePath = './lexicon/app/public/images/'

var retrieveImages = function (obj) {
    if (utils.hasProperty(obj, 'articles')) {
        obj.articles.forEach(function (article, idx) {
            if (utils.hasProperty(article, 'img')) {
                var imgSrc = article.img,
                    imgName = imgSrc.split('/').pop(),
                    imgPath = dataImagePath + imgName;
                fs.exists(imgPath, function (exists) {
                    if (exists) return;
                    stream.pause();
                    utils.download(imgSrc, imgPath, stream.resume);
                });
            }
        });
    }
    return obj;
};

var copyRetrievedImages = function () {
    fs.cp(dataImagePath, meteorImagePath, function (err) {
        if (err) {
            return console.error(err);
        }
    });
};

var rewriteImageUrls = function (obj) {
    if (utils.hasProperty(obj, 'articles')) {
        obj.articles.forEach(function (article, idx) {
            if (utils.hasProperty(article, 'img')) {
                var imgName = article.img.split('/').pop();
                article.img = '/public/images/' + imgName;
            }
        });
    }
    return obj;
};

var processObj = function (obj) {
    obj.slug = _.slugify(obj.title);
    // remove empty articles
    obj.articles = obj.articles.filter(function (article) {
        return article.content !== null;
    });
    obj.articles.forEach(function (article, idx) {
        article.content = article.content.replace('\n', '');
        if (article.attribution)
            article.attribution = article.attribution.replace(/^[\n]+/gi, '').replace('\n', '<br>');
        if (utils.hasProperty(article, 'url')) {
            article.publication_slug = utils.slug_from_url(article.url);
        }
    });
    return obj;
};

var stream = readdirp({
    root: path.join(__dirname) + '/data/concepts/',
    fileFilter: '*.json'
})
.on('warn', utils.warn)
.on('error', utils.error)
.pipe(es.mapSync(function (data, callback) {
    // parse files as JS objects
    return require(data.fullPath);
}))
.pipe(es.mapSync(processObj))
.pipe(es.mapSync(retrieveImages))
.pipe(es.mapSync(rewriteImageUrls))
.pipe(es.mapSync(createConcept))
.on('end', function () {
    copyRetrievedImages()
});