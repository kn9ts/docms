var dashboardController = function($scope, $state, $cookies, User, Document) {
  $scope.documents = $scope.myDocuments = {};
  console.log('DASHBOARD', User.$data);

  User.getDocuments(function(err, docs) {
    if (err) {
      console.error(err);
    }

    $scope.myDocuments = docs;
    console.log('MYDOCUMENTS', docs);
  });

  Document.query(function(res) {
    $scope.documents = res.documents;
    console.log('DOCUMENTS', $scope.documents);
  });

  $scope.deleteDocument = function(doc) {
    var deleteThisDoc = new Document(doc);
    deleteThisDoc.$remove(function() {
      // document deleted
      console.log('DOCUMENT DELETED', deleteThisDoc);
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
    Document.search(search.term, function(err, res) {
      if (err) {
        console.log(err);
        return;
      }

      // documents were found
      $scope.documents = res.documents;
      console.log('SEARCH_DOCUMENTS', $scope.documents);
    });
  });
};

module.exports = dashboardController;
