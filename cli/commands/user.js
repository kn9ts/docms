module.exports = function(vantage, apiUrl, request, colors) {
  var User = require('../controllers/user')(request, vantage, apiUrl);

  // Login the user
  vantage.command('login')
    .description('Use this to login into the system')
    .option('-u, --username <username>', 'Provide your username')
    .option('-p, --password <password>', 'Provide user\'s password')
    .action(function(args, next) {
      var cli = this;
      if (args.hasOwnProperty('options') && Object.keys(args.options).length === 2) {
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
      } else {
        cli.log(colors.grey('Please provide username and password to login.'));
        cli.log(colors.cyan('Example: login -u username -p password.'));
        next();
      }
    });

  // Create users
  vantage.command('create')
    // .help(function(args, next) {
    //   this.log('Use this to register yourself as user if you are not in part of the system already.');
    //   this.log(colors.yellow('Example: create -u username -p password -e youremail@company.com -fn eugene -ln mutai'));
    //   next();
    // })
    .description('Use this to register yourself as user if you are not.\n' + colors.yellow('  Example: create -u username -p password -e yourname@company.com -f eugene -l mutai'))
    .option('-u, --username <username>', 'Enter your username')
    .option('-p, --password <password>', 'Enter your password')
    .option('-e, --email <emailaddress>', 'Enter your email address')
    .option('-f, --firstname <firstname>', 'Enter your first name')
    .option('-l, --lastname <lastname>', 'Enter your last name')
    .action(function(args, next) {
      var cli = this;
      cli.log(args.options);
      if (args.hasOwnProperty('options') && Object.keys(args.options).length === 5) {
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
      } else {
        cli.log(colors.grey('You are require to use all options.'));
        cli.log(colors.cyan('Example: create -u username -p password -e youremail@company.com -f eugene -l mutai'));
        next();
      }
    });

  // Update users
  vantage.command('update')
    .description('Use this to register user into the system')
    .option('-e, --email <emailAddress>', 'Adds your email address')
    .option('-n, --name <names...>', 'Adds your names')
    .action(function(args, next) {
      var cli = this;
      // check if options and arguments were passed
      if (args.hasOwnProperty('options') & args.options.length >= 1) {
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


  vantage.command('logout')
    .alias('kill')
    .description('Logout the user. Kill his/her session.')
    .action(function(args, next) {
      var cli = this;
      User.logout(function(err, res) {
        if (err) {
          cli.log(colors.red('Error: ' + err));
          return next();
        }

        if (res) {
          cli.log(colors.green(res.message));
          // remove the token
          vantage.authToken = undefined;
          next();
        }
      });
    });
};
