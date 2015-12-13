module.exports = function($provide, $httpProvider) {
  $httpProvider.defaults.headers.common.Accept = 'application/json';

  $provide.decorator('User', ['$delegate', '$http', '$state', '$rootScope', '$cookies', function($delegate, $http, $state, $rootScope, $cookies) {
    $delegate.login = function(user, cb) {
      var scope = this; // User
      $http.post('/api/users/login', user).success(function(res) {
        // set the TOKEN into the HEADER
        $httpProvider.defaults.headers.common['x-access-token'] = res.user.token;

        // put into cookies
        $cookies.putObject('docmsToken', res.user);
        console.log($cookies.getObject('docmsToken'));

        // the role should only be the title
        res.user.role = res.user.role.title;
        res.user.confirmPassword = null;
        delete res.user.token;

        // console.log('User', Object.getOwnPropertyNames(scope).map(function(p) {
        //   // return typeof user[p] == 'function';
        //   if (p == 'prototype') {
        //     var userProtoype = scope[p];
        //     var proto = Object.getOwnPropertyNames(userProtoype).map(function(a) {
        //       if (/(get|tojson)/gi.test(a)) {
        //         console.log(a, userProtoype[a]);
        //       }
        //       return [a, typeof userProtoype[a]].join(': ');
        //     });
        //     console.log('Instance of service is assigned', proto);
        //   }
        //   return [p, typeof scope[p]].join(': ');
        // }));

        // Add the built in resource parameters to the response
        angular.extend(res.user, scope.prototype);
        $rootScope.user = scope.$data = res.user;
        cb(null, res.user);
      }).error(function(err) {
        cb(err);
      });
    };

    $delegate.session = function(cb) {
      // var scope = this;
      $http.get('/api/users/session').success(function(res) {
        cb(null, res);
      }).error(function(err) {
        cb(err);
      });
    };

    $delegate.logout = function(cb) {
      var scope = this;
      $http.get('/api/users/logout').success(function(res) {
        // Remove the token from the headers
        $httpProvider.defaults.headers.common['x-access-token'] = undefined;

        // removed the persisted data
        delete scope.$data;
        delete $rootScope.user;
        $cookies.remove('docmsToken');
        console.log('USERDATA', scope.$data);
        cb(null, res);
      }).error(function(err) {
        cb(err);
      });
    };

    return $delegate;
  }]);
};
