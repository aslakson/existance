var es = require('event-stream'),
    fs = require('fs'),
    request = require('request'),
    mongoose = require('mongoose'),
    Publication = require('./publication.js'),
    _ = require('underscore.string'),
    utils = require('./utils.js');

var host = 'localhost',
    port = '27017',
    dbname = 'meteor',
    connection = mongoose.connect('mongodb://'+host+':'+port+'/'+ dbname);

Publication.remove({}, function () {
    console.log('removed all publications');
});

var createPublication = function (obj, callback) {
    var publication = new Publication(obj);
    // console.log(concept);
    publication.save(function (err, obj) {
        if (err) console.error(err);
        callback(null, obj);
    });
};

var getImages = function (obj) {
    if (utils.hasProperty(obj, 'articles')) {
        obj.articles.forEach(function (article, idx) {
            if (utils.hasProperty(article, 'img')) {
                var imgSrc = article.img,
                    imgName = imgSrc.split('/').pop(),
                    imgPath = './data/images/' + imgName;
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
var conceptRe = /(http:\/\/aynrandlexicon\.com)\/(lexicon)\/(.*)(\.html)/ig;
var publicationRe = /(http:\/\/aynrandlexicon\.com)\/(publication)\/(.*)(\.html)/ig;

var rewriteUrls = function (obj) {
    obj.links.forEach(function (link) {
        link.url = link.url.replace(conceptRe, '/concept/$3');
        link.url = link.url.replace(publicationRe, '/publication/$3');
    });
    return obj;
};

var verifyExternalUrls = function (obj) {
    var verifiedUrls = [], self = this, checkCount = 0;
    if (!utils.hasProperty(obj, 'links')) {
        return;
    }
    this.pause();
    console.log('links count', obj.links.length);
    var sI = setInterval(function () {
        console.log(checkCount);
        obj.links.forEach(function (link, idx, list) {
            if (!utils.hasProperty(link, 'url')) return;
            request({url: link.url, timeout: 2000}, function (err, resp) {
                if (!err && resp.statusCode === 200) {
                    verifiedUrls.push(link);
                }
                checkCount++;
                if (checkCount === obj.links.length) {
                    clearInterval(sI);
                    console.log('done', verifiedUrls);
                    obj.links = verifiedUrls;
                    self.emit('data', obj);
                    self.resume();
                }
            });
        });
    }, 5000);
};

var processObj = function (obj, callback) {
    if (!utils.hasProperty(obj, 'content')) {
        callback();
    }
    obj.slug = _.slugify(obj.title);
    // remove empty articles
    console.log(obj.slug);
    obj.content = ['<p>', obj.content.join('</p><p>'), '</p>'].join('');
    callback(null, obj);
};

var stream = utils.objectStream('publications', '*')
    .on('warn', utils.warn)
    .on('error', utils.error)
    .pipe(es.mapSync(utils.getJson))
    .pipe(es.through(verifyExternalUrls))
    .pipe(es.mapSync(rewriteUrls))
    .pipe(es.map(processObj))
    // .pipe(es.mapSync(getImages))
    .pipe(es.map(createPublication))
    .on('end', function () {
        console.log('done!');
    });