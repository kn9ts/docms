module.exports = function(vantage, apiUrl, request, colors) {

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
    .alias('isup')
    .description('Checks whether the system is up and running')
    .action(function(args, next) {
      var cli = this;
      request
        .get(apiUrl)
        .end(function(err, res) {
          if (err) {
            cli.log(res.body.error.red);
            return next();
          }
          if (res.status === 200) {
            cli.log(colors.green(res.body.message));
          } else {
            cli.log(colors.red(res.body.message));
          }
        });
      next();
    });

  vantage.command('status')
    .alias('api')
    .description('Checks whether if user is logged in and which one.')
    .action(function(args, next) {
      var cli = this;
      request
        .get(apiUrl)
        .end(function(err, res) {
          if (err) {
            cli.log(res.body.error.red);
            return next();
          }
          if (res.status === 200) {
            cli.log(colors.green(res.body.message));
          } else {
            cli.log(colors.red(res.body.message));
          }
        });
      next();
    });

  vantage.command('test')
    .description('Checks whether if user is logged in and which one.')
    .action(function(args, next) {
      var cli = this;
      vantage.exec('login -u eugene -p password', function(err, data) {
        cli.log(data);
        next();
      });
      next();
    });
};
