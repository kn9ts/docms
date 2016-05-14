var loginController = function($scope, $state, User) {
  $scope.user = {
    username: 'eugene',
    password: 'password'
  };
  $scope.response = {};

  $scope.loginUser = function() {
    // login user
    User.login($scope.user, function(err, user) {
      if (err) {
        $scope.response.error = err.split('<br>')[0];
        console.log(err);
        return;
      }
      $scope.response.error = null;
      console.log('LOGGEDIN_USER', user);

      $state.go('dashboard', {
        id: user.username
      });
    });
  };
};

module.exports = loginController;
