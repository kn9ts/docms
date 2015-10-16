var mongoose = require('../config/db-connect'),
  Schema = mongoose.Schema;

module.exports = mongoose.model('Documents', new Schema({
  // _id: new Schema.Types.ObjectId, // created by Mongodb
  ownerId: Schema.Types.ObjectId,
  // will have an array of Ids of user's that have these priveldges
  // data._someId = newmongoose.Types.ObjectId;
  canAccess: [Schema.Types.ObjectId],
  canWrite: [Schema.Types.ObjectId],
  canRemove: [Schema.Types.ObjectId],
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
