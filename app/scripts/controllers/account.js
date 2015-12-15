var accountController = function($http, $rootScope, $scope, $state, $stateParams, $cookies, User) {
  $scope.buttonTitle = 'Update Details';
  // if false hides the password and confirm password piece
  $scope.isUpdate = true;

  $scope.createOrUpdateAccount = function() {
    $scope.buttonTitle = 'Just a minute: updating...';
    // update user's information
    User.update($rootScope.user, function(res) {
      User.customiseUser(res.user);
      $scope.buttonTitle = 'Account Details Updated!';
    });
  };
};

module.exports = accountController;
