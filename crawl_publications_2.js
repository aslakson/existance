var Promise = require('bluebird'),
    fs = require('extfs'),
    _ = require('lodash'),
    utils = require('./utils'),
    path = require('path'),
    file_dir = 'data/publications/';


var Xray = require('x-ray');
var x = Xray().throttle(1, 5000);

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
var fPath = path.join(__dirname) + '/data/publications/';
utils.loadFiles(fPath, '.json')
    .map(require)
    .map(getUrlsFromPublications)
    .filter(_.isArray)
    .then(_.flatten)
    .then(_.uniq)
    .filter(utils.verifyUrl)
    .mapSeries(fetchPublication)
    .catch(function () {
        console.log('catch', arguments)
    });