var getPublication = function (slug) {
    var pub = Publications.findOne({slug: slug});
    if (pub) {
        return pub;
    }
};

/*****************************************************************************/
/* Detail: Event Handlers */
/*****************************************************************************/
Template.PublicationDetail.events({
});

/*****************************************************************************/
/* Detail: Helpers */
/*****************************************************************************/
Template.PublicationDetail.helpers({
    publication: function () {
        publication = getPublication(Router.current().params.slug);

        if (publication) {
            return publication;
        }
    }
});

/*****************************************************************************/
/* Detail: Lifecycle Hooks */
/*****************************************************************************/
Template.PublicationDetail.created = function () {
};

Template.PublicationDetail.rendered = function () {
    var publication = getPublication(Router.current().params.slug);
    if (!publication) return;
    Meteor.call('trackEvent', 'VIEW', 'Publication', publication);
};

Template.PublicationDetail.destroyed = function () {
};
