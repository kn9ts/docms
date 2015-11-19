'use strict';
var bcrypt = require('bcrypt'),
  jwt = require('jsonwebtoken'),
  Users = function() {};

Users.prototype = {
  login: function(req, res, next) {
    var Users = req.app.get('models').Users;
    if (req.body.username && req.body.password) {
      Users.findOne({
          username: req.body.username
        })
        .populate('role')
        .exec(function(err, user) {
          if (err) {
            err = new Error('[server error] ' + err.message);
            return next(err);
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
                  user.token = jwt.sign(user, req.app.get('superSecret'), {
                    expiresIn: 1440 * 60 // expires in 24 hours
                  });

                  user.save(function(err) {
                    if (err) {
                      err.details = '[server error] Failed to save token.';
                      return next(err);
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
                  return next(err);
                }
              });
          } else {
            err = new Error('The username specified does not exist. Create one?');
            err.status = 404;
            return next(err);
          }
        });
    } else {
      var err = new Error('Please provide both username and password to login.');
      err.status = 416;
      return next(err);
    }
  },
  logout: function(req, res, next) {
    var Users = req.app.get('models').Users;
    Users.findOne({
      _id: req.decoded._id
    }, function(err, user) {
      if (err) {
        return next(err);
      }
      user.token = null;
      user.save(function(err) {
        if (err) {
          return next(err);
        }
        res.status(200).json({
          message: 'User has been logged out'
        });
      });
    });
  },
  all: function(req, res, next) {
    var Users = req.app.get('models').Users;
    Users.find({}).exec(function(err, users) {
      if (err) {
        return next(err);
      }
      if (users.length > 0) {
        res.status(200).json({
          users: users
        });
      } else {
        res.status(200).json({
          users: users,
          message: 'No users exist.'
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
        return next(err);
      }
      res.status(200).json(user);
    });
  },
  create: function(req, res, next) {
    var Users = req.app.get('models').Users;
    if (req.body.username && req.body.password && req.body.email && req.body.firstname && req.body.lastname) {

      Users.findOne({
        $or: [{
          email: req.body.emailaddress
        }, {
          username: req.body.username
        }]
      }).exec(function(err, user) {
        // no errors and a user was found
        if (!err && user) {
          err = new Error('Conflict! User with username:' + user.username + ' exists.');
          err.status = 409;
          return next(err);
        }

        // if no user was found but an error occured
        if (err && !user) {
          return next(err);
        }

        // no error and a user was not found.
        // 1st encrypt the user's password and then add them to the DB
        bcrypt.hash(req.body.password, 10, function(err, hashedPassword) {
          if (err) {
            return next(err);
          }

          var userDetails = {
            username: req.body.username,
            password: hashedPassword,
            email: req.body.emailaddress,
            name: {
              first: req.body.firstname,
              last: req.body.lastname
            }
          };

          // if a role was given, as a valid one, set it
          if (req.body.hasOwnProperty('role') && !(/(viewer|admin|user)/.test(req.body.role))) {
            err = new Error('Role should be either viewer, user or admin.');
            err.status = 403;
            return next(err);
          } else {
            req.body.role = 'viewer';
          }

          var Roles = req.app.get('models').Roles;
          Roles.findOne({
              title: req.body.role
            })
            .exec(function(err, role) {
              if (err) {
                var e = new Error('Such a role does not exist.');
                e.error = err;
                return next(e);
              }
              // is the document public?
              if (role) {
                userDetails.role = role._id;
                // Finally create the user
                var newUser = new Users(userDetails);
                newUser.save(function(err) {
                  if (!err) {
                    res.status(200).json({
                      user: newUser,
                      message: 'You have successfully been added to the system\'s database.'
                    });
                  } else {
                    // 416 - requested range not satisfied
                    var e = new Error('Oops! Something went wrong. User not created.');
                    e.error = err;
                    e.status = 416;
                    return next(e);
                  }
                });
              }
            });
        });
      });
    } else {
      var err = new Error('You are required to provide username, password, email, firstname and lastname.');
      err.status = 416;
      return next(err);
    }
  },
  update: function(req, res, next) {
    var Users = req.app.get('models').Users;
    Users.findByIdAndUpdate(req.decoded._id, req.body).exec(function(err, user) {
      if (err) {
        err = new Error('User does not exist.');
        return next(err);
      }
      if (user) {
        // show the updated content
        res.status(200).json({
          user: user,
          message: 'User updated successfully.'
        });
      }
    });
  },
  delete: function(req, res, next) {
    var Users = req.app.get('models').Users;
    Users.findById(req.params.id).exec(function(err, user) {
      if (err) {
        err = new Error('User with ID:' + req.params.id + ' can not be found.');
        return next(err);
      }
      if (user) {
        // delete him
        user.remove(function(err) {
          if (err) {
            return next(err);
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
  },
  documents: function(req, res, next) {
    var Users = req.app.get('models').Users;
    Users.findById(req.params.id)
      .populate('docsCreated')
      .exec(function(err, user) {
        if (err) {
          return next(err);
        }
        if (user.hasOwnProperty('docsCreated') && user.docsCreated.length > 0) {
          res.status(200).json({
            documents: user.docsCreated
          });
        } else {
          res.status(200).json({
            documents: user.docsCreated,
            message: 'No documents found.'
          });
        }
      });
  }
};

module.exports = new Users();
