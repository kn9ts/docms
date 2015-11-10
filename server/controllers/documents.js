'use strict';
var Documents = function() {};
Documents.prototype = {
  all: function(req, res, next) {
    var Documents = req.app.get('models').Documents;
    // Get only public documents
    Documents.find({
        $or: [{
          isPrivate: false
        }, {
          _creator: req.decoded._id
        }]
      })
      .populate('_creator', '_id username name')
      .exec(function(err, docs) {
        if (err) {
          next(err);
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
  },
  find: function(req, res, next) {
    var Documents = req.app.get('models').Documents;
    Documents.findById(req.params.id)
      .populate('_creator', '_id username name')
      .exec(function(err, doc) {
        if (err) {
          err = new Error('Document with ID:' + req.params.id + ' does not exist.');
          next(err);
        }
        // is the document public?
        if (doc && doc.isPrivate) {
          res.status(200).json({
            document: doc
          });
        }
        // if not public(private), is the one requesting the document the owner
        else if (doc._creator.id === req.decoded._id) {
          res.status(200).json({
            document: doc
          });
        }
        // if none of the above, send back an auth error
        else {
          err = new Error('Unauthorised. Only the document owner can view this document.');
          err.status = 401;
          next(err);
        }
      });
  },
  create: function(req, res, next) {
    if (req.body.content) {
      var Documents = req.app.get('models').Documents;
      var Users = req.app.get('models').Users;

      Users.findById(req.decoded._id).exec(function(err, user) {
        if (err) {
          err = new Error('Failed to find current user.');
          return next(err);
        }

        var newDoc = new Documents();
        newDoc.content = req.body.content;
        newDoc.isPrivate = req.body.private;
        // reference the owner of the document
        newDoc._creator = req.decoded._id;
        // save the document
        newDoc.save(function(err) {
          if (err) {
            err = new Error('Oops! An error occured when creating your document.');
            next(err);
          }
          // add document to user's collection
          user.docsCreated.push(newDoc);
          user.save(function(err) {
            if (err) {
              err = new Error('Failed to add the document into the creator\'s collection');
              return next(err);
            }
            // all went well
            res.status(200).json({
              message: 'Document created successfully.',
              document: newDoc
            });
          });
        });
      });
    } else {
      // 416 - Requested Range Not Satisfiable
      var err = new Error('No content provided to create a document.');
      err.status = 416;
      next(err);
    }
  },
  update: function(req, res, next) {
    var Documents = req.app.get('models').Documents;
    Documents.findByIdAndUpdate(req.params.id, req.body).exec(function(err, doc) {
      if (err) {
        err = new Error('Document with the given ID was not found thus no update was made.');
        next(err);
      }
      if (doc) {
        // show the updated content
        doc.content = req.body.content;
        res.status(200).json({
          document: doc,
          message: 'Document updated successfully.'
        });
      }
    });
  },
  delete: function(req, res, next) {
    var Documents = req.app.get('models').Documents;
    Documents.findById(req.params.id)
      .populate('_creator', '_id')
      .exec(function(err, doc) {
        if (err) {
          err = new Error('Document with ID:' + req.params.id + ' does not exist.');
          next(err);
        }
        // if the document exists and the request came from the doc _creator
        if (doc && doc._creator._id === req.decoded._id) {
          // delete it
          doc.remove(function(err) {
            if (err) {
              err = new Error('Failed to delete. Please try again.');
              next(err);
            } else {
              res.status(200).json({
                message: 'Poof! And the document ceased to exist.'
              });
            }
          });
        } else {
          // 403 - Forbidden
          err = new Error('Can not delete the document. You are not authorized.');
          err.status = 403;
          next(err);
        }
      });
  },
  search: function(req, res, next) {
    // find only public or documents created by the current user
    if (req.params.hasOwnProperty('term')) {
      var Documents = req.app.get('models').Documents;
      Documents.find({
          $or: [{
            isPrivate: false
          }, {
            _creator: req.decoded._id
          }]
        })
        .where({
          content: {
            $regex: new RegExp(req.params.term)
          }
        })
        .populate('_creator', '_id username name')
        .exec(function results(err, documentsFound) {
          if (err) {
            next(err);
          }
          if (documentsFound.length > 0) {
            res.status(200).json({
              term: req.params.term,
              documents: documentsFound
            });
          } else {
            res.status(200).json({
              documents: documentsFound,
              message: 'No documents found having content matching ' + req.params.term
            });
          }
        });
    } else {
      var err = new Error('No search term provided.');
      err.status = 416;
      next(err);
    }
  }
};

module.exports = new Documents();
