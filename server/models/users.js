'use strict';
module.exports = function(mongoose, Schema) {

  var UserSchema = new Schema({
    // _id: new Schema.Types.ObjectId, // created by Mongodb
    username: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true
    },
    name: {
      first: String,
      last: String
    },
    email: {
      type: String,
      trim: true,
      unique: true
    },
    password: String,
    token: String,
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Roles'
    },
    docsCreated: [{
      type: Schema.Types.ObjectId,
      ref: 'Documents'
    }],
    dateCreated: {
      type: Date,
      default: Date.now
    }
  });

  UserSchema.virtual('name.full')
    .set(function(name) {
      var split = name.split(' ');
      this.name.first = split[0];
      this.name.last = split[1];
    })
    .get(function() {
      return this.name.first + ' ' + this.name.last;
    });

  return mongoose.model('Users', UserSchema);
};
