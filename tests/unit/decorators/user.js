describe('Testing Docs service decorator', function() {
  var userResource, rootScope, httpie, cookies;

  var mockUser = {
    _id: 1,
    username: 'hannah_koskei',
    name: {
      first: 'Hannah',
      last: 'Koskei'
    },
    email: 'hannah_koskei@gmail.com',
    role: 'user',
    documents: [1, 2, 3]
  };

  beforeEach(module('app'));

  beforeEach(inject(function($http, $rootScope, $cookies, User) {
    userResource = User;
    httpie = $http;
    rootScope = $rootScope;
    cookies = $cookies;

    var callback = {
      success: function() {},
      error: function() {}
    };

    var httpCallback = function() {
      return callback;
    };

    sinon.stub(callback, 'success', function(fn) {
      fn(mockUser);
      return callback;
    });

    sinon.stub(callback, 'error', function(fn) {
      fn(new Error('generate new error'));
      return this;
    });

    sinon.stub(httpie, 'get', httpCallback);
    sinon.stub(httpie, 'post', httpCallback);

    // Back it up before stubbing
    User.__customiseUser = User.customiseUser;
    sinon.stub(User, 'customiseUser', function() {
      return mockUser;
    });

    sinon.stub(cookies, 'remove', function() {
      return true;
    });

    sinon.stub(cookies, 'putObject', function(name, obj) {
      return [name, obj];
    });
  }));

  it('User.login decorator should login user', function(done) {
    var callback = function(err, userLoggedIn) {
      expect(err).to.be.equal(null);
      expect(userLoggedIn).to.be.an('object');
      expect(userLoggedIn).to.deep.equal(mockUser);

      assert(httpie.post.calledOnce);
      assert(userResource.customiseUser.calledOnce);
      done();
    };

    userResource.login(mockUser, callback);
  });

  it('Should throw an error if no user exists to be logged in', function(done) {
    var callback = function(err, userLoggedIn) {
      expect(err).to.be.an.instanceOf(Error);
      expect(userLoggedIn).to.be.an('undefined');
      expect(userResource.$data).to.be.an('undefined');
      done();
    };

    userResource.login(undefined, callback);
  });

  it('User.session decorator should get user session', function(done) {
    var callback = function(err, userInSession) {
      expect(err).to.be.equal(null);
      expect(userInSession).to.be.an('object');
      expect(userInSession).to.deep.equal(mockUser);

      assert(httpie.get.calledOnce);
      assert(userResource.customiseUser.calledOnce);
      done();
    };

    userResource.session(callback);
  });

  it('User.logout decorator should be able logout user', function(done) {
    // When user is logged, user is persisted
    userResource.$data = rootScope.user = mockUser;
    httpie.defaults.headers.common['x-access-token'] = 'user_provided_token';

    var callback = function(err, response) {
      expect(err).to.be.equal(null);
      expect(response).to.be.an('object');

      expect(userResource.$data).to.be.undefined;
      expect(rootScope.user).to.be.undefined;

      assert(httpie.get.calledOnce);
      assert(cookies.remove.calledOnce);
      done();
    };

    userResource.logout(callback);
  });

  it('User.getDocument decorator should get all user\'s documents', function(done) {
    userResource.$data = mockUser;
    var callback = function(err, documents) {
      expect(err).to.be.equal(null);
      expect(documents).to.be.an('array');

      assert(httpie.get.calledOnce);
      done();
    };

    userResource.getDocuments(callback);
  });

  it('User.customiseUser decorator should add user', function() {
    var user = userResource.__customiseUser(new Object(mockUser));

    expect(userResource.$data).to.be.an('object');
    assert.includeMembers(Object.getOwnPropertyNames(user), ['$get', '$save', '$update', '$remove']);
    assert(cookies.putObject.calledOnce);
  });
});
