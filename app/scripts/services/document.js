var documents = function($resource, $http) {
  var api = $resource('/api/documents/:id', {
    id: '@_id'
  }, {
    get: {
      isArray: false
    },
    query: {
      isArray: false
    },
    update: {
      // this method issues a PUT request
      method: 'PUT'
    }
  }, {
    stripTrailingSlashes: false
  });

  return api;
};

module.exports = documents;
