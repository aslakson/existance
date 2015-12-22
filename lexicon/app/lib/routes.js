Router.configure({
  layoutTemplate: 'MasterLayout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound',
  waitOn: function () {
    return Meteor.subscribe('concepts') && Meteor.subscribe('publications') && Meteor.subscribe('categories');
  },
  action : function () {
    if (this.ready()) {
      this.render();
    }
  }
});

Router.route('', {
  name: 'home',
  controller: 'HomeController',
  action: 'action',
  where: 'client'
});

Router.route('/publications/', {
  name: 'publications',
  controller: 'PublicationsController',
  action: 'list',
  where: 'client'
});

Router.route('/publications/:slug/', {
  name: 'publications.detail',
  controller: 'PublicationsController',
  action: 'detail',
  where: 'client'
});

Router.route('/concepts/:slug/', {
  name: 'concepts.detail',
  controller: 'ConceptsController',
  action: 'detail',
  where: 'client'
});

Router.route('/concepts/', {
  name: 'concepts',
  controller: 'ConceptsController',
  action: 'list',
  where: 'client',
  waitOn: function () {
      return this.subscribe('concepts');
  }
});

Router.route('/categories/:slug/', {
  name: 'categories.detail',
  controller: 'CategoriesController',
  action: 'detail',
  where: 'client'
});

Router.route('/categories/', {
  name: 'categories',
  controller: 'CategoriesController',
  action: 'list',
  where: 'client'
});