var mongoose = require('../config/database'),
  Schema = mongoose.Schema;

module.exports = mongoose.model('dmcSession', new Schema({
  // _id: new Schema.Types.ObjectId, // created by Mongodb
  sessionForId: String,
  sessionActive: {
    type: Boolean,
    default: true
  },
  isDocument: {
    type: Boolean,
    default: false
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
