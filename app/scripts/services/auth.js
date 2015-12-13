var tokenService = function($resource, $http) {
  var token = {};
  token.set = function(tokenAcquired) {
    this.token = tokenAcquired
  }
};

module.exports = tokenService;
