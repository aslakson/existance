PublicationsController = RouteController.extend({
  subscriptions: function () {
    this.subscribe('publications');
    this.subscribe('publication', this.params.slug);
  },

  detail: function () {
    this.render('PublicationDetail');
  },

  list: function () {
    this.render('PublicationsList');
  }
});