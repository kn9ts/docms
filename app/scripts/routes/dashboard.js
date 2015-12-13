module.exports = {
  url: '/user/{id}/dashboard',
  views: {
    '': {
      templateUrl: 'views/dashboard.html',
      controller: 'dashboardController'
    }
  }
};
