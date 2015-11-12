// load the applications environment
require('dotenv').load();

var mongoose = require('../server/config/database'),
  Schema = mongoose.Schema,
  Roles = require('../server/models/roles')(mongoose, Schema),
  roles = require('./roles.json');

roles.forEach(function(role) {
  var newRole = new Roles(role);
  newRole.save(function(err) {
    if (err) {
      throw err;
    }
  });
});
