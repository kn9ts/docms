module.exports = function (vantage, apiUrl, request, colors) {
  var Documents = require('../controllers/document')(request, vantage, apiUrl);

  // Create document
  vantage.command('doc <action> [content...]')
    .alias('docs')
    .option('-p, --private', 'Make the document private, use this when creating the document')
    .option('-i, --id <document_id>', 'reference the ID of the document you want to select and persist in session to manipulate')
    .description('Do document operations')
    .action(function (args, next) {
      var cli = this;
      // cli.log(args, args.hasOwnProperty('action'));
      // doc add/create/update/extend/delete/search [content...]
      if (args.hasOwnProperty('action')) {

        // Only run if a user is logged in, token issued
        if (!vantage.authToken) {
          cli.log(colors.yellow('Unauthorised. Please log in first.'));
          return next();
        }

        var content;
        if (args.content) {
          content = args.content.join(' ');
          // If add is used replace with create
          args.action.replace('add', 'create');
        }

        // Have the document options been provided
        if (args.hasOwnProperty('options')) {
          // If the --private option is missing, set it to false
          if (!args.options.hasOwnProperty('private')) {
            args.options.private = false;
          }

          // If the --id option is missing, set it to false
          if (!args.options.hasOwnProperty('id')) {
            args.options.id = false;
          }
        } else {
          // If missing, issue some defaults
          args.options = {
            private: false,
            id: null
          };
        }

        if (/(add|create|update|delete)/gi.test(args.action)) {
          // if no doc ID was provided, use one in session if it exists
          if (!args.options.id) {
            if (Documents.current) {
              args.options.id = Documents.current._id;
            } else {
              cli.log(colors.grey(
                'Please select the document or provide the Id of the document to be manage it.'
              ));
              cli.log(colors.yellow('Use command: select <document_id>'));
              cli.log(colors.yellow(
                'Or: doc --id <document_id> update/delete [new content here if updating...]'
              ));
              return next();
            }
          }
        }

        switch (args.action) {
          // Get all documents, and list them
          case 'all':
            Documents.all(function (err, res) {
              if (err) {
                cli.log(colors.red('Error: ' + err));
                return next();
              }
              if (res.documents && res.documents.length > 0) {
                res.documents.forEach(function (doc) {
                  cli.log('[id: ' + colors.green(doc._id) +
                    '| creator:' + doc._creator.username.cyan +
                    '] ' + doc.content);
                });
              } else {
                cli.log(colors.yellow(res.message));
              }
              next();
            });
            break;

            // Create a new document
          case 'create':
            Documents.create(content, function (err, res) {
              if (err) {
                cli.log(colors.red('Error: ' + err));
                return next();
              }
              if (res) {
                Documents.current = res.document;
                cli.log(colors.green(res.message));
                cli.log('[Id: ' + colors.green(Documents.current._id) +
                  '] ' + Documents.current.content);
              }
              next();
            });
            break;

            // Update a document
            // The one in session if no coc ID is provided
          case 'update':
            // only make a request to the server if the ID exists
            Documents.update(content, args.options.extend, args.options.id,
              function (err, res) {
                if (err) {
                  cli.log(colors.red('Error: ' + err));
                  return next();
                }
                if (res) {
                  Documents.current = res.document;
                  // cli.log(colors.green(res.message));
                  cli.log('[Id: ' + colors.green(Documents.current._id) +
                    '] ' + Documents.current.content);
                }
                next();
              });
            break;

            // Delete a document
            // The one in session if no coc ID is provided
          case 'delete':
            Documents.delete(args.options.id, function (err, res) {
              if (err) {
                cli.log(colors.red('Error: ' + err));
              }
              if (res) {
                Documents.current = undefined;
                cli.log(colors.green(res.message));
              }
              next();
            });
            break;

          case 'search':
            Documents.search(args.content, function (err, res) {
              if (err) {
                cli.log(colors.red('Error: ' + err));
                return next();
              }

              if (res.documents.length > 0) {
                res.documents.forEach(function (doc) {
                  cli.log('[Id: ' + colors.green(doc._id) + '] ' +
                    doc.content);
                });
              } else {
                cli.log(colors.yellow(res.message));
              }
              next();
            });
            break;

            // Document in session
          case 'session':
            if (Documents.current) {
              cli.log('[Id: ' + colors.green(Documents.current._id) + '] ' +
                Documents.current.content);
              return next();
            }
            cli.log('You are not editing any document.');
            next();
            break;

          default:
            cli.log('Unknown command issued.'.yellow);
            return next();
        }
      } else {
        next();
      }
    });

  // Select a document to persist in memory when editting
  vantage.command('select <documentId>')
    .alias('sel')
    .description('Select a document to be one updated/extended or deleted')
    .action(function (args, next) {
      var cli = this;

      // Only run if a user is logged in, token issued
      if (!vantage.authToken) {
        cli.log(colors.yellow('Unauthorised. Please log in first.'));
        return next();
      }

      if (args.hasOwnProperty('documentId')) {
        Documents.find(args.documentId, function (err, res) {
          if (err) {
            cli.log(colors.red('Error: ' + err));
            return next();
          }

          if (res) {
            Documents.current = res.document;
            cli.log('[Id: ' + colors.green(Documents.current._id).underline +
              '] ' + Documents.current.content);
          }
          next();
        });
      } else {
        cli.log(colors.grey('No document ID provided'));
        next();
      }
    });
};
