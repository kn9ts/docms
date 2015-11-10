var path = require('path'),
  ucFirst = require('../services/ucfirst');

// load controllers
var controllers = [
  'app',
  'documents',
  'users'
];

// add them to be exported in one go
controllers.forEach(function(controller) {
  module.exports[ucFirst(controller)] = require(path.join(__dirname, controller));
});
