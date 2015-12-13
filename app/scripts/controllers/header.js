var headerController = function($scope, $state, User) {
  $scope.logoutUser = function() {
    User.logout(function(err, res) {
      if (err) {
        alert(err.message);
        return;
      }
      // get out of the dashboard
      $state.go('home');
    });
  };
};

module.exports = headerController;
