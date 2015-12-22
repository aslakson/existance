Template.MasterLayout.helpers({
    search_data: function () {
        var concepts = Concepts.find().fetch().map(function (c) {
            var id = 'concepts|'+c.slug;
          return {id: id, title: c.title};
        });
        var publications = Publications.find().fetch().map(function (c) {
            var id = 'publications|'+c.slug;
          return {id: id, title: c.title};
        });
        var categories = Categories.find().fetch().map(function (c) {
            var id = 'categories|'+c.title;
          return {id: id, title: c.title};
        });
        var data = [{
            name: 'concepts',
            valueKey: 'title',
            local: concepts,
            header: '<div class="tt-group">Concepts</div>',
            template: 'SearchItem'
        }, {
            name: 'publications',
            valueKey: 'title',
            local: publications,
            header: '<div class="tt-group">Publications</div>',
            template: 'SearchItem'
        }, {
            name: 'categories',
            valueKey: 'title',
            local: categories,
            header: '<div class="tt-group">Categories</div>',
            template: 'SearchItem'
        }];
        console.log(data)
        return data;
    },
    selected: function (ev, obj) {
        console.log('selected helper', arguments);
        var bits = obj.id.split('|'),
            controller = bits[0],
            slug = bits[1];
        Router.go(controller + '.detail', {slug: slug});
    }
});