module.exports = function(app, config) {
  require('./users')(app, config);
  // require('./documents')(app, config);
  // require('./roles')(app, config);

  /* GET home page. */
  app.get('/*', function(req, res, next) {
    res.status(200).json({
      status: 200,
      message: 'Welcome to the document management system api'
    });
  });
};
