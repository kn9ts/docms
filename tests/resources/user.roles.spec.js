// load the applications environment
require('dotenv').load();

var request = require('superagent'),
  faker = require('faker'),
  _expect = require('expect.js'),
  resourceApiUrl = 'http://localhost:3000/api/documents',
  _u = require('underscore'),
  bcrypt = require('bcrypt'),
  mongoose = require('../../server/config/database');

var models = mongoose.modelNames();
if (_u.contains(models, 'Users')) {
  Users = mongoose.model('Users');
} else {
  var Schema = mongoose.Schema;
  Users = require('../../server/models/users')(mongoose, Schema);
}

describe('Testing user roles', function() {

  var newUser = {
      username: (faker.internet.userName()).toLowerCase(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName()
    },
    userInfoUpdates = {
      role: 'user',
      email: faker.internet.email()
    },
    newDoc = {
      content: faker.lorem.sentence(),
      private: false
    },
    rtndUser,
    doc,
    authToken = null;

  /**
   * Store a newly created resource in storage.
   * POST /users (sign up)
   *
   * @return Response
   */
  it('should create a new user.', function(done) {
    request
      .post('http://localhost:3000/api/users')
      .send(newUser)
      .accept('application/json')
      .end(function(err, res) {
        _expect(res.status).to.be(200);

        var data = res.body.user;
        _expect(data.username).to.be(newUser.username);
        _expect(data._id).to.be.a('string');
        user = data;
        done();
      });
  });

  /**
   * Store a newly created resource in storage.
   * POST /documents
   *
   * @return Response
   */
  it('should login the user and return API authorisation token.', function(done) {
    request
      .post('http://localhost:3000/api/users/login')
      .send(newUser)
      .accept('application/json')
      .end(function(err, res) {
        _expect(res.status).to.be(200);

        var data = res.body.user;
        _expect(res.body.message).to.be.a('string');
        _expect(data.username).to.be(user.username);
        _expect(data._id).to.be.a('string');

        // check if the token has been issued out
        _expect(data.token).to.be.a('string');
        _expect(data.token.length).to.be.greaterThan(100);
        authToken = data.token;
        rtndUser = data;
        done();
      });
  });

  /**
   * Display a listing of the resource.
   * GET /documents
   *
   * @return Response
   */
  it('should return all documents and if none, an empty array', function(done) {
    request
      .get(resourceApiUrl)
      .set('X-Access-Token', authToken)
      .accept('application/json')
      .end(function(err, res) {
        _expect(res.status).to.be(200);
        // if no documents were found
        if (res.body.documents.length === 0) {
          _expect(res.body.documents).to.be.an(Array);
          _expect(res.body.message).to.be.a('string');
        } else {
          _expect(res.body.documents[0]._id).to.be.a('string');
          _expect(res.body.documents[0].content).to.be.a('string');
        }
        done();
      });
  });

  /**
   * Store a newly created resource in storage.
   * POST /documents
   *
   * @return Response
   */
  it('should NOT be able to create a new document(viewing users is restricted to create document).', function(done) {
    request
      .post(resourceApiUrl)
      .set('X-Access-Token', authToken)
      .send(newDoc)
      .accept('application/json')
      .end(function(err, res) {
        _expect(res.status).to.be(401);
        done();
      });
  });

  /**
   * Update the specified resource in storage.
   * PUT /users/{id}
   *
   * @param  int  $id
   * @return Response
   */
  it('should update the user\'s role.', function(done) {
    request
      .put('http://localhost:3000/api/users/' + rtndUser._id)
      .set('X-Access-Token', authToken)
      .send(userInfoUpdates)
      .accept('application/json')
      .end(function(err, res) {
        _expect(res.status).to.be(200);

        var data = res.body;
        _expect(data.message).to.be.a('string');
        _expect(data.message).to.match(/(updated)/);
        authToken = data.user.token;
        rtndUser = data.user;
        done();
      });
  });

  /**
   * Store a newly created resource in storage.
   * POST /documents
   *
   * @return Response
   */
  it('should be able to create a new document.', function(done) {
    request
      .post(resourceApiUrl)
      .set('X-Access-Token', authToken)
      .send(newDoc)
      .accept('application/json')
      .end(function(err, res) {
        _expect(res.status).to.be(200);

        var data = res.body.document;
        _expect(data.content).to.be(newDoc.content);
        _expect(data._id).to.be.a('string');
        doc = data;
        done();
      });
  });

  /**
   * Display the specified resource.
   * GET /documents/{id}
   *
   * @param  int  $id
   * @return Response
   */
  it('should display the specified resource.', function(done) {
    request
      .get(resourceApiUrl + '/' + doc._id)
      .set('X-Access-Token', authToken)
      .accept('application/json')
      .end(function(err, res) {
        _expect(res.status).to.be(200);
        _expect(res.body.document._id).to.be.a('string');
        _expect(res.body.document.content).to.be(newDoc.content);
        done();
      });
  });

  /**
   * Remove the specified resource from storage.
   * DELETE /document/{id}
   *
   * @param  int  $id
   * @return Response
   */
  it('should remove the specified resource from storage.', function(done) {
    request
      .del(resourceApiUrl + '/' + doc._id)
      .set('X-Access-Token', authToken)
      .accept('application/json')
      .end(function(err, res) {
        _expect(res.status).to.be(200);
        _expect(res.body.message).to.be.a('string');
        _expect(res.body.message).to.match(/(deleted)/g);
        done();
      });
  });

});
