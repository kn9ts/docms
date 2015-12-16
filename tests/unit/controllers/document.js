describe('documentController', function() {
  var scope, $controllerConstructor, docResource;
  var mockDocument = {
    _id: 1,
    content: 'abc',
    isPrivate: false
  };

  beforeEach(module('app'));

  beforeEach(inject(function($controller, $rootScope, $stateParams, User, Docs) {
    $controllerConstructor = $controller;
    scope = $rootScope.$new();
    docResource = Docs;
    $stateParams.id = 'new';
    $rootScope.user = {
      username: 'eugene'
    };

    sinon.stub(docResource, 'get', function(args, fn) {
      fn({
        document: mockDocument
      });
    });

    sinon.stub(docResource, 'save', function(param, fn) {
      fn(mockDocument);
    });

    $controllerConstructor('documentController', {
      '$rootScope': $rootScope,
      '$scope': scope,
      '$stateParams': $stateParams,
      'Docs': docResource
    });
  }));

  it('button title should be defined', function() {
    expect(scope.buttonTitle).to.be.a('string');
    expect(scope.buttonTitle).to.be.contain('Document');
  });

  it('$scope.response should be an empty object', function() {
    expect(scope.response).to.be.an('object');
    expect(scope.response).to.be.empty;
  });

  it('$scope.document.isPrivate is set to false', function() {
    expect(scope.document.isPrivate).to.be.equal(false);
  });

  it('submitDocument when called, create a new document', function() {
    scope.document = {
      content: 'new document content',
      isPrivate: false
    };

    sinon.spy(scope, 'submitDocument');

    scope.submitDocument();
    expect(scope.submitDocument).to.be.a('function');

    assert(scope.submitDocument.calledOnce);
  });
});
