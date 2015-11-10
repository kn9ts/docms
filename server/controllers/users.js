'use strict';
var bcrypt = require('bcrypt');

var Users = function() {};
Users.prototype = {
  login: function(req, res, next) {
    var Users = req.app.get('models').Users;

    if (req.body.username && req.body.password) {
      Users.findOne({
          username: req.body.username
        })
        .exec(function(err, user) {
          if (err) {
            err = new Error('[server error] ' + err.message);
            next(err);
          }

          // if no errors and a user was found
          if (user) {
            // validate user password
            bcrypt.compare(req.body.password, user.password,
              function(err, areMatching) {
                if (err) {
                  return next(err);
                }
                // is the password validly equal to its encrypted version
                if (areMatching) {
                  user.token = undefined;
                  // if user is found and password is right
                  // create a token
                  user.token = req.app.get('jwt')
                    .sign(user, req.app.get('superSecret'), {
                      expiresIn: 1440 * 60 // expires in 24 hours
                    });

                  user.save(function(err) {
                    if (err) {
                      err.details = '[server error] Failed to save token.';
                      next(err);
                    } else {
                      user.password = undefined;
                      res.status(200).json({
                        user: user,
                        message: 'Successfully logged in.'
                      });
                    }
                  });
                } else {
                  err = new Error('Oops! Password provided do not match with the one stored within the system.');
                  err.status = 416;
                  next(err);
                }
              });
          } else {
            err = new Error('The username specified does not exist. Create one?');
            err.status = 404;
            next(err);
          }
        });
    } else {
      var err = new Error('Please provide both username and password to login.');
      err.status = 416;
      next(err);
    }
  },
  all: function(req, res, next) {
    var Users = req.app.get('models').Users;
    Users.find({}).exec(function(err, users) {
      if (err) {
        next(err);
      }
      if (users.length > 0) {
        res.status(200).json({
          users: users
        });
      } else {
        res.status(200).json({
          users: users,
          message: 'No users currently added.'
        });
      }
    });
  },
  find: function(req, res, next) {
    var Users = req.app.get('models').Users;
    Users.findOne({
      _id: req.params.id
    }, function(err, user) {
      if (err) {
        next(err);
      }
      res.status(200).json(user);
    });
  },
  create: function(req, res, next) {
    var Users = req.app.get('models').Users;
    if (req.body.username && req.body.password) {
      // 1st encrypt the user's password and then add them to the DB
      bcrypt.hash(req.body.password, 10, function(err, hashedPassword) {
        if (err) {
          next(err);
        }

        var userDetails = {
          username: req.body.username,
          password: hashedPassword
        };
        var newUser = new Users(userDetails);
        newUser.save(function(err) {
          if (!err) {
            res.status(200).json({
              user: newUser,
              message: 'You have successfully been added to the system\'s database.'
            });
          } else {
            // 416 - requested range not satisfied
            err = new Error('Oops! Something went wrong. Please try one more time.');
            err.status = 416;
            next(err);
          }
        });
      });
    } else {
      var err = new Error('Please provide both username and password to create an account.');
      err.status = 416;
      next(err);
    }
  },
  update: function(req, res, next) {
    var Users = req.app.get('models').Users;
    Users.findByIdAndUpdate(req.params.id, req.body).exec(function(err, user) {
      if (err) {
        err = new Error('An error occured when updating the document. Please make sure the ID given is for an existing document.');
        next(err);
      }
      if (user) {
        // show the updated content
        res.status(200).json({
          document: user,
          message: 'Document updated successfully.'
        });
      }
    });
  },
  delete: function(req, res, next) {
    var Users = req.app.get('models').Users;
    Users.findById(req.params.id).exec(function(err, user) {
      if (err) {
        err = new Error('User with ID:' + req.params.id + ' can not be found.');
        next(err);
      }
      if (user) {
        // delete him
        user.remove(function(err) {
          if (err) {
            next(err);
          } else {
            res.status(200).json({
              message: 'Poof! And the user is deleted.'
            });
          }
        });
      } else {
        res.status(200).json({
          message: 'Huh! We did not have to do anything. User does not exist.'
        });
      }
    });
  },
  session: function(req, res) {
    return res.json({
      user: req.decoded,
      message: 'You are logged in as ' + req.decoded.username
    });
  }
};

module.exports = new Users();
