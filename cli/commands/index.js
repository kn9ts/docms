module.exports = function(app, vantage, request, colors) {

  var apiUrl = 'http://localhost:3000/api';
  require('./utilities')(vantage, apiUrl, request, colors);
  require('./user')(vantage, apiUrl, request, colors);
  require('./document')(vantage, apiUrl, request, colors);

  // Name your prompt delimiter
  // 'websvr~$', listen on port 80
  // and show the Vantage prompt.
  vantage
    .delimiter('document-cli~$'.white)
    .listen(app, 3890, function(socket) {
      this.log(colors.green('Let\'s sail.\n'));
    })
    .show();
};
