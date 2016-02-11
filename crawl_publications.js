var Promise = require('bluebird'),
    fs = require('extfs'),
    _ = require('lodash'),
    utils = require('./utils'),
    path = require('path'),
    file_dir = 'data/publications/';


var Xray = require('x-ray');
var x = Xray().throttle(1, 5000);

fs.removeSync(file_dir);
fs.mkdirSync(file_dir);

var fetchPublication = function (url) {
    var slug = utils.slugFromUrl(url),
        fileName = file_dir + slug + '.json';
    fs.exists(fileName, function (exists) {
        if (exists) return;
        console.log('fetching', slug, url);
        x(url, {
            title: '.wrapper article h1',
            content: ['.wrapper article > p@html'],
            links: x('.wrapper article li', [{
                title: 'a',
                url: 'a@href'
            }])
        }).write(fileName);
        console.log('fetched', slug, url);
    });
};

var getUrlsFromConcepts = function (obj) {
    console.log(obj.title);
    if (!utils.hasProperty(obj, 'articles')) return [];
    var urls = [];
    obj.articles.forEach(function (article) {
        if (utils.hasProperty(article, 'url')) {
            urls.push(article.url);
        }
        if (utils.hasProperty(article, 'content')) {
            x(utils.wrapContent(article.content), ['a@href'])(function (err, links) {
                links.forEach(function (link) {
                    if (link.indexOf('ayn-rand-works') !== -1) {
                        urls.push(link);
                    }
                });
            });
        }
    });
    return urls;
};

var getUrlsFromPublications = function (obj) {
    if (!utils.hasProperty(obj, 'content')) return [];
    var urls = [], content = obj.content.join('');
    x(utils.wrapContent(obj.content), ['a@href'])(function (err, links) {
        links.forEach(function (link) {
            if (link.indexOf('ayn-rand-works') !== -1) {
                urls.push(link);
            }
        });
    });
    return urls;
};

var fPath = path.join(__dirname) + '/data/concepts/';
utils.loadFiles(fPath, '.json')
    .map(require)
    .map(getUrlsFromConcepts)
    .filter(_.isArray)
    .then(_.flatten)
    .then(_.uniq)
    .filter(utils.verifyUrl)
    .mapSeries(fetchPublication)
    .then(function () {
        console.log('done fetching publications', arguments);
    })
    .catch(function () {
        console.log('catch', arguments)
    });

// var stream = utils.objectStream('concepts', '*')
//     .on('warn', utils.warn)
//     .on('error', utils.error)
//     .pipe(es.mapSync(utils.getJson))
//     .pipe(es.mapSync(getUrlsFromPublications))
//     .pipe(es.mapSync(fetchPublications))
//     .on('end', function () {
//         console.log('new stream');
//         stream = utils.objectStream('publications', '*')
//         .on('warn', utils.warn)
//         .on('error', utils.error)
//         .pipe(es.mapSync(utils.getJson))
//         .pipe(es.mapSync(getUrlsFromPublications))
//             .pipe(es.mapSync(fetchPublications))
//             .on('end', function () {
//                 console.log('done with second stream');
//             });
//     });

