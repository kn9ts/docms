(function(self_invoke) {
  'use strict';
  // require('./filters/filters');

  var app = angular.module('app', [
    'ui.router',
    'ngResource',
    'ngMaterial',
    'ngCookies'
    // 'app.filters'
  ]);

  // Configurations
  app.config(['$mdThemingProvider', function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('purple')
      .accentPalette('pink');
  }]);

  // Run this as soon as the app bootstraps
  // app.run(['$rootScope', '$state', '$cookies', '$location', 'User', function($rootScope, $state, $cookies, $location, User) {
  //   var user = $cookies.getObject('docmsToken');
  //   if (user) {
  //     console.log('COOKIE', user.username);
  //     $rootScope.user = user;
  //     $state.go('dashboard', {
  //       id: user.username
  //     });
  //   }
  // }]);

  // Services, Factories and Providers
  app.factory('User', ['$resource', '$http', require('./services/user')]);

  // Decorate the user $resource instance
  // extends the user $resource instance with login, session and logout methods
  app.config([
    '$provide',
    '$httpProvider',
    require('./services/user.decorator')
  ]);

  // Controllers
  app.controller('appController', ['$scope', require('./controllers/app')]);
  app.controller('headerController', ['$scope', '$state', 'User', require('./controllers/header')]);

  app.controller('loginController', ['$rootScope', '$scope', '$state', '$cookies',  'User', require('./controllers/login')]);
  app.controller('accountController', ['$scope', '$state', 'User', require('./controllers/account')]);
  app.controller('createAccountController', ['$scope', 'User', require('./controllers/createAccount')]);
  app.controller('dashboardController', ['$scope', '$state', 'User', require('./controllers/dashboard')]);

  // Routing and configurations
  app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', require('./router')]);

  return app;
})(true);
