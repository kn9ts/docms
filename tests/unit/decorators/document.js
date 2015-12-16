describe('Testing Docs service decorator', function() {
  var docResource, httpie, mockDoc = {
    _id: 1,
    content: 'content with term word in it'
  };

  var successCallback = {
    success: function() {}
  };

  var errorCallback = {
    error: function() {}
  };

  beforeEach(module('app'));

  beforeEach(inject(function($http, Docs) {
    docResource = Docs;
    httpie = $http;

    sinon.stub(httpie, 'get', function() {
      sinon.stub(errorCallback, 'error', function(fn) {
        fn(new Error('generate new error'));
        return this;
      });

      sinon.stub(successCallback, 'success', function(fn) {
        fn([mockDoc]);
        return errorCallback;
      });
      return successCallback;
    });
  }));

  it('Docs.search decorator function should search for documents', function(done) {
    var callback = function(err, docsFound) {
      expect(docsFound).to.be.an('array');
      assert(httpie.get.calledOnce);
      assert(successCallback.success.calledOnce);
      done();
    };

    sinon.spy(callback);
    docResource.search('term', callback);
  });
});
