// instantiate the database connection
var mongoose = require('../config/database'),
  Schema = mongoose.Schema;

// load models
var models = [
  'accessRights',
  'documents',
  'roles',
  'sessions',
  'users'
];

// add them to be exported in one go
models.forEach(function(model) {
  module.exports[ucFirst(model)] = require(model)();
});

// instantiate the relationships
// relationships(module.exports);

// export connection
module.exports.mongoose = mongoose;
