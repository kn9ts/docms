module.exports = {
  url: '/',
  views: {
    '': {
      templateUrl: 'views/index.html'
    },
    'login@home': {
      templateUrl: 'views/partials/login.html',
      controller: 'loginController'
    },
    'createAccount@home': {
      templateUrl: 'views/partials/profile.html',
      controller: 'createAccountController'
    }
  }
};
