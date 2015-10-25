var Role = require('../models/roles');

module.exports = function(api, config) {
  api.route('/roles')
    .get(function(req, res) {
      Role.find(function(err, roles) {
        if (err) {
          res.send(err);
        }
        res.json(roles);
      });
    })
    .post(function(req, res) {
      var role = new Role(req.body);
      role.save(function(err) {
        if (err) {
          res.send(err);
        }
        res.send({
          message: 'Role Added'
        });
      });
    });

  api.route('/roles/:id')
    .put(function(req, res) {
      Role.findOne({
        _id: req.params.id
      }, function(err, role) {
        if (err) {
          res.send(err);
        }

        var prop = 'propertyName';
        for (prop in req.body) {
          role[prop] = req.body[prop];
        }

        // save the role
        role.save(function(err) {
          if (err) {
            res.send(err);
          }
          res.json({
            message: 'Role updated!'
          });
        });
      });
    })
    .get(function(req, res) {
      Role.findOne({
        _id: req.params.id
      }, function(err, role) {
        if (err) {
          res.send(err);
        }
        res.json(role);
      });
    })
    .delete(function(req, res) {
      Role.remove({
        _id: req.params.id
      }, function(err, role) {
        if (err) {
          res.send(err);
        }
        res.json({
          message: 'Successfully deleted'
        });
      });
    });
}
