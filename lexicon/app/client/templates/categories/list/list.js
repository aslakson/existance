/*****************************************************************************/
/* List: Event Handlers */
/*****************************************************************************/
Template.CategoryList.events({
});

/*****************************************************************************/
/* List: Helpers */
/*****************************************************************************/
Template.CategoryList.helpers({
    categories: function () {
        console.log(Categories.find().fetch())
        return Categories.find();
    }
});

/*****************************************************************************/
/* List: Lifecycle Hooks */
/*****************************************************************************/
Template.CategoryList.created = function () {
};

Template.CategoryList.rendered = function () {
};

Template.CategoryList.destroyed = function () {
};
