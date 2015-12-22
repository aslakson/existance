Template.Search.onCreated(function () {
    this.subscribe('concepts', function () {
        Meteor.typeahead.inject();
    });
});