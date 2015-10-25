module.exports = function(app, vantage, colors, request) {

  var apiUrl = 'http://localhost:3000/api';
  require('./status')(app, vantage, colors, request, apiUrl);
  require('./users')(app, vantage, colors, request, apiUrl);
  require('./document')(app, vantage, colors, request, apiUrl);

  // Catch incorrect typed in commands
  vantage
    .catch('[words...]', 'Catches incorrect commands')
    .action(function(args, cb) {
      this.log(args.words.join(' ') + ' is not a valid command.');
    });

  // Name your prompt delimiter
  // 'websvr~$', listen on port 80
  // and show the Vantage prompt.
  vantage
    .delimiter('document-cli~$'.white)
    .listen(app, 3890, function(socket) {
      // this.log('Accepted a connection.\n');
    })
    .show();
};
