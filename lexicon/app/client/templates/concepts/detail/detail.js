var getConcept = function (slug) {
    var concept = ConceptDetail.findOne({slug: slug});
    if (concept) {
        return concept;
    }
};

/*****************************************************************************/
/* Detail: Event Handlers */
/*****************************************************************************/
Template.ConceptDetail.events({
});

/*****************************************************************************/
/* Detail: Helpers */
/*****************************************************************************/
Template.ConceptDetail.helpers({
    concept: function () {
        return getConcept(Router.current().params.slug);
    }
});

/*****************************************************************************/
/* Detail: Lifecycle Hooks */
/*****************************************************************************/
Template.ConceptDetail.created = function () {
};

Template.ConceptDetail.rendered = function () {
    var concept = getConcept(Router.current().params.slug);
    if (!concept) return;
    Meteor.call('trackEvent', 'VIEW', 'Concept', concept);
};

Template.ConceptDetail.destroyed = function () {
};
