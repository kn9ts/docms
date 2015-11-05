var Documents = require('../models/documents'),
  SessionService = require('../services/sessions.js');

module.exports = function(api, config) {
  api.route('/documents')
    // Get all the documents
    .get(function(req, res) {
      Documents.find({}).exec(function(err, docs) {
        if (err) {
          res.status(500).json({
            error: err.message
          });
        }
        if (docs.length > 0) {
          res.status(200).json({
            documents: docs
          });
        } else {
          res.status(200).json({
            documents: docs,
            message: 'No documents currently added.'
          });
        }
      });
    })
    // Create a document
    .post(function(req, res) {
      if (req.body.content) {
        var newDoc = new Documents();
        newDoc.content = req.body.content;

        // now get the owner of the document (in session)
        SessionService.get().then(function(response) {
          var err = response[0];
          if (!err) {
            var theSession = response[1];
            // confirm the session is not one for a document
            if (!theSession.isDocument) {
              // reference the owner of the document
              newDoc.ownerId = theSession.sessionForId;
              // save the document
              newDoc.save(function(err) {
                if (!err) {

                  res.status(200).json({
                    message: 'Document created successfully.',
                    document: newDoc
                  });
                } else {
                  res.status(500).json({
                    message: 'Oops! An error occured when creating your document.',
                    error: err.message
                  });
                }
              });
            }
          } else {
            res.status(404).json({
              message: 'No existing user session found.',
              error: err.message
            });
          }
        });
      } else {
        res.status(404).json({
          error: 'No content provided to create a document.'
        });
      }
    });

  api.route('/documents/:id')
    // Get the specific document details
    .get(function(req, res, next) {
      Documents.findById(req.params.id).exec(function(err, doc) {
        if (err) {
          res.status(500).json({
            error: 'Document with ID:' + req.params.id + ' does not exist.'
          });
        }
        if (doc) {
          res.status(200).json({
            document: doc
          });
        }
      });
    })
    // Update the specific document details
    .put(function(req, res, next) {
      Documents.findByIdAndUpdate(req.params.id, {
        content: req.body.content
      }).exec(function(err, doc) {
        if (err) {
          res.status(500).json({
            error: 'An error occured when updating the document. Please make sure the ID given is for an existing document.'
          });
        }
        if (doc) {
          doc.content = req.body.content;
          res.status(200).json({
            document: doc,
            message: 'Document updated successfully.'
          });
        }
      });
    })
    // Delete the specific document
    .delete(function(req, res, next) {
      Documents.findById(req.params.id).exec(function(err, doc) {
        if (err) {
          res.status(500).json({
            error: 'Document with ID:' + req.params.id + ' does not exist.'
          });
        }
        if (doc) {
          // delete him
          doc.remove(function(err) {
            if (err) {
              res.status(500).json({
                error: 'An error occured while trying to delete the document. Please try again.'
              });
            } else {
              res.status(200).json({
                deleted: true,
                message: 'Poof! And the document ceased to exist.'
              });
            }
          });
        }
      });
    });

  api.route('/documents/search/:term')
    .get(function(req, res) {
      Documents
        .where({
          content: {
            $regex: new RegExp(req.params.term)
          }
        })
        .exec(function results(err, documentsFound) {
          if (err) {
            res.status(500).json({
              error: err.message
            });
          }
          if (documentsFound.length > 0) {
            res.status(200).json({
              term: req.params.term,
              documents: documentsFound
            });
          } else {
            res.status(200).json({
              documents: documentsFound,
              message: 'No documents has content matching ' + req.params.term
            });
          }
        });
    });
};
