module.exports = function(router) {
  'use strict';
  var controller = require('../controllers'),
    auth = controller.App.authorise;

  require('./users')(router, auth, controller.Users);
  require('./roles')(router, auth, controller.Roles);
  require('./documents')(router, auth, controller.Documents);

  /* Load up the homepage */
  router.all('/', function(req, res) {
    res.sendFile('index.html', {
      root: './public/'
    });
  });

  return router;
};
