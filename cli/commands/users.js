module.exports = function(app, vantage, colors, request, apiURL) {

  // Login the user
  vantage.command('login')
    .description('Use this to login into the system')
    .option('-u, --username <username>', 'Enter your username')
    .option('-p, --password <password>', 'Provide user\'s password')
    .action(function(args, next) {
      var vorpal = this,
        input = vantage.ui.input();
      // vorpal.log(args);
      request
        .post(apiURL + '/users/login')
        .send(args.options)
        .end(function(err, res) {
          if (res.status === 200) {
            vorpal.log(colors.green(res.body.message));
            vantage.session.user = args.options.username;
            next();
          } else {
            vorpal.log(colors.red(res.body.error));
            if (res.body.error.toLowerCase().indexOf('create') > -1) {
              vorpal.log(colors.yellow('create command: create -u ' + args.options.username + ' -p ' + args.options.password));
            }
            next();
            // vorpal.prompt({
            //   type: 'confirm',
            //   name: 'continue',
            //   default: false,
            //   message: 'Should we go ahead and create one. Continue?',
            // }, function accepted(result) {
            //   if (result.continue) {
            //     vorpal.log(input);
            //     next();
            //   } else {
            //     next();
            //   }
            // });
          }
        });
    });

  // Create users
  vantage.command('create')
    .description('Use this to register user into the system')
    .option('-u, --username <username>', 'Enter your username')
    .option('-p, --password <password>', 'Provide user\'s password')
    .action(function(args, next) {
      var vorpal = this;
      // vorpal.log(args);
      request
        .post(apiURL + '/users')
        .send(args.options)
        .end(function(err, res) {
          if (res.status === 200) {
            vorpal.log(colors.green(res.body.message));
          } else {
            vorpal.log(colors.red(res.body.error));
          }
          next();
        });
    });
};
