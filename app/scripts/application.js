(function() {
  'use strict';
  require('./filters/filters');

  var app = angular.module('app', [
    'ui.router',
    'ngResource',
    'ngMaterial',
    'ngCookies',
    'app.filters'
  ]);

  // Configurations
  app.config(['$httpProvider', '$mdThemingProvider', function($httpProvider, $mdThemingProvider) {
    $httpProvider.defaults.headers.common.Accept = 'application/json; charset=utf-8';

    $mdThemingProvider.theme('default')
      .primaryPalette('purple')
      .accentPalette('pink');
  }]);

  // Run this as soon as the app bootstraps
  app.run(['$rootScope', '$state', 'User', function($rootScope, $state, User) {
    $rootScope.roles = [{
      title: 'viewer'
    }, {
      title: 'user'
    }, {
      title: 'admin'
    }];

    // $cookies.remove('docmsToken');
    User.session(function(err, user) {
      if (err) {
        throw err;
      }

      // if a session exits, login user and redirect to the dashboard
      if (user) {
        $state.go('dashboard', {
          id: user.username
        });
      }
    });
  }]);

  // Services, Factories and Providers
  app.factory('User', ['$resource', require('./services/user')]);
  app.factory('Docs', ['$resource', require('./services/document')]);

  // Decorate the user $resource instance
  // extends the user $resource instance with login, session and logout methods
  app.config(['$provide', function($provide) {
    $provide.decorator('User', [
      '$delegate', '$http', '$rootScope', '$state', '$cookies', require('./decorators/user')
    ]);
    $provide.decorator('Docs', ['$delegate', '$http', require('./decorators/document')]);
  }]);

  // Controllers
  app.controller('headerController', ['$rootScope', '$scope', '$state', 'User', require('./controllers/header')]);
  app.controller('loginController', ['$scope', '$state', 'User', require('./controllers/login')]);
  app.controller('createAccountController', ['$scope', '$state', 'User', require('./controllers/createAccount')]);
  app.controller('accountController', ['$rootScope', '$scope', 'User', require('./controllers/account')]);
  app.controller('dashboardController', ['$scope', 'User', 'Docs', require('./controllers/dashboard')]);
  app.controller('documentController', [
    '$rootScope', '$scope', '$state', '$stateParams', 'Docs', require('./controllers/document')
  ]);

  // Routing and configurations
  app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', require('./router')]);

  return app;
})();
