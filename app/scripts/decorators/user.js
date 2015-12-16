module.exports = function($delegate, $http, $rootScope, $state, $cookies) {
  // in this case $delegate == User
  $delegate.login = function(user, cb) {
    var scope = this; // User

    // if user is not provided in parameters
    // they probably exist in the $data property
    if (!user) {
      if (!this.$data) {
        cb(new Error('user\'s object has not been provided'));
        return;
      }
      // If it exists, assign to user
      user = this.$data;
    }

    $http.post('/api/users/login', user).success(function(res) {
      cb(null, scope.customiseUser(res.user));
    }).error(function(err) {
      cb(err);
    });
  };

  $delegate.session = function(cb) {
    var scope = this;
    $http.get('/api/users/session').success(function(res) {
      cb(null, scope.customiseUser(res.user));
    }).error(function(err) {
      cb(err);
    });
  };

  $delegate.logout = function(cb) {
    var scope = this;
    $http.get('/api/users/logout').success(function(res) {
      // Remove the token from the headers
      delete $http.defaults.headers.common['x-access-token'];

      // removed the persisted data
      delete scope.$data;
      delete $rootScope.user;
      $cookies.remove('docmsToken');

      cb(null, res);
    }).error(function(err) {
      cb(err);
    });
  };

  $delegate.getDocuments = function(cb) {
    var user = this.$data;
    $http.get(['/api', 'users', user._id, 'documents'].join('/')).success(function(res) {
      cb(null, res.documents);
    }).error(function(err) {
      cb(err);
    });
  };

  $delegate.customiseUser = function(user) {
    var scope = this;
    // set the TOKEN into the HEADER
    $http.defaults.headers.common['x-access-token'] = user.token;

    // put into cookies
    $cookies.putObject('docmsToken', user);

    // backup role 1st
    user._role = user.role;

    // the role should only be the title
    user.role = user.role.title;
    user.confirmPassword = null;
    delete user.token;

    // Extend the user with the built in resource parameters to the response
    angular.extend(user, scope.prototype);
    $rootScope.user = scope.$data = user;

    return user;
  };

  return $delegate;
};
