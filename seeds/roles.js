require('../environment');

var mongoose = require('../server/config/database'),
  Schema = mongoose.Schema,
  Roles = require('../server/models/roles')(mongoose, Schema),
  roles = require('./roles.json'),
  exit = require('./exit');

for (var x = 0, len = roles.length; x <= len; x++) {
  if (x < len) {
    var newRole = new Roles(roles[x]);
    newRole.save(function(err) {
      if (err) {
        throw err;
      }
    });
  } else {
    console.log('ROLES has been seeded to the database');
    exit();
  }
}
