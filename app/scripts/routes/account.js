module.exports = {
  url: '/user/{id}/account',
  views: {
    '': {
      templateUrl: 'views/account.html',
      controller: 'accountController'
    }
  }
};
