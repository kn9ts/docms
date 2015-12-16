var dashboardController = function($scope, User, Docs) {
  $scope.documents = $scope.myDocuments = {};

  User.getDocuments(function(err, docs) {
    if (err) {
      throw err;
    }

    $scope.myDocuments = docs;
  });

  Docs.query(function(res) {
    $scope.documents = res.documents;
  });

  $scope.deleteDocument = function(doc) {
    var deleteThisDoc = new Docs(doc);
    deleteThisDoc.$remove(function() {
      // document deleted
      // update the documents lists, filter out the removed doc
      $scope.documents = $scope.documents.filter(function(d) {
        return d._id !== doc._id;
      });
    });
  };

  // SEARCH FUNCTION
  // when a search param is submitted, update the documents
  // list with user's search request
  $scope.$on('seach_param_submitted', function(event, search) {
    Docs.search(search.term, function(err, res) {
      if (err) {
        throw err;
      }

      // documents were found
      $scope.documents = res.documents;
    });
  });
};

module.exports = dashboardController;
