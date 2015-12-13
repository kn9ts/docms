// The main app controller
var appController = function($scope) {
  $scope.appTitle = 'Document MS';
  $scope.appAuthor = {
    name: 'Eugene Mutai',
    email: ['eugenemutai@gmail.com', 'eugene.mutai@andela.com'],
    socialNetworkHandler: '@kn9ts'
  };
};

module.exports = appController;
