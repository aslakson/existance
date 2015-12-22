Template.registerHelper('concept_search', function () {
        console.log('concept_search helper');
        var list = Concepts.find().fetch().map(function (c) {
          return {id: c.slug, value: c.title};
        });
        return list;    
});