var user = function($resource, $http) {
  // http://localhost:3333/api/users/564ee2f04860682418479a61
  var api = $resource('/api/users/:id', {
    id: '@_id'
  }, {
    update: {
      // this method issues a PUT request
      method: 'PUT'
    }
  }, {
    stripTrailingSlashes: false
  });

  return api;
};

module.exports = user;
