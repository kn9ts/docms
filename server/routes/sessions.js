var SessionService = require('../services/sessions.js');
module.exports = function(api, config) {
  // Check if a user session has been set
  api.get('/user/session', function(req, res, next) {
    var Users = req.app.get('models').Users,
      Session = req.app.get('models').Session;

    SessionService.get(Session).then(function(response) {
      // If there are no errors
      var err = response[0];
      if (!err) {
        var session = response[1];
        // Confirm the session is not one for a document
        if (session && !session.isDocument) {
          // Get the username
          Users.findById(session.sessionForId).exec(function(err, user) {
            if (err) {
              next(err);
            }
            if (user) {
              res.json({
                message: 'You are logged in as ' + user.username
              });
            } else {
              err = new Error('No session found.');
              err.status = 404;
              next(err);
            }
          });
        }
      } else {
        err = new Error('No existing user session found.');
        err.status = 404;
        next(err);
      }
    });
  });
};
