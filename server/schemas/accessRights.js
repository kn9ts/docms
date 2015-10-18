var mongoose = require('../config/database'),
  Schema = mongoose.Schema;

module.exports = mongoose.model('AccessRights', new Schema({
  // _id: new Schema.Types.ObjectId, // created by Mongodb
  documentId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  // 1 - can view/read only
  // 2 - can read and write
  // 3 - can read, write and delete
  priviledgeLevel: Number,
}));
