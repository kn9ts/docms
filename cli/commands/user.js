module.exports = function(vantage, apiUrl, request, colors) {

  var User = require('../controllers/user')(request, apiUrl);

  // Login the user
  vantage.command('login')
    .description('Use this to login into the system')
    .option('-u, --username <username>', 'Provide your username')
    .option('-p, --password <password>', 'Provide user\'s password')
    .action(function(args, next) {
      var vorpal = this;
      User.login(args.options, function(err, res) {
        if (err) {
          vorpal.log(colors.red('Error: ' + err));
          if (String(err).toLowerCase().indexOf('create') > -1) {
            vorpal.log(colors.yellow('create command: create -u ' + args.options.username + ' -p ' + args.options.password));
          }
        }

        if (res) {
          vorpal.log(colors.green(res.message));
          vantage.session.user = res.user;
        }
        next();
      });
    });

  // Create users
  vantage.command('create')
    .description('Use this to register user into the system')
    .option('-u, --username <username>', 'Enter your username')
    .option('-p, --password <password>', 'Provide user\'s password')
    .action(function(args, next) {
      var vorpal = this;
      User.create(args.options, function(err, res) {
        if (err) {
          vorpal.log(colors.red('Error: ' + err));
          next();
        }

        if (res) {
          vorpal.log(colors.green(res.message));
          vantage.session.user = res.user;
          next();
        }
      });
    });

  // Update users
  vantage.command('update')
    .description('Use this to register user into the system')
    .option('-e, --email <emailAddress>', 'Adds your email address')
    .option('-n, --names <names...>', 'Adds your names')
    .action(function(args, next) {
      var vorpal = this;
      // check if options and arguments were passed
      if (args.hasOwnProperty('options')) {
        User.update(args.options, function(err, res) {
          if (err) {
            vorpal.log(colors.red('Error: ' + err));
            next();
          }

          if (res) {
            vorpal.log(colors.green(res.message));
            vantage.session.user = res.userUpdated;
            next();
          }
        });
      } else {
        next();
      }
    });
};
