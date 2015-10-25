module.exports = function(router, config) {
  require('./users')(router, config);
  require('./documents')(router, config);
  require('./sessions')(router, config);

  /* GET the API status */
  router.get('/status', function(req, res, next) {
    res.status(200).json({
      status: 200,
      message: 'Up and running. All is well.'
    });
  });

  return router;
};
