describe('loginController', function() {
  var scope, $controllerConstructor, userResource, stateSpy;

  beforeEach(module('app'));

  beforeEach(inject(function($controller, $rootScope, $state, User) {
    $controllerConstructor = $controller;
    scope = $rootScope.$new();
    userResource = User;
    stateSpy = $state;

    scope.user = {
      username: 'eugene',
      password: 'password'
    };

    sinon.stub(userResource, 'login', function(args, fn) {
      fn(null, args);
    });

    sinon.stub(stateSpy, 'go', function() {
      return true;
    });

    $controllerConstructor('loginController', {
      '$scope': scope,
      '$state': stateSpy,
      'User': userResource
    });
  }));

  it('$scope.user should be defined', function() {
    expect(scope.user).to.be.a('object');
  });

  it('loginUser should login user', function() {
    sinon.spy(scope, 'loginUser');

    scope.loginUser();
    expect(scope.loginUser).to.be.a('function');

    assert(scope.loginUser.calledOnce);
    assert(stateSpy.go.calledOnce);
  });
});
