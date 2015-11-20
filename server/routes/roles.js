module.exports = function(api, auth, roles) {
  api.route('/roles')
    .get(auth, roles.all)
    .post(auth, roles.create);

  api.route('/roles/:title')
    .get(auth, roles.find)
    .delete(auth, roles.delete);

  // update a user's role
  api.route('/roles/user')
    .put(auth, roles.update);
};
