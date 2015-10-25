var Documents = require('../schemas/documents');

module.exports = function(api, config) {
  api.route('/documents/search/:term')
    .get(function(req, res) {
      Documents.find({
        $where: {
          text: {
            $regex: '/(' + req.params.term + ')/',
            $options: 'g'
          }
        }
      }).exec(function results(err, documentsFound) {
        res.status(200).json({
          status: 200,
          term: req.params.term,
          documents: documentsFound
        });
      });
    });

  api.route('/documents/:id')
    // Get the specific document details
    .get(function(req, res, next) {})
    // Update the specific document details
    .put(function(req, res, next) {})
    // Delete the specific document
    .delete(function(req, res, next) {});
};
