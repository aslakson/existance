/*****************************************************************************/
/* List: Event Handlers */
/*****************************************************************************/
Template.ConceptList.events({
});

/*****************************************************************************/
/* List: Helpers */
/*****************************************************************************/
Template.ConceptList.helpers({
    concepts: function () {
        return Concepts.find();
    }
});

/*****************************************************************************/
/* List: Lifecycle Hooks */
/*****************************************************************************/
Template.ConceptList.created = function () {
};

Template.ConceptList.rendered = function () {
};

Template.ConceptList.destroyed = function () {
};
