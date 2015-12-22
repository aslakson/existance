/*****************************************************************************/
/* List: Event Handlers */
/*****************************************************************************/
Template.PublicationsList.events({
});

/*****************************************************************************/
/* List: Helpers */
/*****************************************************************************/
Template.PublicationsList.helpers({
    publications: function () {
        return Publications.find({}, {fields: {title: 1, slug: 1}});
    }
});

/*****************************************************************************/
/* List: Lifecycle Hooks */
/*****************************************************************************/
Template.PublicationsList.created = function () {
};

Template.PublicationsList.rendered = function () {
};

Template.PublicationsList.destroyed = function () {
};
