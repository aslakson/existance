Meteor.publish('popular', function () {
  var self = this,
      handle = Events.aggregate([
        {$match: {entity_type: 'Concept'}},
        {$group: {_id: {slug: '$entity_slug', title: '$entity_title'}, count: {$sum: 1}}},
        {$sort: {count: -1}},
        {$limit: 10}
      ]).forEach(function (c) {
          self.added('popular', c._id.slug, {
              slug: c._id.slug,
              title: c._id.title,
              count: c.count
          });
      });
    this.ready();
});

// Concepts
Meteor.publish('concepts', function (/* args */) {
  var data = Concepts.find({}, {fields: {title: 1, slug: 1, category: 1}, sort: {title: 1}});
  if (data) {
    return data;
  }
  this.ready();
});

Meteor.publishComposite('conceptDetail', function (slug) {
  return {
      collectionName: 'conceptDetail',
      find: function () {
          return Concepts.find({'slug': slug});
      },
      children: []
  };
});

// Publications
Meteor.publish('publications', function (/* args */) {
  return Publications.find({}, {fields: {title: 1, slug: 1}});
});


Meteor.publish('publication', function (slug) {
  check(slug, String);
  var data = Publications.find({'slug': slug});
  if (data) {
    return data;
  }
  this.ready();
});

// Categories
Meteor.publish('categories', function (/* args */) {
  return Categories.find({}, {fields: {title: 1, definition: 1, slug: 1}});
});