var loginController = function($rootScope, $scope, $state, $cookies, User) {
  $scope.user = {
    username: 'eugene',
    password: 'password'
  };

  var user = $cookies.getObject('docmsToken');
  if (user) {
    console.log('COOKIE', user.username);
    $rootScope.user = User.$data = user;
    $state.go('dashboard', {
      id: user.username
    });
  }

  $scope.login = function(savedUser) {
    // login user
    User.login(savedUser || $scope.user, function(err, user) {
      console.log('LOGGEDIN_USER', user);

      // console.log('Instance of User', Object.getOwnPropertyNames(user).map(function(p) {
      //   return [p, typeof user[p]].join(': ');
      // }));

      user.name.last = 'Mutai';
      user.$update();

      $state.go('dashboard', {
        id: user.username
      });
    });
  };
};

module.exports = loginController;
