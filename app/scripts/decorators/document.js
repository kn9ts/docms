module.exports = function($delegate, $http) {
  $delegate.search = function(term, cb) {
    $http.get(['/api', 'documents', 'search', term].join('/')).success(function(res) {
      cb(null, res);
    }).error(function(err) {
      cb(err);
    });
  };

  return $delegate;
};
