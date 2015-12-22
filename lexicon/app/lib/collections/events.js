Events = new Mongo.Collection('events');

if (Meteor.isServer) {
  Events.allow({
    insert: function (userId, doc) {
      return true;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return false;
    },

    remove: function (userId, doc) {
      return false;
    }
  });

  Events.deny({
    insert: function (userId, doc) {
      return false;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return true;
    },

    remove: function (userId, doc) {
      return true;
    }
  });
}

Events.attachSchema(new SimpleSchema({
  type: {
    type: String,
    allowedValues: ['VIEW', 'SHARE', 'COMMENT']
  },
  entity_type: {
    type: String,
    allowedValues: ['Publication', 'Concept', 'Category']
  },
  entity_title: {
    type: String
  },
  entity_slug: {
    type: String
  },
  // userId: {
  //   type: String
  //   autoValue: function () {
  //     if (this.isSet) {
  //       return;
  //     }
  //     if (this.isInsert) {
  //       return Meteor.userId();
  //     } else {
  //       this.unset();
  //     }
  //   }
  // },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isSet) {
        return;
      }
      if (this.isInsert) {
        return new Date();
      } else {
        this.unset();
      }
    }
  }
}));