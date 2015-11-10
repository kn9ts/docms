// instantiate the database connection
var mongoose = require('../config/database'),
  path = require('path'),
  ucFirst = require('../services/ucfirst'),
  Schema = mongoose.Schema;

// load models
var models = [
  'accessRights',
  'documents',
  'roles',
  'users'
];

// add them to be exported in one go
models.forEach(function(model) {
  module.exports[ucFirst(model)] = require(path.join(__dirname, model))(mongoose, Schema);
});

// export connection
module.exports.mongoose = mongoose;
module.exports.Schema = Schema;
