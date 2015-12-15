var documentController = function($rootScope, $scope, $state, $stateParams, Document) {
  $scope.buttonTitle = $stateParams.id === 'new' ? 'Create Document' : 'Update Document';
  $scope.document = $scope.response = {};
  $scope.document.isPrivate = false;

  // if it's not a new document, fetch it's content from the servers
  if ($stateParams.id !== 'new') {
    Document.get({
      id: $stateParams.id
    }, function(res) {
      $scope.document = res.document;
      console.log('EDIT_DOCUMENT', $scope.document, $stateParams.id);
    });
  }

  $scope.submitDocument = function(doc) {
    // if it's a new doc, set the private parametre
    if ($stateParams.id === 'new') {
      $scope.document.private = $scope.document.isPrivate;
    }

    // new documents use save, and update for updating an existing a document
    var action = $stateParams.id === 'new' ? 'save' : 'update';
    Document[action]($scope.document, function(response) {
      // document has been saved
      console.log('Document ' + action, response);
      $state.go('dashboard', {
        id: $rootScope.user._id
      });
    }, function(err) {
      // error handler
      $scope.response = err.data;
    });
  };
};

module.exports = documentController;
