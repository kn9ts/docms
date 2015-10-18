var Users = require('../schemas/users'),
  bcrypt = require('bcrypt-nodejs');

module.exports = function(app, config) {

  app.route('/users/login')
    .post(function(req, res, next) {
      Users.findOne({
        username: req.params.username
      }).exec(function(err, user) {
        if (!err) {
          // check if the user's password match
          // on successful studen retrival
          if (user) {
            // validate user password
            bcrypt.compare(req.body.password, user.password, function(err, areMatching) {
              if (err) {
                return next(err);
              }

              // is the password validly equal to its encrypted version
              if (areMatching) {
                // set username session to used when user has logged in
                req.session.username = req.params.username;
                req.session.password = user.password;
                req.session.LOGGEDIN = true;

                // send back a response
                res.status(200).json({
                  status: 200,
                  message: 'Successfully logged in'
                });
              } else {
                res.status(400).json({
                  account: req.params.username,
                  message: 'Oops! Password provided do not match with the one stored within the system.'
                });
              }
            });
          }
        } else {
          res.status(500).json({
            status: 500,
            message: 'Server error: ' + err.message
          });
        }
      });
    });

  app.route('/users/signup')
    .post(function(req, res, next) {
      var newUser = new User(req.body);

      newUser.save(function(err) {
        if (!err) {
          res.status(200).json({
            status: 200,
            message: 'You have been successfully added to the system\'s database'
          });
        } else {
          res.status(400).json({
            status: 400,
            message: 'Oops! Something went wrong. Please try one more time.'
          });
        }
      });
    });
};
