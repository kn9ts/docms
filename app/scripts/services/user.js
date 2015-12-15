var user = function($resource) {
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
