module.exports = function($stateProvider, $urlRouterProvider, $locationProvider) {

  var Route = $stateProvider;
  // For any unmatched url, redirect to / (root route)
  $urlRouterProvider.otherwise('/');

  Route
    .state('entrance', require('./routes/index'))
    .state('dashboard', require('./routes/dashboard'))
    .state('account', require('./routes/account'))
    .state('document', require('./routes/document'));

  $locationProvider.html5Mode(true);
};
