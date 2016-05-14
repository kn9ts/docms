describe('accountController', function() {
  var scope, $controllerConstructor, userResource, mockUser = {
    username: 'hannah_koskei',
    name: {
      first: 'Hannah',
      last: 'Koskei'
    },
    email: 'hannah_koskei@gmail.com',
    role: 'user'
  };

  beforeEach(module('app'));

  beforeEach(inject(function($controller, $rootScope, User) {
    $controllerConstructor = $controller;

    $rootScope.user = mockUser;

    scope = $rootScope.$new();
    userResource = User;

    sinon.stub(userResource, 'update', function(args, fn) {
      fn(args);
    });

    sinon.stub(userResource, 'customiseUser', function() {
      return true;
    });

    $controllerConstructor('accountController', {
      '$rootScope': $rootScope,
      '$scope': scope,
      'User': userResource
    });
  }));

  it('button title should be defined', function() {
    expect(scope.buttonTitle).to.be.a('string');
    expect(scope.buttonTitle).to.be.equal('Update Details');
  });

  it('isUpdate is set to true, and is boolean', function() {
    expect(scope.isUpdate).to.be.equal(true);
  });

  it('createOrUpdateAccount function exists and acts as required', function() {
    sinon.spy(scope, 'createOrUpdateAccount');
    expect(scope.createOrUpdateAccount).to.be.a('function');

    scope.createOrUpdateAccount();

    assert(scope.createOrUpdateAccount.calledOnce);
    assert(userResource.update.calledOnce);
    assert(userResource.customiseUser.calledOnce);

    expect(scope.buttonTitle).to.contain('Account');
  });
});
