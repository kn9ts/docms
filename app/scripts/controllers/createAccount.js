var createAccountController = function($scope, $state, User) {
  $scope.buttonTitle = 'Create Account';

  // if false hides the password and confirm password piece
  $scope.isUpdate = false;

  $scope.user = {
    username: 'hannah_koskei',
    name: {
      first: 'Hannah',
      last: 'Koskei'
    },
    email: 'hannah_koskei@gmail.com',
    role: 'viewer'
  };

  $scope.createOrUpdateAccount = function() {
    // Server uses these options on creating an account
    $scope.user.firstname = $scope.user.name.first;
    $scope.user.lastname = $scope.user.name.last;

    // login user
    User.save($scope.user, function() {
      // User has been added to the system
      // login them automatically
      User.login($scope.user, function(err, user) {
        if (err) {
          console.log(err);
          return;
        }
        $state.go('dashboard', {
          id: user.username
        });
      });
    });

  };
};

module.exports = createAccountController;
