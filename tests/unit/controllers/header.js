// [TODO]
describe('headerController', function() {
  var scope, $controllerConstructor, rs, userResource, stateSpy;

  beforeEach(module('app'));

  beforeEach(inject(function($controller, $rootScope, $state, User) {
    $controllerConstructor = $controller;
    scope = $rootScope.$new();
    userResource = User;
    stateSpy = $state;
    rs = $rootScope;

    sinon.stub(userResource, 'logout', function(fn) {
      fn(null, true);
    });

    sinon.stub(rs, '$broadcast', function() {
      return true;
    });

    sinon.stub(stateSpy, 'go', function() {
      return true;
    });

    $controllerConstructor('headerController', {
      '$rootScope': rs,
      '$scope': scope,
      '$state': stateSpy,
      'User': userResource
    });
  }));

  it('$scope.search is defined but empty', function() {
    expect(scope.search).to.be.a('object');
    expect(scope.search).to.be.deep.equal({});
  });

  it('logoutUser function exists and acts as required', function() {
    sinon.spy(scope, 'logoutUser');

    scope.logoutUser();
    expect(scope.logoutUser).to.be.a('function');

    assert(scope.logoutUser.calledOnce);
    assert(stateSpy.go.calledOnce);
  });

  it('submitSearchRequest should trigger a search request event', function() {
    scope.search = 'term';
    sinon.spy(scope, 'submitSearchRequest');

    scope.submitSearchRequest({
      which: 13
    });

    expect(scope.submitSearchRequest).to.be.a('function');
    assert(rs.$broadcast.calledOnce);
  });
});
