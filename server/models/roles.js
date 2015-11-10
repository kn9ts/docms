'use strict';
module.exports = function(mongoose, Schema) {
  return mongoose.model('Roles', new Schema({
    // _id: new Schema.Types.ObjectId, // created by Mongodb
    role: Number,
    roleTitle: {
      type: String,
      require: false
    }
  }));
};
