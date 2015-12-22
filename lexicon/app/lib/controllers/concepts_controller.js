ConceptsController = RouteController.extend({
  subscriptions: function() {
    this.subscribe('concepts');
    this.subscribe('conceptDetail', Router.current().params.slug);
  },
  detail: function () {
    this.render('ConceptDetail');
  },
  list: function () {
    this.render('ConceptList');
  }
});
