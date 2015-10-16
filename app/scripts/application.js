// require('./base')();
var angular = require('angular');
require('angular-ui-router');
require('angular-resource');

var todoapp = angular.module('todoapp', ['ui.router', 'ngResource']);

todoapp.factory('Todos', ['$resource', require('./factories/todo.resource')]);
todoapp.controller('AppController', ['$scope', require('./controllers/app.controller')]);
todoapp.controller('TodoController', ['$scope', 'Todos', require('./controllers/todo.controller')]);

todoapp.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    var Route = $stateProvider;
    // For any unmatched url, redirect to / (root route)
    $urlRouterProvider.otherwise('/');

    Route.state('home', {
      url: '/',
      views: {
        '': {
          templateUrl: 'views/main.html',
          controller: 'AppController'
        },
        // 'headerContent@home': {
        //   templateUrl: 'views/todo-list.html',
        //   controller: 'TodoController'
        // },
        'todolist@home': {
          templateUrl: 'views/todo-list.html',
          controller: 'TodoController'
        }
      }
    });
  }
]);
