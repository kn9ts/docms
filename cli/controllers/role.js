'use strict';
module.exports = function(request, vantage, apiUrl) {
  function Roles() {}
  Roles.prototype = {
    // Get all roles, and list them
    all: function(cb) {
      request
        .get([apiUrl, '/roles'].join(''))
        .set('X-Access-Token', vantage.authToken)
        .end(function(err, res) {
          if (res.ok) {
            cb(null, res.body);
          } else {
            cb(res.body.error, null);
          }
        });
    },

    // Create a new document
    create: function(newRole, cb) {
      request
        .post([apiUrl, '/roles'].join(''))
        .set('X-Access-Token', vantage.authToken)
        .send(newRole)
        .end(function(err, res) {
          if (res.ok) {
            cb(null, res.body);
          } else {
            cb(res.body.error, null);
          }
        });
    },

    // Update the document in session or doc with DocumentId provided
    update: function(usersRole) {
      request
        .put([apiUrl, '/users/role'].join(''))
        .set('X-Access-Token', vantage.authToken)
        .send(usersRole)
        .end(function(err, res) {
          if (res.ok) {
            cb(null, res.body);
          } else {
            cb(res.body.error, null);
          }
        });
    },

    // Delete document in session or the [one] with the id provided
    delete: function(roleTitle, cb) {
      request
        .del([apiUrl, '/roles/', roleTitle].join(''))
        .set('X-Access-Token', vantage.authToken)
        .end(function(err, res) {
          if (res.ok) {
            cb(null, res.body);
          } else {
            cb(res.body.error, null);
          }
        });
    }
  };

  return new Roles();
};
