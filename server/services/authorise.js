'use strict';
var Authorise = function() {};
Authorise.prototype = function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    req.app.get('jwt')
      .verify(token, req.app.get('superSecret'), function(err, decoded) {
        if (err) {
          return res.status(401).json({
            error: 'Failed to authenticate token.'
          });
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      error: 'Unauthorised. No token provided.'
    });
  }
};

module.exports = new Authorise();
