var mongoose = require('../config/database'),
  Schema = mongoose.Schema;

module.exports = mongoose.model('Documents', new Schema({
  // _id: new Schema.Types.ObjectId, // created by Mongodb
  ownerId: Schema.Types.ObjectId,
  // logged in user can view unless made privates
  // if private, all users who can view it are added to canView
  isPublic: {
    type: Boolean,
    default: true
  },
  text: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  // updated at
  lastModified: {
    type: Date,
    default: Date.now
  }
}));