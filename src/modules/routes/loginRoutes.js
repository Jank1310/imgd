'use strict';

var validator = require('validator');
var serverError = require('./serverError');

module.exports = function(users, apiKeys) {
  return {
    register: function(req, res) {
      if(!validator.isEmail(req.body.email)) {
        return res.status(400).send({error: 'email malformed', errorCode: 1});
      }
      if(!validator.isLength(req.body.password, 4, 40)) {
        return res.status(400).send({error: 'Password malformed. Minimum 4 digits. Maximum 50 digits.', errorCode: 2});
      }
      if(!validator.isLength(req.body.username, 3, 15)) {
        return res.status(400).send({error: 'Username malformed. Minimum length: 3. Maximum length: 50.', errorCode: 3});
      }

      users.userExists(req.body.email, function(err, exists) {
        if(err) { return serverError(res, err); }
        if(exists) {
          return res.status(409).send('E-mail already registered');
        } else {
          users.addUser(req.body.email, req.body.username, req.body.password, function(_err, user) {
            if(_err) { return serverError(res, _err); }
            return res.status(201).send(user);
          });
        }
      });
    },

    login: function(req, res) {
        var email = req.body.email;
        var password = req.body.password;
        if(!validator.isLength(email, 1) || !validator.isLength(password, 1)) {
          return res.status(401).send();
        }
        users.verifyPassword(email, password, function(err, isValid, userId) {
          if(err) { return serverError(req, res, err); }
          if(!isValid) { return res.status(401).send(); }
          users.getUserDetails(userId, function(_err, user) {
            if(err) { return serverError(req, res, err); }
            apiKeys.createAPIKey(userId, function(__err, apiKey) {
              if(err) { return serverError(req, res, err); }
              user.apiKey = apiKey;
              res.json(user);
            });
          });
        });
    }
  };
};
