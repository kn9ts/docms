'use strict';
module.exports = function(api, auth, users) {
  // Login route
  api.route('/users/login')
    .post(users.login);

  api.route('/users/session')
    .get(auth, users.session);

  api.route('/users')
    // Get all users
    .get(auth, users.all)
    // Create a new user/sign up
    .post(users.create);

  // Get, Update or Delete a specific user
  api.route('/users/:id')
    // Get the user's details
    .get(auth, users.find)
    // Update the user's details
    .put(auth, users.update)
    // Delete the user
    .delete(auth, users.delete);
};
