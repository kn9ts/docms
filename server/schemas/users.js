var mongoose = require('../config/db-connect'),
  Schema = mongoose.Schema;

// Mongoose assigns each of your schemas an id virtual getter by default which returns the
// documents _id field cast to a string, or in the case of ObjectIds, its hexString.
module.exports = mongoose.model('Users', new Schema({
  // _id: new Schema.Types.ObjectId, // created by Mongodb
  username: String,
  password: String
}));
