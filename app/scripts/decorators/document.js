module.exports = function($delegate, $http) {
   // in this case $delegate == Document
  $delegate.search = function(term, cb) {
    $http.get(['/api', 'documents', 'search', term].join('/')).success(function(res) {
      cb(null, res);
    }).error(function(err) {
      cb(err);
    });
  };

  return $delegate;
};
