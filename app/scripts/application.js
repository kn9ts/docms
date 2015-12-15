(function(self_invoke) {
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
    $httpProvider.defaults.headers.common.Accept = 'application/json';

    $mdThemingProvider.theme('default')
      .primaryPalette('purple')
      .accentPalette('pink');
  }]);

  // Run this as soon as the app bootstraps
  app.run(['$http', '$rootScope', '$state', '$cookies', 'User', function($http, $rootScope, $state, $cookies, User) {
    // $cookies.remove('docmsToken');
    User.session(function(err, user) {
      if (err) {
        console.info(err.error);
      }

      // if a session exits, login user and redirect to the dashboard
      if (user) {
        $state.go('dashboard', {
          id: user.username
        });
      }
    });

    $rootScope.roles = [{
      title: 'viewer'
    }, {
      title: 'user'
    }, {
      title: 'admin'
    }];
  }]);

  // Services, Factories and Providers
  app.factory('User', ['$resource', '$http', require('./services/user')]);
  app.factory('Document', ['$resource', '$http', require('./services/document')]);

  // Decorate the user $resource instance
  // extends the user $resource instance with login, session and logout methods
  app.config(['$provide', '$httpProvider',
    function($provide, $httpProvider) {
      $provide.decorator('User', ['$delegate', '$http', '$state', '$rootScope', '$cookies', require('./decorators/user')]);
      $provide.decorator('Document', ['$delegate', '$http', require('./decorators/document')]);
    }
  ]);

  // Controllers
  app.controller('appController', ['$scope', require('./controllers/app')]);
  app.controller('headerController', ['$rootScope', '$scope', '$state', 'User', require('./controllers/header')]);

  app.controller('loginController', ['$rootScope', '$scope', '$state', '$cookies', 'User', require('./controllers/login')]);
  app.controller('createAccountController', ['$scope', '$state', 'User', require('./controllers/createAccount')]);
  app.controller('accountController', ['$http', '$rootScope', '$scope', '$state', '$stateParams', '$cookies', 'User', require('./controllers/account')]);

  app.controller('dashboardController', ['$scope', '$state', '$cookies', 'User', 'Document', require('./controllers/dashboard')]);
  app.controller('documentController', ['$rootScope', '$scope', '$state', '$stateParams', 'Document', require('./controllers/document')]);


  // Routing and configurations
  app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', require('./router')]);

  return app;
})(true);
