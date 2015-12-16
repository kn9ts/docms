'use strict';
var bcrypt = require('bcrypt'),
  jwt = require('jsonwebtoken'),
  _u = require('underscore'),
  Users = function() {};

Users.prototype = {
  login: function(req, res, next) {
    var Users = req.app.get('models').Users;
    if (req.body.username && req.body.password) {
      Users.findOne()
        .where('username').equals(req.body.username)
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
                  var makeTokenFromTheseUserDetailsOnly = _u.pick(user, '_id', 'username', 'name', 'email', 'role', 'dateCreated');

                  // if user is found and password is right
                  // create a token
                  user.token = jwt.sign(makeTokenFromTheseUserDetailsOnly, req.app.get('superSecret'), {
                    expiresIn: 1440 * 60 // expires in 24 hours
                  });

                  user.save(function(err) {
                    if (err) {
                      err.details = '[server error] Failed to save token.';
                      return next(err);
                    } else {
                      delete user.password;
                      // set session before sending out response
                      req.session.user = user;
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

        req.session.destroy(function(err) {
          if (err) {
            next(err);
          }
          // cannot access session here
          res.status(200).json({
            message: 'User has been logged out'
          });
        });
      });
    });
  },
  session: function(req, res, next) {
    // req.decoded.token = req.headers['x-access-token'];
    if (req.session.hasOwnProperty('user')) {
      return res.json({
        user: req.session.user,
        message: 'You are logged in as ' + req.session.user.username
      });
    } else {
      var err = new Error('No user is logged in.');
      return next(err);
    }
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
      })
      .populate('role')
      .exec(function(err, user) {
        if (err) {
          return next(err);
        }
        res.status(200).json(user);
      });
  },
  create: function(req, res, next) {
    var Users = req.app.get('models').Users,
      Roles = req.app.get('models').Roles;

    if (req.body.username && req.body.password && req.body.email && req.body.firstname && req.body.lastname) {
      Users.findOne()
        .or([{
          email: req.body.email
        }, {
          username: req.body.username
        }])
        .exec(function(err, user) {
          // an error occured
          if (err) {
            return next(err);
          }

          // no errors and a user was found
          if (user) {
            err = new Error('Conflict! The email or username provided already exists in the system');
            err.request = req.body;
            err.status = 409;
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
              email: req.body.email,
              name: {
                first: req.body.firstname,
                last: req.body.lastname
              }
            };

            // if a role was given, as a valid one, set it
            if (!req.body.hasOwnProperty('role')) {
              req.body.role = 'viewer';
            }

            // If given, is it valid?
            if (!(/(viewer|admin|user)/gi.test(req.body.role))) {
              err = new Error('Role should be either viewer, user or admin.');
              err.status = 403;
              return next(err);
            }

            Roles.findOne()
              .where('title').equals(req.body.role)
              .exec(function(err, role) {
                if (err) {
                  var newErr = new Error('Such a role does not exist: ' + req.body.role);
                  newErr.error = err;
                  return next(newErr);
                }

                if (role) {
                  userDetails.role = role._id;
                  // create the user
                  var newUser = new Users(userDetails);
                  newUser.save(function(err) {
                    if (!err) {
                      res.status(200).json({
                        user: newUser,
                        message: 'You have successfully been added to the system\'s database.'
                      });
                    } else {
                      // 416 - requested range not satisfied
                      var newErr = new Error('Oops! Something went wrong. User not created.');
                      newErr.error = err;
                      newErr.status = 416;
                      return next(newErr);
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

    function updateUser(role) {
      Users.findByIdAndUpdate(req.params.id, req.body).exec(function(err, user) {
        if (err) {
          err = new Error('User does not exist.');
          return next(err);
        }

        if (user) {
          user.role = role;
          // update his token
          var makeTokenFromTheseUserDetailsOnly = _u.pick(user, '_id', 'username', 'name', 'email', 'role', 'dateCreated');
          user.token = jwt.sign(makeTokenFromTheseUserDetailsOnly, req.app.get('superSecret'), {
            expiresIn: 1440 * 60 // expires in 24 hours
          });

          user.save(function(err) {
            if (err) {
              err.details = '[server error] Failed to update token.';
              return next(err);
            }

            delete user.password;
            req.session.user = user;
            // show the updated content
            res.status(200).json({
              user: user,
              message: 'User updated successfully.'
            });
          });
        }
      });
    }

    // if a role should be updated
    if (req.body.hasOwnProperty('role')) {
      var Roles = req.app.get('models').Roles;
      Roles.findOne()
        .where('title').equals(req.body.role)
        .exec(function(err, role) {
          if (err) {
            var newErr = new Error('Such a role does not exist.');
            newErr.error = err;
            return next(newErr);
          }

          // role found
          if (role) {
            req.body.role = role._id;
            // update the user
            updateUser(role);
          }
        });
    } else {
      updateUser();
    }
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
  documents: function(req, res, next) {
    var Users = req.app.get('models').Users;
    Users.findById(req.params.id)
      .sort({
        dateCreated: -1
      })
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
