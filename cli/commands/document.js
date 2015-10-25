module.exports = function(app, vantage, colors, request, apiURL) {

  // Login the user
  vantage.command('doc [string...]', {
      minimalist: true
    })
    .description('Document operations')
    .option('-a, --add', 'Adds/creates a document')
    .option('-c, --create', 'Adds/creates a document')
    .option('-u, --update', 'Update a document')
    .option('-e, --extend', 'Do not overwrite on update. Append the text to the document')
    .option('-d, --delete', 'Delete the specified document')
    .option('-i, --id <document_id>', 'Pass the ID of the document to be updated')
    .option('-s, --search <term>', 'Search for a document or documents')
    .action(function(args, next) {
      var vorpal = this;
      vorpal.log(args);
      next();
    });

  // Select a document to persist in memory when editting
  vantage.command('select ')
    .description('Select a document to be one referenced/in session when one is updating or extending a document')
    .option('-d, --doc <document_id>')
    .action(function(args, next) {
      var vorpal = this
      next();
    });
}
