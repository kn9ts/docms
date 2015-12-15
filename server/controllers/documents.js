'use strict';
var Documents = function() {};
Documents.prototype = {
  all: function(req, res, next) {
    var Documents = req.app.get('models').Documents;
    var scope;
    // admin can view all documents
    // everyone else can only view public and documents they created/own
    if (req.decoded.role && req.decoded.role.title === 'admin') {
      scope = {};
    } else {
      scope = {
        $or: [{
          isPrivate: false
        }, {
          _creator: req.decoded._id
        }]
      };
    }

    // Get public and documents user created
    Documents.find(scope)
      .populate('_creator', '_id username name')
      .sort({
        dateCreated: -1
      })
      .exec(function(err, docs) {
        if (err) {
          return next(err);
        }
        if (docs.length > 0) {
          res.status(200).json({
            documents: docs
          });
        } else {
          res.status(200).json({
            documents: docs,
            message: 'No documents exist.'
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
          return next(err);
        }
        // is the document public?
        if (doc && doc.isPrivate) {
          res.status(200).json({
            document: doc
          });
        }
        // if it's private, is the one requesting the document the owner
        else if (String(doc._creator._id) === String(req.decoded._id)) {
          res.status(200).json({
            document: doc
          });
        }
        // if none of the above, send back an auth error
        else {
          err = new Error('Unauthorised. Only the owner can view this document.');
          err.status = 401;
          return next(err);
        }
      });
  },
  create: function(req, res, next) {
    if (req.body.content) {
      // a viewer is not allowed to create a document
      if (req.decoded.role && req.decoded.role.title === 'viewer') {
        var err = new Error('As a viewer, you are not authorized to create documents.');
        err.status = 401;
        return next(err);
      }

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
        // populate the owner of the document
        newDoc._creator = req.decoded._id;
        // save the document
        newDoc.save(function(err) {
          if (err) {
            err = new Error('Oops! Failed to create your document.');
            return next(err);
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
      var newErr = new Error('No content provided to create a document.');
      newErr.status = 416;
      return next(newErr);
    }
  },
  update: function(req, res, next) {
    // a viewer is not allowed to create a document
    if (req.decoded.role && req.decoded.role.title === 'viewer') {
      var err = new Error('As a viewer, you are not authorized to update documents.');
      err.status = 401;
      return next(err);
    }

    var Documents = req.app.get('models').Documents;
    Documents.findByIdAndUpdate(req.params.id, req.body).exec(function(err, doc) {
      if (err) {
        err = new Error('Document with the given ID was not found thus no update was made.');
        return next(err);
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

    // Only users(their own documents) and admins are allowed to delete documents
    if (req.decoded.role && !/(user|admin)/g.test(req.decoded.role.title)) {
      var err = new Error('You are not authorized to delete documents.');
      err.status = 401;
      err.role = req.decoded.role;
      return next(err);
    }

    var Documents = req.app.get('models').Documents;
    Documents.findById(req.params.id)
      .populate('_creator', '_id')
      .exec(function(err, doc) {
        if (err) {
          err = new Error('Document with ID:' + req.params.id + ' does not exist.');
          return next(err);
        }
        // if the document exists
        if (doc) {
          // and the request came from the doc _creator
          // or ADMIN
          if (String(doc._creator._id) === String(req.decoded._id) || req.decoded.role.title === 'admin') {
            // delete it
            doc.remove(function(err) {
              if (err) {
                err = new Error('Failed to delete. Only admin and document creator is allowed to delete document.');
                return next(err);
              } else {
                res.status(200).json({
                  message: 'Poof! And the document has been deleted.'
                });
              }
            });
          } else {
            // 403 - Forbidden
            err = new Error('You are not authorized to delete document. You must be creator or admin.');
            err.status = 403;
            return next(err);
          }
        } else {
          err = new Error('Document does not exist.');
          return next(err);
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
        .sort({
          dateCreated: -1
        })
        .populate('_creator', '_id username name')
        .exec(function results(err, documentsFound) {
          if (err) {
            return next(err);
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
      return next(err);
    }
  }
};

module.exports = new Documents();
