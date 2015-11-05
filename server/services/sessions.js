var Session = require('../models/sessions.js'),
  promise = require('promised-io/promise'),
  Deffered = promise.Deferred,
  moment = require('moment');

module.exports = {
  set: function(user) {
    var response = new Deffered(),
      thisModule = this;
    // find the existing item being persisted
    Session.findOne({
        sessionForId: user._id,
        sessionActive: true,
        isDocument: false
      })
      .exec(function(err, userSession) {
        if (err) {
          response.reject([err, null]);
        }

        // has the user session been found
        if (userSession) {
          // update it, if it existed before
          userSession.lastUpdated = Date.now();
          userSession.save(function(err) {
            if (err) {
              response.reject([err, null]);
            }
            response.resolve([false, userSession]);
          });
        }
        // it was not found
        else {
          thisModule.clear(function(err) {
            if (err) {
              response.reject([err, null]);
            }
            // Then create a new session
            var newUserSession = new Session();
            newUserSession.sessionForId = user._id;
            // now create it
            newUserSession.save(function(err) {
              if (err) {
                response.reject([err, null]);
              }
              // item has been updated
              response.resolve([false, newUserSession]);
            });
          });
        }
      });
    // we promise to tell you if the session exists or created
    return response.promise;
  },

  get: function() {
    var response = new Deffered();
    Session.findOne({
        sessionActive: true,
        isDocument: false
      })
      .exec(function(err, userSession) {
        if (err) {
          response.reject([err, null]);
        }
        // Was a user found
        if (userSession) {
          var now = moment().format(),
            minutes30past = moment().subtract(30, 'minutes').format(),
            sessionDate = moment(userSession.lastUpdated).format();

          // was the session made before now
          // check if the session is expired (last used more than 30 minutes ago)
          if (moment(sessionDate).isBefore(now) && moment(sessionDate).isAfter(minutes30past)) {
            // update his user session time
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
      sessionForId: user._id
    }, function(err) {
      if (err) {
        response.reject([err, null]);
      }
      // has been removed
      response.resolve([false, true]);
    });

    return response.promise;
  },

  clear: function(cb) {
    // deactivate all previous sessions
    Session
      .remove({}) // everything
      .remove(function(err) {
        if (typeof cb == 'function') {
          cb(err);
        }
      });
  }
};
