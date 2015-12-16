var documentController = function($rootScope, $scope, $state, $stateParams, Docs) {
  $scope.buttonTitle = $stateParams.id === 'new' ? 'Create Document' : 'Update Document';
  $scope.response = {};
  $scope.document = {};
  $scope.document.isPrivate = false;

  // if it's not a new document, fetch it's content from the servers
  if ($stateParams.id !== 'new') {
    Docs.get({
      id: $stateParams.id
    }, function(res) {
      $scope.document = res.document;
      console.log('EDIT_DOCUMENT', $scope.document, $stateParams.id);
    });
  }

  $scope.submitDocument = function() {
    // if it's a new doc, set the private parametre
    if ($stateParams.id === 'new') {
      $scope.document.private = $scope.document.isPrivate;
    }

    // new documents use save, and update for updating an existing a document
    var action = $stateParams.id === 'new' ? 'save' : 'update';
    Docs[action]($scope.document, function(response) {
      // document has been saved
      console.log('Docs ' + action, response);
      $state.go('dashboard', {
        id: $rootScope.user.username
      });
    }, function(err) {
      // error handler
      $scope.response = err.data;
    });
  };
};

module.exports = documentController;
