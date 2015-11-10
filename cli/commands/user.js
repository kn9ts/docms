module.exports = function(vantage, apiUrl, request, colors) {
  var User = require('../controllers/user')(request, vantage, apiUrl);

  // Login the user
  vantage.command('login')
    .description('Use this to login into the system')
    .option('-u, --username <username>', 'Provide your username')
    .option('-p, --password <password>', 'Provide user\'s password')
    .action(function(args, next) {
      var cli = this;
      User.login(args.options, function(err, res) {
        if (err) {
          cli.log(colors.red('Error: ' + err));
          if (String(err).toLowerCase().indexOf('create') > -1) {
            cli.log(colors.yellow('create command: create -u ' + args.options.username + ' -p ' + args.options.password));
          }
          return next();
        }

        if (res) {
          cli.log(colors.green(res.message));
          vantage.cliUser = res.user;
          vantage.authToken = res.user.token;
          next();
        }
      });
    });

  // Create users
  vantage.command('create')
    .description('Use this to register user into the system')
    .option('-u, --username <username>', 'Enter your username')
    .option('-p, --password <password>', 'Provide user\'s password')
    .action(function(args, next) {
      var cli = this;
      User.create(args.options, function(err, res) {
        if (err) {
          cli.log(colors.red('Error: ' + err));
          return next();
        }

        if (res) {
          cli.log(colors.green(res.message));
          vantage.cliUser = res.user;
          next();
        }
      });
    });

  // Update users
  vantage.command('update')
    .description('Use this to register user into the system')
    .option('-e, --email <emailAddress>', 'Adds your email address')
    .option('-n, --name <names...>', 'Adds your names')
    .action(function(args, next) {
      var cli = this;
      // check if options and arguments were passed
      if (args.hasOwnProperty('options')) {
        // Ensure an email address or names were provided
        if (!args.option.hasOwnProperty('email') || !args.option.hasOwnProperty('email')) {
          cli.log(colors.yellow('Please provide your email address or full names'));
        }
        // Join up the names before sending to the servers
        args.options.name = args.options.name.join(' ');
        User.update(args.options, function(err, res) {
          if (err) {
            cli.log(colors.red('Error: ' + err));
            return next();
          }

          if (res) {
            cli.log(colors.green(res.message));
            vantage.cliUser = res.userUpdated;
            next();
          }
        });
      } else {
        next();
      }
    });

  vantage.command('session')
    .alias('ses')
    .alias('whoami')
    .description('Checks whether if user is logged in and which one.')
    .action(function(args, next) {
      var cli = this;
      User.session(function(err, res) {
        if (err) {
          cli.log(colors.red('Error: ' + err));
          return next();
        }

        if (res) {
          cli.log(colors.green(res.message));
          next();
        }
      });
    });
};
