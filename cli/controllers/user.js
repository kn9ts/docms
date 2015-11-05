'use strict';
module.exports = function(request, apiUrl) {
  function User() {}
  User.prototype = {
    login: function(user, cb) {
      request
        .post([apiUrl, '/users/login'].join(''))
        .send(user)
        .end(function(err, res) {
          if (err) {
            cb(err, null);
          }
          if (res.status === 200) {
            cb(null, res.body);
          } else {
            cb(res.body.error, null);
          }
        });
    },
    create: function(user, cb) {
      request
        .post([apiUrl, '/users'].join(''))
        .send(user)
        .end(function(err, res) {
          if (err) {
            cb(err, null);
          }
          if (res.status === 200) {
            cb(null, res.body);
          } else {
            cb(res.body.error, null);
          }
        });
    },
    update: function(userUpdates, cb) {
      request
        .put([apiUrl, '/users'].join(''))
        .send(userUpdates)
        .end(function(err, res) {
          if (err) {
            cb(err, null);
          }
          if (res.status === 200) {
            cb(null, res.body);
          } else {
            cb(res.body.error, null);
          }
        });
    },
    delete: function(userId, cb) {
      request
        .delete([apiUrl, '/users'].join(''))
        .send({
          userId: userId
        })
        .end(function(err, res) {
          if (err) {
            cb(err, null);
          }
          if (res.status === 200) {
            cb(null, res.body);
          } else {
            cb(res.body.error, null);
          }
        });
    }
  };
  return new User();
};
