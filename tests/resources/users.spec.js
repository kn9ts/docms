var request = require('superagent'),
  faker = require('faker'),
  _expect = require('expect.js'),
  resourceApiUrl = 'http://localhost:3000/api/users';

describe('User RESTful API tests', function() {

  var newUser = {
      username: (faker.internet.userName()).toLowerCase(),
      password: faker.internet.password()
    },
    userInfoUpdates = {
      email: faker.internet.email(),
      name: {
        first: faker.name.firstName(),
        last: faker.name.lastName()
      }
    },
    authToken = null,
    // the resource created
    user;

  /**
   * Store a newly created resource in storage.
   * POST /users (sign up)
   *
   * @return Response
   */
  it('should store a newly created resource in storage.', function(done) {
    request
      .post(resourceApiUrl)
      .send(newUser)
      .accept('application/json')
      .end(function(err, res) {
        if (res.ok) {
          var data = res.body.user;
          _expect(data.username).to.be(newUser.username);
          _expect(data._id).to.be.a('string');
          user = data;
        } else {
          throw err;
        }
        done();
      });
  });

  /**
   * Store a newly created resource in storage.
   * POST /users/login
   *
   * @return Response
   */
  it('should login the newly created user and return API authorisation token.', function(done) {
    request
      .post(resourceApiUrl + '/login')
      .send(newUser)
      .accept('application/json')
      .end(function(err, res) {
        if (res.ok) {
          var data = res.body.user;
          _expect(data.username).to.be(newUser.username);
          _expect(data._id).to.be.a('string');

          _expect(data.token).to.be.a('string');
          _expect(data.token.length).to.be.greaterThan(100);
          authToken = data.token;
        } else {
          throw err;
        }
        done();
      });
  });

  /**
   * Display a listing of the resource.
   * GET /users
   *
   * @return Response
   */
  it('should return all users stored in the database or empty array if DB is empty', function(done) {
    request
      .get(resourceApiUrl)
      .set('X-Access-Token', authToken)
      .accept('application/json')
      .end(function(err, res) {
        if (res.ok) {
          _expect(res.body.users).to.be.an(Array);
          if (res.body.users.length > 0) {
            _expect(res.body.users[0]._id).to.be.a('string');
            _expect(res.body.users[0].username).to.be.a('string');
          }
          done();
        } else {
          throw err;
        }
      });
  });

  /**
   * Show the form for creating the specified resource.
   * GET /users/{id}/create
   *
   * @param  int  $id
   * @return Response
   */
  it('should show the form for creating a new resource', function() {
    // Not used in an angular application
    // since the angular application will route to the edit form
    // and display it
    _expect(true).to.be(true);
  });

  /**
   * Display the specified resource.
   * GET /users/{id}
   *
   * @param  int  $id
   * @return Response
   */
  it('should display the specified resource.', function(done) {
    request
      .get(resourceApiUrl + '/' + user._id)
      .set('X-Access-Token', authToken)
      .accept('application/json')
      .end(function(err, res) {
        if (res.ok) {
          _expect(res.body._id).to.be.a('string');
          _expect(res.body.username).to.be(newUser.username);
        } else {
          throw err;
        }
        done();
      });
  });

  /**
   * Display all the documents the user has created
   * GET /users/{id}/documents
   *
   * @param  int  $id
   * @return Response
   */
  it('should display all the documents the user has created.', function(done) {
    request
      .get([resourceApiUrl, user._id, 'documents'].join('/'))
      .set('X-Access-Token', authToken)
      .accept('application/json')
      .end(function(err, res) {
        if (res.ok) {
          _expect(res.body.documents).to.be.an(Array);

          if (res.body.documents.length > 0) {
            _expect(res.body.documents[0]._id).to.be.a('string');
            _expect(res.body.documents[0].content).to.be.a('string');
          }
        } else {
          throw err;
        }
        done();
      });
  });

  /**
   * Show the form for editing the specified resource.
   * GET /users/{id}/edit
   *
   * @param  int  $id
   * @return Response
   */
  it('should show the form for editing the specified resource', function() {
    // Not used in an angular application
    // since the angular application will route to the edit form
    // and display it
    _expect(true).to.be(true);
  });

  /**
   * Update the specified resource in storage.
   * PUT /users/{id}
   *
   * @param  int  $id
   * @return Response
   */
  it('should update the specified resource in DB.', function(done) {
    request
      .put(resourceApiUrl + '/' + user._id)
      .set('X-Access-Token', authToken)
      .send(userInfoUpdates)
      .accept('application/json')
      .end(function(err, res) {
        if (res.ok) {
          _expect(res.body.message).to.be.a('string');
          _expect(res.body.message).to.match(/(updated)/);
        } else {
          throw err;
        }
        done();
      });
  });

  /**
   * Remove the specified resource from storage.
   * DELETE /users/{id}
   *
   * @param  int  $id
   * @return Response
   */
  it('should remove the specified resource from storage.', function(done) {
    request
      .del(resourceApiUrl + '/' + user._id)
      .set('X-Access-Token', authToken)
      .accept('application/json')
      .end(function(err, res) {
        if (res.ok) {
          _expect(res.body.message).to.be.a('string');
          _expect(res.body.message).to.match(/(deleted)/g);
        } else {
          throw err;
        }
        done();
      });
  });
});
