module.exports = function(router) {
  'use strict';
  var controller = require('../controllers'),
    auth = controller.App.authorise;

  require('./users')(router, auth, controller.Users);
  require('./roles')(router, auth, controller.Roles);
  require('./documents')(router, auth, controller.Documents);

  /* GET the API status */
  router.all('/', auth, controller.App.status);
  return router;
};
