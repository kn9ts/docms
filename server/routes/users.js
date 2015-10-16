var User = require('../schemas/users');

module.exports = function(app, config) {

  /* GET users listing. */
  app.route('/users/:id')
    .get(function(req, res, next) {
      res.send('respond with a resource');
    });
}
