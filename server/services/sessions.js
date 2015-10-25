var Session = require('../schemas/sessions.js'),
  promise = require('promised-io/promise'),
  Deffered = promise.Deferred,
  moment = require('moment');

module.exports = {
  set: function(user) {
    var response = new Deffered();
    // console.log(user._id);
    Session.findById(user._id).exec(function(err, userSession) {
      if (err) {
        response.reject([err, null]);
      }
      // has the user session been found
      if (userSession) {
        userSession.lastUpdated = Date.now();
        userSession.save(function(err) {
          if (err) {
            response.reject([err, null]);
          }
          response.resolve([false, userSession]);
        });
      }
      // Nothing was found
      else {
        // updated, if it existed before
        var newUserSession = new Session();
        newUserSession.userId = user._id;
        newUserSession.username = user.username;
        newUserSession.password = user.password;
        // now create it
        newUserSession.save(function(err) {
          if (err) {
            response.reject([err, null]);
          }
          // item has been updated
          response.resolve([false, newUserSession]);
        });
      }
    });
    // we promise to tell you if the session exists or created
    return response.promise;
  },

  get: function() {
    var response = new Deffered();
    Session.findOne({
      sessionActive: true
    }).exec(function(err, userSession) {
      if (err) {
        response.reject([err, null]);
      }

      if (userSession) {
        // console.log(userSession);
        var now = moment().format(),
          minutes30past = moment().subtract(30, 'minutes').format(),
          sessionDate = moment(userSession.lastUpdated).format();

        // check if the session is expired (last used more than 30 minutes ago)
        if (moment(sessionDate).isBefore(now) && moment(sessionDate).isAfter(minutes30past)) { // update his user session time
          userSession.lastUpdated = Date.now();
          userSession.save(function(err) {
            if (err) {
              response.reject([err, null]);
            }
            // item has been updated
            response.resolve([false, userSession]);
          });
        } else {
          response.resolve([false, {
            message: 'Your session has expired.'
          }]);
        }
      }
    });

    return response.promise;
  },

  update: function(user) {
    return this.set(user);
  },

  delete: function(user) {
    var response = new Deffered();
    Session.remove({
      userId: user._id
    }, function(err) {
      if (err) {
        response.reject([err, null]);
      }
      // has been removed
      response.resolve([false, true]);
    });

    return response.promise;
  }
};
