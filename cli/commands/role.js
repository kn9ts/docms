module.exports = function(vantage, apiUrl, request, colors) {
  var Roles = require('../controllers/role')(request, vantage, apiUrl);

  // Login the user
  vantage.command('role <action> <title>')
    .alias('roles')
    .description('Role management options.')
    .option('-p, --password <password>', 'Provide password to authorise some role altering actions')
    .action(function(args, next) {
      var cli = this;
      if (args.hasOwnProperty('action')) {
        // set and create commands require access password
        if (/(set|create)/g.test(args.action)) {
          if (!args.hasOwnProperty('options') && !args.options.password) {
            cli.log(colors.yellow('A password is required as confirmation to change your role.'));
            return next();
          }
        }

        switch (args.action) {
          case 'list':
            Roles.all(function(err, res) {
              if (err) {
                cli.log(colors.red('Error: ' + err));
                return next();
              }

              if (res.roles && res.roles.length > 0) {
                cli.log('Existing roles: ');
                res.roles.forEach(function(role) {
                  cli.log(role.title);
                });
              } else {
                cli.log(colors.yellow(res.message));
              }
            });
            break;

          case 'create':
            Roles.create({
              title: args.title,
              password: args.options.password
            }, function(err, res) {
              if (err) {
                cli.log(colors.red('Error: ' + err));
                return next();
              }
            });
            break;

            // change the default role of the current user
          case 'set':
            Roles.update({
              title: args.title,
              password: args.options.password
            }, function(err, res) {
              if (err) {
                cli.log(colors.red('Error: ' + err));
                return next();
              }
            });
            break;

          case 'delete':
            Roles.delete(vantage.roleId, function(err, res) {
              if (err) {
                cli.log(colors.red('Error: ' + err));
                return next();
              }
            });
            break;

          default:
            next();
            break;
        }
      } else {
        next();
      }
    });
};
