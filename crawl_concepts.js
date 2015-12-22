var _ = require('underscore.string');
var Xray = require('x-ray');
var x = Xray();

// from the index, find links to each term
x('http://aynrandlexicon.com/lexicon/', {
    items: x('.index li', [{
        term: 'a',
        url: 'a@href'
    }])
})(function(err, arr) {
  var d = arr.items,
      i = 0;
  // at intervals, crawl the links
  var sI = setInterval(function () {
        var url = d[i].url,
            term = d[i].term,
            slug = _.slugify(term);
        // each url has multiple articles which each
        // contain text, links, img and attributes
        console.log('fetching', url);
        x(url, {
            title: 'article h1',
            // url: url,
            articles: x('.wrapper section', [{
              content: 'p@html',
              url: 'footer a@href',
              title: 'footer a',
              img: 'footer img@src',
              attribution: 'footer',
            }]),
            acknowledgement: '.wrapper footer@html',
            links: x('.links', [{
              url: 'a@href',
              title: 'a'
            }])
          }).write('data/concepts/' + slug + '.json');
    i++;
    if (i === d.length) {
        clearInterval(sI);
    }
  }, 1500);
});