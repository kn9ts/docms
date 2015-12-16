describe('Testing application bootstrapping', function() {
  var mockUser = {
    username: 'hannah_koskei',
    name: {
      first: 'Hannah',
      last: 'Koskei'
    },
    email: 'hannah_koskei@gmail.com',
    role: 'user'
  };

  beforeEach(module('app', function($provide) {
    $provide.service('User', function() {
      this.session = function() {};
      // after declaration, stub the session method
      sinon.stub(this, "session", function(fn) {
        fn(null, mockUser);
      });
    });

    $provide.value('$state', {
      go: sinon.spy()
    });
  }));

  it('On application start, user session is checked for', inject(function($rootScope, $state, User) {
    expect($rootScope.roles).to.be.an('array');
    expect($rootScope.roles).to.be.length.of(3);

    assert(User.session.calledOnce);
    assert($state.go.calledOnce);
  }));
});
