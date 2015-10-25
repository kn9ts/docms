var SessionService = require('../services/sessions.js'),
  Users = require('../models/users.js');

module.exports = function(api, config) {
  // Check if a user session has been set
  api.get('/whose/session', function(req, res, next) {
    SessionService.get().then(function(response) {
      // If there are no errors
      var err = response[0];
      if (!err) {
        var theSession = response[1];
        // Confirm the session is not one for a document
        if (!theSession.isDocument) {
          // Get the username
          Users.findById(theSession.sessionForId).exec(function(err, user) {
            res.status(200).json({
              status: 200,
              message: 'You are logged in as ' + user.username
            });
          });
        }
      } else {
        res.status(404).json({
          status: 404,
          message: 'No existing user session found.',
          error: err.message
        });
      }
    });
  });
};
