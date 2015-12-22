/*****************************************************************************/
/* Server Only Methods */
/*****************************************************************************/
Meteor.methods({
  /*
   * Example:
   *
   * '/app/items/insert': function (item) {
   * }
   */
    getCategoryConcepts: function (category) {
        return Concepts.find({'category': category});
    }
});
