describe('createAccountController', function() {
  var scope, $controllerConstructor, userResource, state, userMock = {
    username: 'hannah_koskei',
    name: {
      first: 'Hannah',
      last: 'Koskei'
    },
    email: 'hannah_koskei@gmail.com',
    role: 'user'
  };

  beforeEach(module('app'));

  beforeEach(inject(function($controller, $rootScope, $state, User) {
    $controllerConstructor = $controller;
    $rootScope.user = userMock;
    state = $state;

    scope = $rootScope.$new();
    userResource = User;

    sinon.stub(userResource, 'save', function(args, fn) {
      fn(args);
    });

    sinon.stub(userResource, 'login', function(args, fn) {
      fn(null, $rootScope.user);
    });

    sinon.stub(state, 'go', function() {});

    $controllerConstructor('createAccountController', {
      '$state': state,
      '$scope': scope,
      'User': userResource
    });
  }));

  it('button title should be defined', function() {
    expect(scope.buttonTitle).to.be.a('string');
    expect(scope.buttonTitle).to.contain('Account');
  });

  it('isUpdate is set to true, and is boolean', function() {
    expect(scope.isUpdate).to.be.equal(false);
  });

  it('createOrUpdateAccount function exists and acts as required', function() {
    sinon.spy(scope, 'createOrUpdateAccount');

    // call the function
    scope.createOrUpdateAccount();

    expect(scope.user.firstname).to.be.a('string');
    expect(scope.createOrUpdateAccount).to.be.a('function');

    assert(scope.createOrUpdateAccount.calledOnce);
    assert(userResource.save.calledOnce);
    assert(userResource.login.calledOnce);
    assert(state.go.calledOnce);
  });
});
