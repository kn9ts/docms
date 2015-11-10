'use strict';
module.exports = function(router, config) {
  var controller = require('../controllers'),
    auth = controller.App.authorise;

  require('./users')(router, auth, controller.Users);
  require('./documents')(router, auth, controller.Documents);

  /* GET the API status */
  router.get('/', auth, controller.App.status);
  return router;
};
