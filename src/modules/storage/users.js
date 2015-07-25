var redisConfig = require('./redisConfiguration');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');

var users = function(redisClient) {
  //expects valid data, performs no verfication!
  function addUser(email, username, password, cb) {
    redisClient.incr(redisConfig.USRS_ID_KEY, function(err, nextUserId) {
      if(err) { return cb(err); }
      bcrypt.hash(password, null, null, function(_err, passwordHash) {
        if(_err) { return cb(_err); }
          var user = {
            id: nextUserId,
            username: username,
            email: email,
            password: passwordHash
          };
          redisClient.hmset(redisConfig.USERS_HASH_PREFIX + user.id, user, function(_err2) {
            if(_err2) { return cb(_err2); }
            redisClient.hmset(redisConfig.EMAIL_TO_USER_ID_HASH, user.email, user.id, function(_err3) {
              delete user.password;
              cb(_err3, user);
            });
          });
      });
    });
  }

  //check if user with email exists and return the user id
  function userExists(email, cb) {
    redisClient.hget(redisConfig.EMAIL_TO_USER_ID_HASH, email, function(err, result) {
        return cb(err, result !== null, result);
    });
  }

  function getUserDetails(userId, cb) {
    redisClient.hmget(redisConfig.USERS_HASH_PREFIX + userId, 'id', 'username', 'email', function(err, result) {
      if(err) { return cb(err); }
      if(result[0] === null) { cb('User with id ' + userId + ' not found!'); }
      return cb(null, {
        id: result[0],
        username: result[1],
        email: result[2]
      });
    });
  }

  function verifyPassword(email, password, cb) {
    var foundUserId;
    var getHashedUserPassword = function(exists, userId, callback) {
      if(exists === true) {
        foundUserId = userId;
        return redisClient.hget(redisConfig.USERS_HASH_PREFIX + userId, 'password', callback);
      } else {
        return callback(null, null);
      }
    };
    var checkPassword = function(hashedPassword, callback) {
      if(hashedPassword) {
        return bcrypt.compare(password, hashedPassword, callback);
      }
      return callback(null, false);
    };
    var verfiyPasswordComposed = async.seq(userExists, getHashedUserPassword, checkPassword);
    verfiyPasswordComposed(email, function(err, isValid) {
      if(err) { return cb(err); }
      cb(null, isValid, foundUserId);
    });
  }

  return {
    addUser: addUser,
    userExists: userExists,
    verifyPassword: verifyPassword,
    getUserDetails: getUserDetails
  };
};

module.exports = users;
