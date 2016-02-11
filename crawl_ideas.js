var Promise = require('bluebird'),
    fs = require('extfs'),
    _ = require('lodash'),
    utils = require('./utils'),
    path = require('path'),
    file_dir = 'data/ideas/';


var Xray = require('x-ray');
var x = Xray().throttle(1, 5000);

fs.removeSync(file_dir);
fs.mkdirSync(file_dir);

var fetchIdea = function (url) {
    var slug = utils.slugFromUrl(url),
        fileName = file_dir + slug + '.json';
    console.log('fetching', slug);
    fs.exists(fileName, function (exists) {
        if (exists) return;
        console.log('fetching', slug);
        x(url, {
            title: '.wrapper article h1',
            by: '.wrapper article h2',
            content: ['.wrapper article > p@html']
        }).write(fileName);
    });
};

var ideaContentMap = {
    title: '.wrapper article h1',
    by: '.wrapper article h2',
    content: ['.wrapper article > p@html']
}

var getUrlsFromPublications = function (obj, callback) {
    var urls = [];
    if (!utils.hasProperty(obj, 'content')) return urls;
    x(utils.wrapContent(obj.content), ['a@href'])(function (err, links) {
        links.forEach(function (link) {
            if (link.indexOf('ayn-rand-ideas') !== -1) {
                urls.push(link);
            }
        });
    });
    return urls;
};

var fPath = path.join(__dirname) + '/data/publications/';
utils.loadFiles(fPath, '.json')
    .map(require)
    .map(getUrlsFromPublications)
    .filter(_.isArray)
    .then(_.flatten)
    .then(_.uniq)
    .filter(utils.verifyUrl)
    .mapSeries(fetchIdea)
    .then(function () {
        console.log('done');
    })
    .catch(function () {
        console.log('catch', arguments)
    });



