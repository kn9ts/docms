module.exports = function(router, config) {
  require('./users')(router, config);
  require('./documents')(router, config);
  // require('./roles')(app, config);
  var SessionService = require('../services/sessions.js');

  /* GET the API status */
  router.get('/status', function(req, res, next) {
    res.status(200).json({
      status: 200,
      message: 'Up and running. All is well.'
    });
  });

  router.get('/whose/session', function(req, res, next) {
    // Check if a user session has been set
    SessionService.get().then(function(response) {
      // If there are no errors
      var err = response[0];
      if (!err) {
        var userSession = response[1];
        res.status(200).json({
          status: 200,
          message: 'You are logged in as ' + userSession.username
        });
      } else {
        res.status(404).json({
          status: 404,
          message: 'No existing user session found.',
          error: err.message
        });
      }
    });
  });

  return router;
};
