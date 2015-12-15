var headerController = function($rootScope, $scope, $state, User) {
  $scope.search = {};
  $scope.logoutUser = function() {
    User.logout(function(err, res) {
      if (err) {
        console.error(err.error);
        return;
      }

      if (res) {
        // get out of the dashboard
        $state.go('entrance');
      }
    });
  };

  $scope.submitSearchRequest = function(keyEvent) {
    // if ENTER was pressed to search
    if (keyEvent.which === 13) {
      // issue a search request event
      $rootScope.$broadcast('seach_param_submitted', $scope.search);
    }
  };
};

module.exports = headerController;
