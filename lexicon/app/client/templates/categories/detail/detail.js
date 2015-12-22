var getCategory = function (slug) {
    var category = Categories.findOne({slug: slug});
    if (category) {
        return category;
    }
};

/*****************************************************************************/
/* Detail: Event Handlers */
/*****************************************************************************/
Template.CategoryDetail.events({
});

/*****************************************************************************/
/* Detail: Helpers */
/*****************************************************************************/
Template.CategoryDetail.helpers({
    category: function () {
        var category = getCategory(Router.current().params.slug);
        if (category) {
            return category;
        }
    },
    concepts: function () {
        var concepts = Concepts.find({category: Router.current().params.slug});
        
        console.log('gettingconcepts', concepts.fetch());
        return concepts;
    }
});

/*****************************************************************************/
/* Detail: Lifecycle Hooks */
/*****************************************************************************/
Template.CategoryDetail.created = function () {
};

Template.CategoryDetail.rendered = function () {
    var category = getCategory(Router.current().params.slug);
    if (!category) return;
    Meteor.call('trackEvent', 'VIEW', 'Category', category);
};

Template.CategoryDetail.destroyed = function () {
};
