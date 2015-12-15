var loginController = function($rootScope, $scope, $state, $cookies, User) {
  $scope.user = {
    username: 'eugene',
    password: 'password'
  };
  // {username: 'christa_ullrich', password: 'password1'};

  $scope.loginUser = function() {
    // login user
    User.login($scope.user, function(err, user) {
      if (err) {
        console.log(err);
        return;
      }

      console.log('LOGGEDIN_USER', user);
      // user.name.last = 'Mutai';
      // user.$update();

      $state.go('dashboard', {
        id: user.username
      });
    });
  };
};

module.exports = loginController;
