'use strict';
module.exports = function(mongoose, Schema) {
  return mongoose.model('Roles', new Schema({
    // _id: new Schema.Types.ObjectId, // created by Mongodb
    // ----- roles: -----
    // viewer - can read only (public docs only)
    // user - can read and write
    // admin - can read, write and delete
    title: {
      type: String,
      unique: true,
      validate: {
        validator: function(title) {
          return /(viewer|admin|user)/.test(title);
        },
        message: 'Role should be either viewer, user or admin.'
      }
    }
  }));
};
