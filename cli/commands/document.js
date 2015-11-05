module.exports = function(vantage, apiUrl, request, colors) {
  var Documents = require('../controllers/document')(request, apiUrl);

  // Create document
  vantage.command('doc <action> [content...]')
    .alias('docs')
    .alias('documents')
    .option('-i, --id <document_id>', 'Select or reference the document by ID about to be altered')
    // .option('-s, --search <term>', 'Search for a document or documents')
    .description('Do document operations')
    .action(function(args, next) {
      var vorpal = this;
      // vorpal.log(args, args.hasOwnProperty('action'));
      // doc add/create/update/extend/delete/search [content...]
      if (args.hasOwnProperty('action')) {
        var content;
        if (args.content) {
          content = args.content.join(' ');
        }

        switch (args.action) {
          // Get all documents, and list them
          case 'all':
            Documents.all(function(err, res) {
              if (err) {
                vorpal.log(colors.red('Error: ' + err));
                next();
              }

              if (res.documents.length > 0) {
                res.documents.forEach(function(doc) {
                  vorpal.log('[Id: ' + colors.green(doc._id) + '] ' + doc.content);
                });
              } else {
                vorpal.log(colors.yellow(res.message));
              }
              next();
            });
            break;

            // Create a new document
          case 'create':
            Documents.add(content, function(err, res) {
              if (err) {
                vorpal.log(colors.red('Error: ' + err));
              }
              if (res) {
                Documents.current = res.document;
                vorpal.log(colors.green(res.message));
                vorpal.log('[Id: ' + colors.green(Documents.current._id) + '] ' + Documents.current.content);
              }
              next();
            });
            break;

            // Update a document
            // The one in session if no coc ID is provided
          case 'update':
            if (args.hasOwnProperty('options')) {
              // If the --id option is missing, set it to false
              if (!args.options.hasOwnProperty('id')) {
                args.options.id = null;
              }
            } else {
              args.options = {
                id: null
              };
            }

            vorpal.log(args);

            // if no doc ID was provided, use one in session if exists
            if (!args.options.id) {
              if (Documents.current) {
                args.options.id = Documents.current._id;
              } else {
                vorpal.log(colors.grey('Please select the document or provide the Id of the document to be able to update it.'));

                vorpal.log(colors.yellow('Use command: select <document_id>'));
                vorpal.log(colors.yellow('Or: doc --id <document_id> update [new content...]'));
                next();
              }
            }

            // only make a request to the server if the ID exists
            if (args.options.id) {
              Documents.update(content, args.options.extend, args.options.id, function(err, res) {
                if (err) {
                  vorpal.log(colors.red('Error: ' + err));
                }
                if (res) {
                  Documents.current = res.document;
                  // vorpal.log(colors.green(res.message));
                  vorpal.log('[Id: ' + colors.green(Documents.current._id) + '] ' + Documents.current.content);
                }
                next();
              });
            }
            break;

            // Delete a document
            // The one in session if no coc ID is provided
          case 'delete':
            if (args.hasOwnProperty('options')) {
              // If the --id option is missing, set it to false
              if (!args.options.hasOwnProperty('id')) {
                args.options.id = false;
              }
            } else {
              args.options = {
                id: false
              };
            }

            // if a document is in sessions
            if (!args.options.id && Documents.current) {
              args.options.id = Documents.current._id;
            } else {
              vorpal.log(colors.grey('Please select the document you are updating.'));
              vorpal.log(colors.yellow('Use command: select <document_id>'));
            }

            Documents.delete(args.options.id, function(err, res) {
              if (err) {
                vorpal.log(colors.red('Error: ' + err));
              }
              if (res) {
                Documents.current = undefined;
                vorpal.log(colors.green(res.message));
              }
              next();
            });
            break;

          case 'search':
            Documents.search(args.content, function(err, res) {
              if (err) {
                vorpal.log(colors.red('Error: ' + err));
                next();
              }

              if (res.documents.length > 0) {
                res.documents.forEach(function(doc) {
                  vorpal.log('[Id: ' + colors.green(doc._id) + '] ' + doc.content);
                });
              } else {
                vorpal.log(colors.yellow(res.message));
              }
              next();
            });
            break;

            // Document in session
          case 'session':
            if (Documents.current) {
              vorpal.log('[Id: ' + colors.green(Documents.current._id) + '] ' + Documents.current.content);
            }
            next();
            break;

          default:
            next();
            break;
        }
      }
    });

  // Select a document to persist in memory when editting
  vantage.command('select <documentId> [newUpdatedContent]')
    .alias('sel')
    .description('Select a document to be one updated/extended or deleted')
    .action(function(args, next) {
      var vorpal = this;
      Documents.find(args.documentId, function(err, res) {
        if (err) {
          vorpal.log(colors.red('Error: ' + err));
        }

        if (res) {
          Documents.current = res.document;
          vorpal.log('[Id: ' + colors.green(Documents.current._id).underline + '] ' + Documents.current.content);
        }
        next();
      });
    });
};
