'use strict';
var jwt = require('jsonwebtoken'),
  App = function() {};

App.prototype = {
  status: function(req, res) {
    return res.status(200).json({
      message: 'Welcome to the document management CLI application'
    });
  },
  authorise: function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.headers['x-access-token'];
    // decode token
    if (token && token !== 'null') {
      // verifies secret and checks exp
      jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {
        if (err) {
          err = new Error('Failed to authenticate token.');
          return next(err);
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });
    } else {
      // if there is no token
      // return an error
      var newError = new Error('Unauthorised. No user is not logged in.');
      newError.status = 401;
      return next(newError);
    }
  }
};

module.exports = new App();
