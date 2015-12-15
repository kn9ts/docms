module.exports = {
  url: '/',
  views: {
    '': {
      templateUrl: 'views/index.html'
    },
    'login@entrance': {
      templateUrl: 'views/partials/login.html',
      controller: 'loginController'
    },
    'createAccount@entrance': {
      templateUrl: 'views/partials/profile.html',
      controller: 'createAccountController'
    }
  }
};
