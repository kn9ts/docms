var mongoose = require('../config/database'),
  Schema = mongoose.Schema;

module.exports = mongoose.model('dmcSession', new Schema({
  // _id: new Schema.Types.ObjectId, // created by Mongodb
  userId: String,
  username: String,
  password: String,
  sessionActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}));
