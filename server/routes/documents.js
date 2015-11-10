module.exports = function(api, auth, documents) {
  api.route('/documents')
    // Get all the documents
    .get(auth, documents.all)
    // Create a document
    .post(auth, documents.create);

  api.route('/documents/:id')
    // Get the specific document details
    .get(auth, documents.find)
    // Update the specific document details
    .put(auth, documents.update)
    // Delete the specific document
    .delete(auth, documents.delete);

  api.route('/documents/search/:term')
    .get(auth, documents.search);
};
