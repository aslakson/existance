HomeController = RouteController.extend({
  layoutTemplate: 'MasterLayout',

  subscriptions: function() {
    this.subscribe('popular');
  },

  action: function() {
    this.render('Home', {});
  }
});
