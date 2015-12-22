/*****************************************************************************/
/* Client and Server Methods */
/*****************************************************************************/
Meteor.methods({
  /*
   * Example:
   *
   * '/app/items/insert': function (item) {
   *  if (this.isSimulation) {
   *    // do some client stuff while waiting for
   *    // result from server.
   *    return;
   *  }
   *
   *  // server method logic
   * }
   */
   trackEvent: function (event_type, entity_type, entity) {
      Events.insert({
         type: event_type,
         entity_slug: entity.slug,
         entity_title: entity.title,
         entity_type: entity_type
      });      
   }
});
