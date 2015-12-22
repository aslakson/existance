var _ = require('underscore.string'),
    Xray = require('x-ray'),
    request = require('request'),
    x = Xray(),
    url = 'http://aynrandlexicon.com/book/conceptual.html',
    mongoose = require('mongoose'),
    Category = require('./category.js'),
    Concept = require('./concept.js');
    // Category = require('./category.js');
mongoose.set('debug', true);


// Category.remove({}, function () {
//     console.log('removed all categories');
// });

var host = 'localhost',
    port = '27017',
    dbname = 'meteor',
    connection = mongoose.connect('mongodb://'+host+':'+port+'/'+ dbname);

Concept.findOne({title: 'Motion'}, function () {
  console.log(arguments);
});

request(url, function (err, response) {
  // from the index, find links to each term
  if (err) console.error(err);
  var html = response.body;
  x(html, {
      items: x('.conceptual', {
          title: ['#philosophy a'],
          definition: ['#philosophy li'],
      })
  })(function(err, arr) {
    var d = arr.items,
        i = 0;
    // console.log(arr.items);
    arr.items.title.forEach(function (item, idx) {
        var category = new Category({
            title: _.capitalize(item),
            slug: _.slugify(item),
            definition: arr.items.definition[idx].replace(item + ' (', '').replace(')', '')
        }).save();

        var title = item,
            slug = _.slugify(title),
            context = '#' + slug;
        console.log('##########', slug, '############');
        x(html, context, ['a'])(function (e, list) {
            // console.log(list);
            Concept.update({'title': {$in: list}}, {'category': title}, {multi: true}, function (err, doc) {
              console.log(err, doc);
            });
        });
    });
    // mongoose.connection.close();
  }); 
});

// categories = Category.find().stream();
// categories.on('data', function (category) {
//     category.slug = _.slugify(category.title);
//     console.log(category.slug);
//     category.save();
// }).on('error', function () {
//   console.log('error')
// }).on('close', function () {
//   console.log('done')
// });