describe('dashboardController', function() {
  var scope, $controllerConstructor, userResource, docResource,
    mockDocs = [{
      _id: 1,
      content: 'abc'
    }, {
      _id: 2,
      content: 'abc'
    }, {
      _id: 3,
      content: 'abc'
    }];

  beforeEach(module('app'));

  beforeEach(inject(function($controller, $rootScope, User, Docs) {
    $controllerConstructor = $controller;
    scope = $rootScope.$new();
    docResource = Docs;
    userResource = User;

    sinon.stub(userResource, 'getDocuments', function(fn) {
      fn(null, mockDocs);
    });

    sinon.stub(docResource, 'query', function(fn) {
      fn({
        documents: mockDocs
      });
    });

    sinon.stub(docResource, 'search', function(param, fn) {
      fn(null, {
        documents: mockDocs
      });
    });

    $controllerConstructor('dashboardController', {
      '$scope': scope,
      'User': userResource,
      'Docs': docResource
    });
  }));

  it('$scope.documents should be empty arrays', function() {
    expect(scope.documents).to.be.an('array');
    expect(scope.documents).to.have.length.above(0);
  });

  it('$scope.myDocuments should be empty arrays', function() {
    expect(scope.myDocuments).to.be.an('array');
    expect(scope.myDocuments).to.have.length.above(0);
  });

  it('Docs.query should populate $scope.documents', function() {
    assert(docResource.query.calledOnce);
  });

  it('User.getDocuments should populate $scope.myDocuments', function() {
    assert(userResource.getDocuments.calledOnce);
  });

  it('deleteDocument should delete a document', function() {
    sinon.spy(scope, 'deleteDocument');

    scope.deleteDocument(mockDocs[0]);
    expect(scope.deleteDocument).to.be.a('function');

    assert(scope.deleteDocument.calledOnce);
  });

  it('Search event is received and search method is called', inject(function($rootScope) {
    $rootScope.$broadcast('seach_param_submitted', 'search_term');
    assert(docResource.search.calledOnce);
    expect(scope.myDocuments).to.have.length.above(0);
  }));

});
