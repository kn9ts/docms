var Users = require('../models/users'),
  SessionService = require('../services/sessions'),
  bcrypt = require('bcrypt');

module.exports = function(api) {
  // Login route
  api.route('/users/login')
    .post(function(req, res, next) {
      Users.findOne({
          username: req.body.username
        })
        .exec(function(err, user) {
          if (err) {
            res.status(500).json({
              error: '[server error] ' + err.message
            });
          }

          // if no errors and a user was found
          if (user) {
            // validate user password
            bcrypt.compare(req.body.password, user.password, function(err, areMatching) {
              if (err) {
                return next(err);
              }
              // is the password validly equal to its encrypted version
              if (areMatching) {
                // set username session to used when user has logged in
                SessionService.clear(function(err) {
                  if (err) {
                    res.status(500).json({
                      error: '[server error] ' + err.message
                    });
                  }

                  SessionService.set(user).then(function(response) {
                    var err = response[0];
                    if (!err) {
                      var userSession = response[1];
                      // send back a response
                      delete user.password;
                      res.status(200).json({
                        user: user,
                        message: 'Successfully logged in.'
                      });
                    } else {
                      res.status(500).json({
                        error: '[server error] ' + err.message
                      });
                    }
                  });
                });
              } else {
                res.status(416).json({
                  username: req.body.username,
                  error: 'Oops! Password provided do not match with the one stored within the system.'
                });
              }
            });
          } else {
            res.status(404).json({
              error: 'The username specified does not exist. Create one?'
            });
          }
        });
    });

  // Create a new user
  api.route('/users')
    .post(function(req, res) {
      // 1st encrypt the user's password and then add them to the DB
      bcrypt.hash(req.body.password, 10, function(err, hashedPassword) {
        if (err) {
          res.status(500).json({
            error: err
          });
        }

        var newUser = {
          username: req.body.username,
          password: hashedPassword
        };
        new Users(newUser).save(function(err) {
          if (!err) {
            res.status(200).json({
              message: 'You have successfully been added to the system\'s database.'
            });
          } else {
            // 'Oops! Something went wrong. Please try one more time.'
            // 416 - requested range not satisfied
            res.status(416).json({
              error: 'Oops! Something went wrong on our side. Or maybe your\'s? Please try initiate the same request again.'
            });
          }
        });
      });
    });

  // Get, Update or Delete the user
  api.route('/users/:id')
    // Get the user's details
    .get(function(req, res) {
      Users.find({
        _id: req.param.id
      }, function(err, user) {
        if (err) {
          res.status(500).json({
            error: err.message
          });
        }
        res.status(200).json(user);
      });
    })
    // Update the user's details
    .put(function(req, res) {
      res.status(405).json({
        error: 'Route is function but has no specific resource request logic.'
      });
    })
    // Delete the user
    .delete(function(req, res) {
      res.status(405).json({
        error: 'Route is function but has no specific resource request logic.'
      });
    });
};
