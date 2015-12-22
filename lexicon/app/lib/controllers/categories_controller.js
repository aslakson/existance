CategoriesController = RouteController.extend({
  detail: function () {
    this.render('CategoryDetail');
  },

  list: function () {
    this.render('CategoryList');
  }
});
