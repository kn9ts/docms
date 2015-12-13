// load the applications environment
require('dotenv').load();

var Mongoose = require('mongoose'),
  exit = require('./exit');

// http://stackoverflow.com/a/10369209/1709647
Mongoose.connect(process.env.DATABASE, function() {
  /* Drop the DB */
  Mongoose.connection.db.dropDatabase();
  exit();
});
