var es = require('event-stream'),
    fs = require('extfs'),
    _ = require('underscore.string'),
    utils = require('./utils'),
    pub_dir = 'data/publications/';


var Xray = require('x-ray');
var x = Xray().throttle(1, 5000);

fs.removeSync(pub_dir);
fs.mkdirSync(pub_dir);

var fetchPublications = function (urls, callback) {
    if (!urls || !urls.length) return;
    var idx = 0;
    stream.pause();
    var sI = setInterval(function () {
        var url = urls[idx],
            slug = utils.slug_from_url(url),
            fileName = pub_dir + slug + '.json';

        fs.exists(fileName, function (exists) {
            if (exists) return;
            console.log('fetching', slug);
            x(url, {
                title: '.wrapper article h1',
                content: ['.wrapper article > p@html'],
                links: x('.wrapper article li', [{
                    title: 'a',
                    url: 'a@href'
                }])
            }).write(fileName);
        });
        idx++;
        if (idx === urls.length) {
            console.log('done', url);
            clearInterval(sI);
            stream.resume();
        }
    }, 200);
    return urls;
};

var getUrlsFromConcepts = function (obj) {
    if (!utils.hasProperty(obj, 'articles')) return;
    var urls = [];
    console.log('getting urls from concepts');
    obj.articles.forEach(function (article) {
        if (utils.hasProperty(article, 'url')) {
            urls.push(article.url);
        }
        if (utils.hasProperty('content')) {
            x(article.content, ['a@href'])(function (err, links) {
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
    if (!utils.hasProperty(obj, 'content')) return;
    console.log('getting urls from publications');
    obj.content.unshift('<body>');
    obj.content.push('</body>');
    var urls = [], content = obj.content.join('');
    x(obj.content.join(''), ['a@href'])(function (err, links) {
        links.forEach(function (link) {
            if (link.indexOf('ayn-rand-works') !== -1) {
                urls.push(link);
            }
        });
    });
    console.log('=======', urls, '=========');
    return urls;
};

var stream = utils.objectStream('concepts', '*')
    .on('warn', utils.warn)
    .on('error', utils.error)
    .pipe(es.mapSync(getJson))
    .pipe(es.mapSync(getUrlsFromConcepts))
    .pipe(es.mapSync(fetchPublications))
    .on('end', function () {
        console.log('new stream');
        stream = utils.objectStream('publications', '*')
        .on('warn', utils.warn)
        .on('error', utils.error)
        .pipe(es.mapSync(utils.getJson))
        .pipe(es.mapSync(getUrlsFromPublications))
            .pipe(es.mapSync(fetchPublications))
            .on('end', function () {
                console.log('done with second stream');
            });
    });

