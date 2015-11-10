'use strict';
module.exports = function(mongoose, Schema) {
  return mongoose.model('Documents', new Schema({
    // _id: new Schema.Types.ObjectId, // created by Mongodb
    // ownerId: String,
    _creator: {
      type: Schema.Types.ObjectId,
      ref: 'Users'
    },
    title: String,
    content: String,
    dateCreated: {
      type: Date,
      default: Date.now
    },
    // updated at
    lastModified: {
      type: Date,
      default: Date.now
    },
    // all document created are public by default unless
    // stated otherwise
    isPrivate: {
      type: Boolean,
      default: false
    }
  }));
};
