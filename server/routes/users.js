module.exports = function(api, auth, users) {
  'use strict';
  // authentication routes
  api.route('/users/login')
    .post(users.login);

  api.route('/users/session')
    .get(auth, users.session);

  api.route('/users/logout')
    .get(auth, users.logout);

  api.route('/users')
    // get all users
    .get(auth, users.all)
    // create a new user/sign up
    .post(users.create);

  // get, update or delete a specific user
  api.route('/users/:id')
    .get(users.find)
    .put(auth, users.update)
    .delete(auth, users.delete);

  // get all the documents created by the user
  api.route('/users/:id/documents')
    .get(auth, users.documents);
};
