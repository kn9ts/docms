module.exports = function(app, vantage, colors, request, API) {

  var repl = vantage.find('repl');
  if (repl) {
    repl.remove();
  }

  var disadvantage = vantage.find('vantage');
  if (disadvantage) {
    disadvantage.remove();
  }

  // Add the command 'foo', which logs 'bar'.
  vantage.command('foo')
    .description('Checks whether the system is up and running')
    .action(function(args, callback) {
      var vorpal = this;
      request
        .get(API)
        .end(function(err, res) {
          if (res.status === 200) {
            vorpal.log(res.body.message);
          }
        });
      callback();
    });

  vantage.command('status')
    .description('Checks whether if user is logged in and which one.')
    .action(function(args, callback) {
      var vorpal = this;
      request
        .get(API + '/status')
        .end(function(err, res) {
          if (res.status === 200) {
            vorpal.log(colors.green(res.body.message));
          } else {
            vorpal.log(colors.red(res.body.message));
          }
        });
      callback();
    });

  vantage.command('session')
    .description('Checks whether if user is logged in and which one.')
    .action(function(args, callback) {
      var vorpal = this;
      request
        .get(API + '/whose/session')
        .end(function(err, res) {
          if (res.status === 200) {
            vorpal.log(colors.green(res.body.message));
          } else {
            vorpal.log(colors.red(res.body.message));
          }
        });
      callback();
    });
};
