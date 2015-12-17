// load the applications environment
require('dotenv').load();

var faker = require('faker'),
  mongoose = require('../server/config/database'),
  Schema = mongoose.Schema,
  Users = require('../server/models/users')(mongoose, Schema),
  Documents = require('../server/models/documents')(mongoose, Schema),
  exit = require('./exit'),
  documentstoCreate = 20;

// # Bug fix: Schema hasn't been registered for model "Roles".
require('../server/models/roles')(mongoose, Schema);

function createDocument(user, newDocDetails, loopNo) {
  var newDoc = new Documents(newDocDetails);
  // save the document
  newDoc.save(function(err) {
    if (err) {
      err = new Error('Oops! Failed to create your document.');
      console.error(err);
    }
    // add document to user's collection
    user.docsCreated.push(newDoc);
    user.save(function(err) {
      if (err) {
        err = new Error('Failed to add the document into the creator\'s collection');
        console.error(err);
      }
      // all went well
      console.log('Document created successfully.\nDoc: ' + newDoc.content);

      // exit, if all 20
      if (loopNo === (documentstoCreate - 1)) {
        exit();
      }
    });
  });
}

Users.findOne()
  .where('username').equals('eugene')
  // .where('password').equals(bcrypt.hashSync('password'))
  .populate('role')
  .exec(function(err, user) {
    if (err) {
      err = new Error('Failed to find current user.');
      console.error(err);
    }

    if (user) {
      for (var x = 0, len = documentstoCreate; x < len; x++) {
        var newDocDetails = {};
        newDocDetails.content = faker.lorem.sentences();
        newDocDetails.isPrivate = false;

        // populate the owner of the document
        newDocDetails._creator = user._id;
        createDocument(user, newDocDetails, x);
      }
    } else {
      console.log('USER was not found');
      exit();
    }
  });
