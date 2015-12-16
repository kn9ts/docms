var loginController = function($scope, $state, User) {
  $scope.user = {
    username: 'eugene',
    password: 'password'
  };

  $scope.loginUser = function() {
    // login user
    User.login($scope.user, function(err, user) {
      if (err) {
        throw err;
      }
      console.log('LOGGEDIN_USER', user);

      $state.go('dashboard', {
        id: user.username
      });
    });
  };
};

module.exports = loginController;
