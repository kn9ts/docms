require('../environment');

var Mongoose = require('mongoose'),
  exit = require('./exit');

// http://stackoverflow.com/a/10369209/1709647
Mongoose.connect(process.env.DATABASE, function() {
  /* Drop the DB */
  Mongoose.connection.db.dropDatabase();
  exit();
});
