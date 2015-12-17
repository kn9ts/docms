require('../../environment');

var request = require('superagent'),
  faker = require('faker'),
  _expect = require('expect.js'),
  resourceApiUrl = 'http://localhost:3000/api/roles',
  _u = require('underscore'),
  bcrypt = require('bcrypt'),
  mongoose = require('../../server/config/database');

var models = mongoose.modelNames();
if (_u.contains(models, 'Users')) {
  var Users = mongoose.model('Users');
} else {
  var Schema = mongoose.Schema;
  var Users = require('../../server/models/users')(mongoose, Schema);
}

describe('roles RESTful API tests', function() {
  var user = {
      username: (faker.internet.userName()).toLowerCase(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName()
    },
    newRole = {
      title: 'viewer'
    },
    role,
    authToken = null;

  before('create user', function(done) {
    // 1st encrypt the user's password and then add them to the DB
    bcrypt.hash(user.password, 10, function(err, hashedPassword) {
      if (err) {
        throw err;
      }
      var newUser = new Users(user);
      newUser.password = hashedPassword;
      // save user
      newUser.save(function(err) {
        if (err) {
          throw err;
        }
        done();
      });
    });
  });

  /**
   * Display a listing of the resource.
   * GET /users
   *
   * @return Response
   */
  it('should not return any roles. Let them know he/she is unauthorised', function(done) {
    request
      .get(resourceApiUrl)
      .accept('application/json')
      .end(function(err, res) {
        _expect(res.status).to.be(401);
        _expect(res.body.error).to.a('string');
        done();
      });
  });

  /**
   * Store a newly created resource in storage.
   * POST /users/login
   *
   * @return Response
   */
  it('should login the user and return API authorisation token.', function(done) {
    request
      .post('http://localhost:3000/api/users/login')
      .send(user)
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
        done();
      });
  });

  /**
   * Display a listing of the resource.
   * GET /users
   *
   * @return Response
   */
  it('should return all roles and if none, an empty array', function(done) {
    request
      .get(resourceApiUrl)
      .set('X-Access-Token', authToken)
      .accept('application/json')
      .end(function(err, res) {
        if (res.ok) {
          // if no documents were found
          if (res.body.roles.length === 0) {
            _expect(res.body.roles).to.be.an(Array);
            _expect(res.body.message).to.be.a('string');
          } else {
            _expect(res.body.roles[0]._id).to.be.a('string');
            _expect(res.body.roles[0].title).to.be.a('string');
          }
          done();
        } else {
          throw err;
        }
      });
  });

  /**
   * Store a newly created resource in storage.
   * POST /users (sign up)
   *
   * @return Response
   */
  it(
    'should NOT store a role with any other title other than viewer, user and admin',
    function(done) {
      var role = {
        title: (faker.internet.userName()).toLowerCase(),
      };
      request
        .post(resourceApiUrl)
        .set('X-Access-Token', authToken)
        .send(role)
        .accept('application/json')
        .end(function(err, res) {
          _expect(res.status).to.be(403);
          done();
        });
    });

  /**
   * Display the specified resource.
   * GET /roles/{id}
   *
   * @param  int  $id
   * @return Response
   */
  it('should display the specified role.', function(done) {
    request
      .get(resourceApiUrl + '/viewer')
      .set('X-Access-Token', authToken)
      .accept('application/json')
      .end(function(err, res) {
        if (res.ok) {
          _expect(res.body.role._id).to.be.a('string');
          _expect(res.body.role.title).to.be(newRole.title);
        } else {
          throw err;
        }
        done();
      });
  });

  /**
   * Update the specified user's role.
   * PUT /users/roles/{id}
   *
   * @param  int  $id
   * @return Response
   */
  it('should update the specified user\'s role.', function(done) {
    request
      .put('localhost:3000/api/roles/user')
      .set('X-Access-Token', authToken)
      .send(newRole)
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
});
