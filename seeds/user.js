require('../environment');

var moment = require('moment'),
  bcrypt = require('bcrypt-nodejs'),
  mongoose = require('../server/config/database'),
  Schema = mongoose.Schema,
  Users = require('../server/models/users')(mongoose, Schema),
  Roles = require('../server/models/roles')(mongoose, Schema),
  exit = require('./exit');


var userDetails = {
  username: 'eugene',
  name: {
    first: 'Eugene',
    last: 'Mutai'
  },
  email: 'eugenemutai@gmail.com',
  password: 'password',
  dateCreated: moment().utc().format(),
  role: 'user'
};

// check to see if the user has already been created
Users.findOne()
  .or([{
    email: userDetails.email
  }, {
    username: userDetails.username
  }])
  .exec(function(err, user) {
    // an error occured
    if (err) {
      console.error(err);
    }

    // no errors and a user was found
    if (user) {
      err = new Error('Conflict! The email or username provided already exists in the system');
      err.status = 409;
      console.error(err);
    }

    // no error and a user was not found.
    // 1st encrypt the user's password and then add them to the DB
    var hashedPassword = bcrypt.hashSync(userDetails.password);
    userDetails.password = hashedPassword;

    // if a role was given, as a valid one, set it
    if (!userDetails.hasOwnProperty('role')) {
      userDetails.role = 'viewer';
    }

    // If given, is it valid?
    if (!(/(viewer|admin|user)/gi.test(userDetails.role))) {
      err = new Error('Role should be either viewer, user or admin.');
      err.status = 403;
      console.error(err);
    }

    // find the role and then add the user
    Roles.findOne()
      .where('title').equals(userDetails.role)
      .exec(function(err, role) {
        if (err) {
          var newErr = new Error('Such a role does not exist: ' + userDetails.role);
          newErr.error = err;
          console.error(newErr);
        }

        if (role) {
          userDetails.role = role._id;
          // create the user
          var newUser = new Users(userDetails);
          newUser.save(function(err) {
            if (!err) {
              console.log('USER has successfully been added to the system\'s database.');
              exit();
            } else {
              // 416 - requested range not satisfied
              var newErr = new Error('Oops! Something went wrong. User not created.');
              newErr.error = err;
              newErr.status = 416;
              console.error(newErr);
            }
          });
        }
      });

  });
